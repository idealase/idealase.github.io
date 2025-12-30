import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BucketParams, BucketSample, BucketSimulation, BucketState } from './types';

const FIXED_DT = 1 / 120;
const MAX_FRAME_DT = 0.1;
const SAMPLE_STRIDE = 4;
const WINDOW_SECONDS = 60;
const PUBLISH_INTERVAL = 1 / 30;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const computeBucketArea = (radius: number) => Math.max(Math.PI * radius * radius, 1e-6);

const computeInflow = (t: number, params: BucketParams) => {
  switch (params.inflowPattern) {
    case 'constant':
      return Math.max(params.inflowRate, 0);
    case 'step':
      return params.stepEnabled ? Math.max(params.inflowRate, 0) : 0;
    case 'sine': {
      const omega = (2 * Math.PI) / Math.max(params.inflowPeriod, 0.1);
      const base = Math.max(params.inflowBase, 0);
      const amplitude = Math.max(params.inflowAmplitude, 0);
      return Math.max(0, base + amplitude * Math.sin(omega * t));
    }
    case 'pulse': {
      const period = Math.max(params.pulsePeriod, 0.1);
      const phase = t % period;
      const onWindow = period * clamp(params.pulseDutyCycle, 0, 1);
      return phase < onWindow ? Math.max(params.inflowRate, 0) : 0;
    }
    default:
      return 0;
  }
};

const computeOutflow = (height: number, params: BucketParams) => {
  const safeHeight = Math.max(height, 0);
  if (params.outflowLaw === 'linear') {
    return Math.max(params.linearOutflowK, 0) * safeHeight;
  }
  return Math.max(params.sqrtOutflowK, 0) * Math.sqrt(safeHeight);
};

export const useBucketSimulation = (params: BucketParams): BucketSimulation => {
  const [running, setRunning] = useState(false);
  const [state, setState] = useState<BucketState>(() => {
    const area = computeBucketArea(params.bucketRadius);
    const height = clamp(params.initialHeight, 0, params.bucketHeight);
    return {
      simTime: 0,
      height,
      volume: height * area,
      qIn: 0,
      qOut: 0,
      qNet: 0,
      qSpill: 0
    };
  });
  const [samples, setSamples] = useState<BucketSample[]>([]);

  const runningRef = useRef(running);
  const paramsRef = useRef(params);
  const areaRef = useRef(computeBucketArea(params.bucketRadius));
  const heightRef = useRef(state.height);
  const timeRef = useRef(state.simTime);
  const accumulatorRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const sampleBufferRef = useRef<BucketSample[]>([]);
  const stepCountRef = useRef(0);
  const lastPublishRef = useRef(0);

  const area = useMemo(() => computeBucketArea(params.bucketRadius), [params.bucketRadius]);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    areaRef.current = computeBucketArea(params.bucketRadius);
  }, [params.bucketRadius]);

  useEffect(() => {
    const clampedHeight = clamp(heightRef.current, 0, params.bucketHeight);
    heightRef.current = clampedHeight;
    setState((prev) => ({
      ...prev,
      height: clampedHeight,
      volume: clampedHeight * area
    }));
  }, [params.bucketHeight, area]);

  const pushSample = useCallback(
    (sample: BucketSample) => {
      sampleBufferRef.current.push(sample);
      const cutoff = sample.t - WINDOW_SECONDS;
      while (sampleBufferRef.current.length > 0 && sampleBufferRef.current[0].t < cutoff) {
        sampleBufferRef.current.shift();
      }
    },
    []
  );

  const integrateStep = useCallback(() => {
    const currentParams = paramsRef.current;
    const safeHeight = clamp(heightRef.current, 0, currentParams.bucketHeight);
    const qIn = computeInflow(timeRef.current, currentParams);
    const qOut = computeOutflow(safeHeight, currentParams);
    let qSpill = 0;
    if (safeHeight >= currentParams.bucketHeight - 1e-6) {
      const net = qIn - qOut;
      if (net > 0) {
        qSpill = net;
      }
    }
    const dh = FIXED_DT * (qIn - qOut - qSpill) / areaRef.current;
    const nextHeight = clamp(safeHeight + dh, 0, currentParams.bucketHeight);

    heightRef.current = nextHeight;
    timeRef.current += FIXED_DT;
    stepCountRef.current += 1;

    if (stepCountRef.current % SAMPLE_STRIDE === 0) {
      const qNet = qIn - qOut - qSpill;
      pushSample({
        t: timeRef.current,
        h: nextHeight,
        qIn,
        qOut,
        qNet,
        qSpill
      });
    }
  }, [pushSample]);

  const animate = useCallback(
    (timestamp: number) => {
      if (!runningRef.current) {
        lastFrameRef.current = null;
        return;
      }
      if (lastFrameRef.current === null) {
        lastFrameRef.current = timestamp;
      }
      const dt = Math.min((timestamp - lastFrameRef.current) / 1000, MAX_FRAME_DT);
      lastFrameRef.current = timestamp;
      accumulatorRef.current += dt;

      while (accumulatorRef.current >= FIXED_DT) {
        integrateStep();
        accumulatorRef.current -= FIXED_DT;
      }

      const shouldPublish = timeRef.current - lastPublishRef.current >= PUBLISH_INTERVAL;
      if (shouldPublish) {
        const currentParams = paramsRef.current;
        const qIn = computeInflow(timeRef.current, currentParams);
        const qOut = computeOutflow(heightRef.current, currentParams);
        const qSpill = heightRef.current >= currentParams.bucketHeight - 1e-6 ? Math.max(qIn - qOut, 0) : 0;
        const qNet = qIn - qOut - qSpill;
        lastPublishRef.current = timeRef.current;
        setState({
          simTime: timeRef.current,
          height: heightRef.current,
          volume: heightRef.current * areaRef.current,
          qIn,
          qOut,
          qNet,
          qSpill
        });
        setSamples([...sampleBufferRef.current]);
      }

      requestAnimationFrame(animate);
    },
    [integrateStep]
  );

  useEffect(() => {
    if (!running) {
      return undefined;
    }
    const handle = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(handle);
  }, [animate, running]);

  const start = useCallback(() => {
    if (runningRef.current) {
      return;
    }
    runningRef.current = true;
    setRunning(true);
  }, [animate]);

  const pause = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    lastFrameRef.current = null;
  }, []);

  const reset = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    accumulatorRef.current = 0;
    lastFrameRef.current = null;
    lastPublishRef.current = 0;
    stepCountRef.current = 0;
    sampleBufferRef.current = [];
    timeRef.current = 0;
    heightRef.current = clamp(params.initialHeight, 0, params.bucketHeight);
    const currentParams = paramsRef.current;
    const qIn = computeInflow(0, currentParams);
    const qOut = computeOutflow(heightRef.current, currentParams);
    const qSpill = heightRef.current >= currentParams.bucketHeight - 1e-6 ? Math.max(qIn - qOut, 0) : 0;
    const qNet = qIn - qOut - qSpill;
    setState({
      simTime: 0,
      height: heightRef.current,
      volume: heightRef.current * areaRef.current,
      qIn,
      qOut,
      qNet,
      qSpill
    });
    setSamples([]);
  }, []);

  return {
    state,
    samples,
    running,
    start,
    pause,
    reset
  };
};
