import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import type { BucketSample } from './types';

interface FlowChartsProps {
  samples: BucketSample[];
  maxHeight: number;
}

interface D3Scale {
  (value: number): number;
  domain: (domain: [number, number]) => D3Scale;
  range: (range: [number, number]) => D3Scale;
  nice: () => D3Scale;
  ticks: (count?: number) => number[];
}

interface D3Line<T> {
  x: (fn: (value: T) => number) => D3Line<T>;
  y: (fn: (value: T) => number) => D3Line<T>;
  curve: (curve: unknown) => D3Line<T>;
  (data: T[]): string | null;
}

interface D3API {
  scaleLinear: () => D3Scale;
  line: <T>() => D3Line<T>;
  curveMonotoneX: unknown;
}

interface D3Window extends Window {
  d3?: D3API;
}

const ChartSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ChartCard = styled.div`
  background: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
`;

const ChartTitle = styled.h3`
  margin: 0 0 0.5rem;
  color: #e1e1e1;
  font-size: 1.1rem;
`;

const Svg = styled.svg`
  width: 100%;
  height: auto;
  display: block;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #b8b8b8;
`;

const LegendItem = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;

  &::before {
    content: '';
    width: 12px;
    height: 3px;
    border-radius: 2px;
    background: ${props => props.$color};
    display: inline-block;
  }
`;

const AxisLabel = styled.text`
  fill: #b8b8b8;
  font-size: 0.7rem;
`;

const FallbackText = styled.p`
  margin: 0.5rem 0 0;
  color: #b8b8b8;
  font-size: 0.85rem;
