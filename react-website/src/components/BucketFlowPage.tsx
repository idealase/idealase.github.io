import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import BucketViz from './bucketflow/BucketViz';
import FlowCharts from './bucketflow/FlowCharts';
import { useBucketSimulation } from './bucketflow/useBucketSimulation';
import type { BucketParams, InflowPattern, OutflowLaw } from './bucketflow/types';

const PageContainer = styled.div`
  min-height: 100vh;
  background: #141414;
  padding: 2rem 1.5rem 4rem;
  color: #e1e1e1;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: 960px) {
    grid-template-columns: 1.1fr 1.2fr;
    align-items: start;
  }
`;

const Panel = styled.section`
  background: rgba(25, 25, 25, 0.85);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  font-size: 2rem;
  color: #e1e1e1;
`;

const Subtitle = styled.p`
  margin: 0 0 1.5rem;
  color: #b8b8b8;
  line-height: 1.5;
`;

const Equation = styled.div`
  font-size: 0.95rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(94, 129, 172, 0.12);
  color: #88c0d0;
  margin-bottom: 1.5rem;
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #b8b8b8;
`;

const RangeInput = styled.input`
  width: 100%;
  accent-color: #88c0d0;
  height: 24px;
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(136, 192, 208, 0.4);
  background: #1f1f1f;
  color: #e1e1e1;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: #88c0d0;
  color: #0e0e0e;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(Button)`
  background: rgba(136, 192, 208, 0.25);
  color: #e1e1e1;
`;

const ReadoutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ReadoutCard = styled.div`
  background: rgba(30, 30, 30, 0.75);
  border-radius: 12px;
  padding: 0.75rem 1rem;
`;

const ReadoutLabel = styled.div`
  font-size: 0.8rem;
  color: #b8b8b8;
`;

const ReadoutValue = styled.div`
  font-size: 1.1rem;
  color: #e1e1e1;
  margin-top: 0.25rem;
`;

const HelperText = styled.p`
  margin: 0.5rem 0 0;
  font-size: 0.8rem;
  color: #9aa0a6;
`;

const ToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #b8b8b8;
`;

const defaultParams: BucketParams = {
  bucketHeight: 0.4,
  bucketRadius: 0.15,
  initialHeight: 0.2,
  inflowPattern: 'constant',
  inflowRate: 0.002,
  inflowBase: 0.001,
  inflowAmplitude: 0.001,
  inflowPeriod: 8,
  stepEnabled: true,
  pulsePeriod: 6,
  pulseDutyCycle: 0.4,
  outflowLaw: 'linear',
  linearOutflowK: 0.01,
  sqrtOutflowK: 0.002
};

