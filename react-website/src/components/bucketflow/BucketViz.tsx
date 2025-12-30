import React from 'react';
import styled from 'styled-components';

interface BucketVizProps {
  height: number;
  maxHeight: number;
  qOut: number;
}

const VizWrapper = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
`;

const Svg = styled.svg`
  width: 100%;
  height: auto;
  display: block;
`;

const formatPercent = (value: number) => Math.min(Math.max(value, 0), 1);

const BucketViz: React.FC<BucketVizProps> = ({ height, maxHeight, qOut }) => {
  const normalized = maxHeight > 0 ? formatPercent(height / maxHeight) : 0;
  const waterHeight = 180 * normalized;
  const waterY = 210 - waterHeight;
  const streamLength = Math.min(50, qOut * 20000);

  return (
    <VizWrapper>
      <Svg viewBox="0 0 220 260" role="img" aria-label="Bucket water level visualization">
        <defs>
          <clipPath id="bucket-clip">
            <rect x="50" y="30" width="120" height="180" rx="14" ry="14" />
          </clipPath>
        </defs>

        <rect x="50" y="30" width="120" height="180" rx="14" ry="14" fill="none" stroke="#88c0d0" strokeWidth="4" />
        <rect x="50" y={waterY} width="120" height={waterHeight} fill="#5e81ac" clipPath="url(#bucket-clip)" />

        <circle cx="170" cy="194" r="5" fill="#88c0d0" />
        <rect x="168" y={200} width="4" height={streamLength} fill="#88c0d0" opacity={qOut > 0 ? 0.9 : 0} />

        <rect x="40" y="20" width="140" height="200" rx="16" ry="16" fill="none" stroke="rgba(136, 192, 208, 0.2)" strokeWidth="8" />
      </Svg>
    </VizWrapper>
  );
};

export default BucketViz;
