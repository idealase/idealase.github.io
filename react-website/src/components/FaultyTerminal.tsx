import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const TerminalContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: #0a0a0a;
  z-index: 0;
`;

const TerminalMatrix = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  line-height: 1.2;
  color: #88c0d0;
  opacity: 0.6;
  text-shadow: 0 0 5px #88c0d0;
  white-space: pre;
  overflow: hidden;
`;

const ScanLine = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'position',
})<{ position: number }>`
  position: absolute;
  top: ${props => props.position}%;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(136, 192, 208, 0.8) 50%, 
    transparent 100%
  );
  animation: scanline 3s linear infinite;
  z-index: 1;

  @keyframes scanline {
    0% { transform: translateY(-100vh); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
`;

const GlitchOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(136, 192, 208, 0.03) 2px,
      rgba(136, 192, 208, 0.03) 4px
    );
  z-index: 2;
  animation: flicker 0.15s linear infinite alternate;

  @keyframes flicker {
    0% { opacity: 0.97; }
    100% { opacity: 1; }
  }
`;

const FaultyTerminal: React.FC = () => {
  const matrixRef = useRef<HTMLDivElement>(null);
  const [scanLinePosition, setScanLinePosition] = useState(0);

  // Characters to use in the terminal matrix
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  useEffect(() => {
    const matrix = matrixRef.current;
    if (!matrix) return;

    const updateMatrix = () => {
      const containerWidth = matrix.clientWidth;
      const containerHeight = matrix.clientHeight;
      const cols = Math.floor(containerWidth / 8); // 8px char width estimate
      const rows = Math.floor(containerHeight / 14); // 14px line height estimate
      
      let content = '';
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Randomly decide whether to show a character or space
          if (Math.random() < 0.1) {
            // Add glitch effect - occasionally show corrupted characters
            if (Math.random() < 0.05) {
              content += chars[Math.floor(Math.random() * chars.length)];
            } else {
              content += chars[Math.floor(Math.random() * 10)]; // Mostly binary
            }
          } else {
            content += ' ';
          }
        }
        content += '\n';
      }
      
      matrix.textContent = content;
    };

    // Initial matrix generation
    updateMatrix();

    // Update matrix periodically for glitch effect
    const matrixInterval = setInterval(() => {
      updateMatrix();
    }, 100);

    // Animate scan line position
    const scanLineInterval = setInterval(() => {
      setScanLinePosition(prev => (prev + 0.5) % 100);
    }, 50);

    // Cleanup
    return () => {
      clearInterval(matrixInterval);
      clearInterval(scanLineInterval);
    };
  }, [chars]);

  return (
    <TerminalContainer>
      <TerminalMatrix ref={matrixRef} />
      <ScanLine position={scanLinePosition} />
      <GlitchOverlay />
    </TerminalContainer>
  );
};

export default FaultyTerminal;