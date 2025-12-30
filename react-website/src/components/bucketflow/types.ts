export type OutflowLaw = 'linear' | 'sqrt';
export type InflowPattern = 'constant' | 'sine' | 'step' | 'pulse';

export interface BucketParams {
  bucketHeight: number;
  bucketRadius: number;
  initialHeight: number;
  inflowPattern: InflowPattern;
  inflowRate: number;
  inflowBase: number;
  inflowAmplitude: number;
  inflowPeriod: number;
  stepEnabled: boolean;
  pulsePeriod: number;
  pulseDutyCycle: number;
  outflowLaw: OutflowLaw;
  linearOutflowK: number;
  sqrtOutflowK: number;
}

export interface BucketSample {
  t: number;
  h: number;
  qIn: number;
  qOut: number;
  qNet: number;
  qSpill: number;
}

export interface BucketState {
  simTime: number;
  height: number;
  volume: number;
  qIn: number;
  qOut: number;
  qNet: number;
  qSpill: number;
}

export interface BucketSimulation {
  state: BucketState;
  samples: BucketSample[];
  running: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}