`;

const useChartSize = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 320, height: 200 });

  useEffect(() => {
    if (!ref.current) {
      return undefined;
    }
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        setSize({
          width: Math.max(240, entry.contentRect.width),
          height: Math.max(160, entry.contentRect.height)
        });
      }
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
};

const FlowCharts: React.FC<FlowChartsProps> = ({ samples, maxHeight }) => {
  const d3 = (window as D3Window).d3;
  const heightChart = useChartSize();
  const flowChart = useChartSize();

  const timeDomain = useMemo<[number, number]>(() => {
    if (samples.length === 0) {
      return [0, 10];
    }
    const start = samples[0].t;
    const end = samples[samples.length - 1].t;
    return [start, Math.max(start + 1, end)];
  }, [samples]);

  const heightDomain = useMemo<[number, number]>(() => [0, Math.max(maxHeight, 0.01)], [maxHeight]);

  const flowDomain = useMemo<[number, number]>(() => {
    if (samples.length === 0) {
      return [-0.005, 0.005];
    }
    let min = 0;
    let max = 0;
    samples.forEach(sample => {
      min = Math.min(min, sample.qNet);
      max = Math.max(max, sample.qIn, sample.qOut, sample.qNet, sample.qSpill);
    });
    if (Math.abs(max - min) < 1e-6) {
      max = min + 0.001;
    }
    return [min, max];
  }, [samples]);

  const renderChart = useCallback((
    width: number,
    height: number,
    lines: Array<{ path: string; color: string }>,
    xScale: D3Scale,
    yScale: D3Scale,
    xTicks: number[],
    yTicks: number[]
  ) => {
    const padding = { top: 10, right: 12, bottom: 26, left: 44 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const gridLines = yTicks.map((tick) => (
      <line
        key={`y-grid-${tick}`}
        x1={padding.left}
        x2={padding.left + chartWidth}
        y1={yScale(tick)}
        y2={yScale(tick)}
        stroke="rgba(255,255,255,0.08)"
      />
    ));

    return (
      <Svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <g>{gridLines}</g>
        {lines.map(line => (
          <path key={line.color} d={line.path} fill="none" stroke={line.color} strokeWidth="2" />
        ))}
        {xTicks.map((tick) => (
          <g key={`x-${tick}`}>
            <line
              x1={xScale(tick)}
              x2={xScale(tick)}
              y1={padding.top + chartHeight}
              y2={padding.top + chartHeight + 4}
              stroke="#666"
            />
            <AxisLabel x={xScale(tick)} y={padding.top + chartHeight + 16} textAnchor="middle">
              {tick.toFixed(0)}s
            </AxisLabel>
          </g>
        ))}
        {yTicks.map((tick) => (
          <g key={`y-${tick}`}>
            <line
              x1={padding.left - 4}
              x2={padding.left}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke="#666"
            />
            <AxisLabel x={padding.left - 8} y={yScale(tick) + 3} textAnchor="end">
              {tick.toFixed(3)}
            </AxisLabel>
          </g>
        ))}
      </Svg>
    );
  }, []);

  const heightChartContent = useMemo(() => {
    if (!d3) {
      return <FallbackText>D3 is not available yet.</FallbackText>;
    }
    const width = heightChart.size.width;
    const height = 200;
    const padding = { top: 10, right: 12, bottom: 26, left: 44 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const xScale = d3.scaleLinear().domain(timeDomain).range([padding.left, padding.left + chartWidth]);
    const yScale = d3.scaleLinear().domain(heightDomain).range([padding.top + chartHeight, padding.top]).nice();

    const line = d3.line<BucketSample>()
      .x((d) => xScale(d.t))
      .y((d) => yScale(d.h))
      .curve(d3.curveMonotoneX);

    const path = samples.length > 1 ? line(samples) ?? '' : '';
    const xTicks = xScale.ticks(5);
    const yTicks = yScale.ticks(4);
    return renderChart(width, height, [{ path, color: '#88c0d0' }], xScale, yScale, xTicks, yTicks);
  }, [d3, heightChart.size.width, heightDomain, renderChart, samples, timeDomain]);

  const flowChartContent = useMemo(() => {
    if (!d3) {
      return <FallbackText>D3 is not available yet.</FallbackText>;
    }
    const width = flowChart.size.width;
    const height = 220;
    const padding = { top: 10, right: 12, bottom: 26, left: 44 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const xScale = d3.scaleLinear().domain(timeDomain).range([padding.left, padding.left + chartWidth]);
    const yScale = d3.scaleLinear().domain(flowDomain).range([padding.top + chartHeight, padding.top]).nice();

    const line = d3.line<BucketSample>()
      .x((d) => xScale(d.t))
      .y((d) => yScale(d.qIn))
      .curve(d3.curveMonotoneX);
    const outLine = d3.line<BucketSample>()
      .x((d) => xScale(d.t))
      .y((d) => yScale(d.qOut))
      .curve(d3.curveMonotoneX);
    const netLine = d3.line<BucketSample>()
      .x((d) => xScale(d.t))
      .y((d) => yScale(d.qNet))
      .curve(d3.curveMonotoneX);
    const spillLine = d3.line<BucketSample>()
      .x((d) => xScale(d.t))
      .y((d) => yScale(d.qSpill))
      .curve(d3.curveMonotoneX);

    const lines = [
      { path: samples.length > 1 ? line(samples) ?? '' : '', color: '#a3be8c' },
      { path: samples.length > 1 ? outLine(samples) ?? '' : '', color: '#bf616a' },
      { path: samples.length > 1 ? netLine(samples) ?? '' : '', color: '#88c0d0' },
      { path: samples.length > 1 ? spillLine(samples) ?? '' : '', color: '#ebcb8b' }
    ];
    const xTicks = xScale.ticks(5);
    const yTicks = yScale.ticks(4);
    return renderChart(width, height, lines, xScale, yScale, xTicks, yTicks);
  }, [d3, flowChart.size.width, flowDomain, renderChart, samples, timeDomain]);

  return (
    <ChartSection>
      <ChartCard ref={heightChart.ref}>
        <ChartTitle>Height vs time</ChartTitle>
        {heightChartContent}
        <Legend>
          <LegendItem $color="#88c0d0">h(t) [m]</LegendItem>
        </Legend>
      </ChartCard>
      <ChartCard ref={flowChart.ref}>
        <ChartTitle>Flows vs time</ChartTitle>
        {flowChartContent}
        <Legend>
          <LegendItem $color="#a3be8c">q_in</LegendItem>
          <LegendItem $color="#bf616a">q_out</LegendItem>
          <LegendItem $color="#88c0d0">q_net</LegendItem>
          <LegendItem $color="#ebcb8b">q_spill</LegendItem>
        </Legend>
      </ChartCard>
    </ChartSection>
  );
};

export default FlowCharts;