const BucketFlowPage: React.FC = () => {
  const [params, setParams] = useState<BucketParams>(defaultParams);
  const { state, samples, running, start, pause, reset } = useBucketSimulation(params);

  useEffect(() => {
    document.title = 'Bucket Flow Calculus - sandford.systems';
  }, []);

  const area = useMemo(() => Math.PI * params.bucketRadius * params.bucketRadius, [params.bucketRadius]);

  const updateParam = <K extends keyof BucketParams>(key: K, value: BucketParams[K]) => {
    setParams(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'bucketHeight') {
        next.initialHeight = Math.min(next.initialHeight, value as number);
      }
      return next;
    });
  };

  const formatMeters = (value: number) => value.toFixed(3);
  const formatFlow = (value: number) => value.toFixed(4);

  const inflowOptions: Array<{ label: string; value: InflowPattern }> = [
    { label: 'Constant', value: 'constant' },
    { label: 'Sine', value: 'sine' },
    { label: 'Step', value: 'step' },
    { label: 'Pulse train', value: 'pulse' }
  ];

  const outflowOptions: Array<{ label: string; value: OutflowLaw }> = [
    { label: 'Linear', value: 'linear' },
    { label: 'Sqrt (Torricelli)', value: 'sqrt' }
  ];

  return (
    <PageContainer>
      <Title>Bucket Flow Calculus</Title>
      <Subtitle>
        Explore how the water height changes in real time. The rate of change is always
        <strong> inflow − outflow</strong>, scaled by the bucket area.
      </Subtitle>
      <Equation>dh/dt = (q_in − q_out − q_spill) / A_bucket</Equation>

      <Layout>
        <Panel>
          <BucketViz height={state.height} maxHeight={params.bucketHeight} qOut={state.qOut} />
          <ReadoutGrid>
            <ReadoutCard>
              <ReadoutLabel>Time</ReadoutLabel>
              <ReadoutValue>{state.simTime.toFixed(1)} s</ReadoutValue>
            </ReadoutCard>
            <ReadoutCard>
              <ReadoutLabel>Height</ReadoutLabel>
              <ReadoutValue>{formatMeters(state.height)} m</ReadoutValue>
              <HelperText>{(state.height * 100).toFixed(1)} cm</HelperText>
            </ReadoutCard>
            <ReadoutCard>
              <ReadoutLabel>Volume</ReadoutLabel>
              <ReadoutValue>{(state.volume * 1000).toFixed(1)} L</ReadoutValue>
              <HelperText>{state.volume.toFixed(4)} m³</HelperText>
            </ReadoutCard>
            <ReadoutCard>
              <ReadoutLabel>q_in</ReadoutLabel>
              <ReadoutValue>{formatFlow(state.qIn)} m³/s</ReadoutValue>
              <HelperText>{(state.qIn * 1000).toFixed(2)} L/s</HelperText>
            </ReadoutCard>
            <ReadoutCard>
              <ReadoutLabel>q_out</ReadoutLabel>
              <ReadoutValue>{formatFlow(state.qOut)} m³/s</ReadoutValue>
              <HelperText>{(state.qOut * 1000).toFixed(2)} L/s</HelperText>
            </ReadoutCard>
            <ReadoutCard>
              <ReadoutLabel>q_net</ReadoutLabel>
              <ReadoutValue>{formatFlow(state.qNet)} m³/s</ReadoutValue>
              <HelperText>{(state.qNet * 1000).toFixed(2)} L/s</HelperText>
            </ReadoutCard>
            <ReadoutCard>
              <ReadoutLabel>Spill</ReadoutLabel>
              <ReadoutValue>{formatFlow(state.qSpill)} m³/s</ReadoutValue>
              <HelperText>{(state.qSpill * 1000).toFixed(2)} L/s</HelperText>
            </ReadoutCard>
            <ReadoutCard>
              <ReadoutLabel>Bucket area</ReadoutLabel>
              <ReadoutValue>{area.toFixed(3)} m²</ReadoutValue>
            </ReadoutCard>
          </ReadoutGrid>
        </Panel>

        <Panel>
          <ButtonRow>
            {running ? (
              <SecondaryButton onClick={pause} type="button">Pause</SecondaryButton>
            ) : (
              <Button onClick={start} type="button">Start</Button>
            )}
            <SecondaryButton onClick={reset} type="button">Reset</SecondaryButton>
          </ButtonRow>

          <ControlsGrid>
            <ControlGroup>
              <LabelRow>
                <span>Bucket height (H_MAX)</span>
                <span>{formatMeters(params.bucketHeight)} m</span>
              </LabelRow>
              <RangeInput
                type="range"
                min={0.1}
                max={1}
                step={0.01}
                value={params.bucketHeight}
                onChange={(event) => updateParam('bucketHeight', Number(event.target.value))}
              />
            </ControlGroup>
            <ControlGroup>
              <LabelRow>
                <span>Bucket radius</span>
                <span>{formatMeters(params.bucketRadius)} m</span>
              </LabelRow>
              <RangeInput
                type="range"
                min={0.05}
                max={0.3}
                step={0.01}
                value={params.bucketRadius}
                onChange={(event) => updateParam('bucketRadius', Number(event.target.value))}
              />
            </ControlGroup>
            <ControlGroup>
              <LabelRow>
                <span>Initial height h₀</span>
                <span>{formatMeters(params.initialHeight)} m</span>
              </LabelRow>
              <RangeInput
                type="range"
                min={0}
                max={params.bucketHeight}
                step={0.01}
                value={params.initialHeight}
                onChange={(event) => updateParam('initialHeight', Number(event.target.value))}
              />
            </ControlGroup>
            <ControlGroup>
              <LabelRow>
                <span>Outflow law</span>
              </LabelRow>
              <Select
                value={params.outflowLaw}
                onChange={(event) => updateParam('outflowLaw', event.target.value as OutflowLaw)}
              >
                {outflowOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </ControlGroup>
            {params.outflowLaw === 'linear' ? (
              <ControlGroup>
                <LabelRow>
                  <span>Linear k</span>
                  <span>{params.linearOutflowK.toFixed(3)}</span>
                </LabelRow>
                <RangeInput
                  type="range"
                  min={0}
                  max={0.1}
                  step={0.001}
                  value={params.linearOutflowK}
                  onChange={(event) => updateParam('linearOutflowK', Number(event.target.value))}
                />
                <HelperText>q_out = k · h (m³/s)</HelperText>
              </ControlGroup>
            ) : (
              <ControlGroup>
                <LabelRow>
                  <span>Hole constant (sqrt law)</span>
                  <span>{params.sqrtOutflowK.toFixed(3)}</span>
                </LabelRow>
                <RangeInput
                  type="range"
                  min={0}
                  max={0.02}
                  step={0.0005}
                  value={params.sqrtOutflowK}
                  onChange={(event) => updateParam('sqrtOutflowK', Number(event.target.value))}
                />
                <HelperText>q_out = k · √h (m³/s)</HelperText>
              </ControlGroup>
            )}
            <ControlGroup>
              <LabelRow>
                <span>Inflow pattern</span>
              </LabelRow>
              <Select
                value={params.inflowPattern}
                onChange={(event) => updateParam('inflowPattern', event.target.value as InflowPattern)}
              >
                {inflowOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Select>
            </ControlGroup>

            {(params.inflowPattern === 'constant' || params.inflowPattern === 'step' || params.inflowPattern === 'pulse') && (
              <ControlGroup>
                <LabelRow>
                  <span>Inflow rate</span>
                  <span>{formatFlow(params.inflowRate)} m³/s</span>
                </LabelRow>
                <RangeInput
                  type="range"
                  min={0}
                  max={0.01}
                  step={0.0002}
                  value={params.inflowRate}
                  onChange={(event) => updateParam('inflowRate', Number(event.target.value))}
                />
              </ControlGroup>
            )}

            {params.inflowPattern === 'sine' && (
              <>
                <ControlGroup>
                  <LabelRow>
                    <span>Base inflow</span>
                    <span>{formatFlow(params.inflowBase)} m³/s</span>
                  </LabelRow>
                  <RangeInput
                    type="range"
                    min={0}
                    max={0.008}
                    step={0.0002}
                    value={params.inflowBase}
                    onChange={(event) => updateParam('inflowBase', Number(event.target.value))}
                  />
                </ControlGroup>
                <ControlGroup>
                  <LabelRow>
                    <span>Amplitude</span>
                    <span>{formatFlow(params.inflowAmplitude)} m³/s</span>
                  </LabelRow>
                  <RangeInput
                    type="range"
                    min={0}
                    max={0.008}
                    step={0.0002}
                    value={params.inflowAmplitude}
                    onChange={(event) => updateParam('inflowAmplitude', Number(event.target.value))}
                  />
                </ControlGroup>
                <ControlGroup>
                  <LabelRow>
                    <span>Period</span>
                    <span>{params.inflowPeriod.toFixed(1)} s</span>
                  </LabelRow>
                  <RangeInput
                    type="range"
                    min={2}
                    max={20}
                    step={0.5}
                    value={params.inflowPeriod}
                    onChange={(event) => updateParam('inflowPeriod', Number(event.target.value))}
                  />
                </ControlGroup>
              </>
            )}

            {params.inflowPattern === 'step' && (
              <ControlGroup>
                <ToggleRow>
                  <input
                    type="checkbox"
                    checked={params.stepEnabled}
                    onChange={(event) => updateParam('stepEnabled', event.target.checked)}
                  />
                  Step on/off
                </ToggleRow>
                <HelperText>Toggle inflow on/off instantly.</HelperText>
              </ControlGroup>
            )}

            {params.inflowPattern === 'pulse' && (
              <>
                <ControlGroup>
                  <LabelRow>
                    <span>Pulse period</span>
                    <span>{params.pulsePeriod.toFixed(1)} s</span>
                  </LabelRow>
                  <RangeInput
                    type="range"
                    min={1}
                    max={20}
                    step={0.5}
                    value={params.pulsePeriod}
                    onChange={(event) => updateParam('pulsePeriod', Number(event.target.value))}
                  />
                </ControlGroup>
                <ControlGroup>
                  <LabelRow>
                    <span>Duty cycle</span>
                    <span>{(params.pulseDutyCycle * 100).toFixed(0)}%</span>
                  </LabelRow>
                  <RangeInput
                    type="range"
                    min={0.1}
                    max={0.9}
                    step={0.05}
                    value={params.pulseDutyCycle}
                    onChange={(event) => updateParam('pulseDutyCycle', Number(event.target.value))}
                  />
                </ControlGroup>
              </>
            )}
          </ControlsGrid>
          <HelperText>
            Adjust sliders while running. The simulator integrates at a fixed time step and clamps
            height between 0 and H_MAX to avoid numerical blow-up.
          </HelperText>
        </Panel>
      </Layout>

      <FlowCharts samples={samples} maxHeight={params.bucketHeight} />
    </PageContainer>
  );
};

export default BucketFlowPage;
