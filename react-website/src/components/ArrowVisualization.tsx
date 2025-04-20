import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const VisualizationContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3rem 0;
`;

const CanvasContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 350px;
  aspect-ratio: 1;
`;

const StyledCanvas = styled.canvas`
  width: 100%;
  height: 100%;
  background-color: rgba(35, 35, 35, 0.6);
  border-radius: 50%;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h3`
  color: #e1e1e1;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(to right, #5e81ac, #88c0d0);
  }
`;

interface ArrowVisualizationProps {
  title?: string;
}

const ArrowVisualization: React.FC<ArrowVisualizationProps> = ({ title = 'Progress' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set up the canvas with a high resolution
    const setCanvasDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      return { width: rect.width, height: rect.height };
    };
    
    const { width, height } = setCanvasDimensions();
    
    // Arrow properties
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    const arrowLength = radius - 10;
    const arrowHeadSize = 15;
    
    // Colors for the visualization
    const circleColor = '#333333';
    const arrowColor = '#88c0d0';
    const centerDotColor = '#5e81ac';
    const tickColor = '#444444';
    
    // Draw tick marks around the circle to represent degrees
    const drawTickMarks = () => {
      ctx.strokeStyle = tickColor;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < 36; i++) {
        const angle = (i * 10) * Math.PI / 180;
        
        const innerRadius = i % 9 === 0 ? radius - 10 : radius - 5;
        const startX = centerX + Math.cos(angle) * innerRadius;
        const startY = centerY + Math.sin(angle) * innerRadius;
        const endX = centerX + Math.cos(angle) * radius;
        const endY = centerY + Math.sin(angle) * radius;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        
        // Add labels for cardinal directions
        if (i % 9 === 0) {
          let label;
          switch(i) {
            case 0: label = 'E'; break;
            case 9: label = 'S'; break;
            case 18: label = 'W'; break;
            case 27: label = 'N'; break;
            default: label = '';
          }
          
          const labelX = centerX + Math.cos(angle) * (radius - 20);
          const labelY = centerY + Math.sin(angle) * (radius - 20);
          
          ctx.fillStyle = '#88c0d0';
          ctx.font = '11px "Fira Code", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, labelX, labelY);
        }
      }
    };
    
    // Draw the arrowhead
    const drawArrowHead = (x: number, y: number, angle: number, size: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - size * Math.cos(angle - Math.PI / 6), 
                y - size * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x - size * Math.cos(angle + Math.PI / 6), 
                y - size * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fillStyle = arrowColor;
      ctx.fill();
    };
    
    // Draw the arrow at the specified angle
    const drawArrow = (angle: number) => {
      // More robust canvas clearing - completely reset the canvas
      ctx.save();
      
      // Reset the transformation to identity matrix
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      
      // Clear the entire canvas including transforms
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Restore the canvas state
      ctx.restore();
      
      // For extra measure, fill with the background color to ensure complete clearing
      ctx.fillStyle = 'rgba(35, 35, 35, 0.6)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 10, 0, Math.PI * 2, false);
      ctx.fill();
      
      // Draw tick marks around the circle
      drawTickMarks();
      
      // Calculate arrow end point
      const arrowEndX = centerX + Math.cos(angle) * arrowLength;
      const arrowEndY = centerY + Math.sin(angle) * arrowLength;
      
      // Draw arrow line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(arrowEndX, arrowEndY);
      ctx.strokeStyle = arrowColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw arrow head
      drawArrowHead(arrowEndX, arrowEndY, angle, arrowHeadSize);
      
      // Draw center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2, false);
      ctx.fillStyle = centerDotColor;
      ctx.fill();
      
      // Display the angle in degrees
      // Add 90 degrees to fix the angle display (0 should be at the top)
      const degrees = Math.round(((angle + Math.PI/2) * 180 / Math.PI + 360) % 360);
      ctx.fillStyle = '#e1e1e1';
      ctx.font = '12px "Fira Code", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${degrees}°`, centerX, centerY + radius + 15);
    };
    
    // Initial draw
    drawArrow(0);
    
    // Event handlers for tracking cursor across entire document
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const canvasCenterX = rect.left + centerX;
      const canvasCenterY = rect.top + centerY;
      
      const dx = e.clientX - canvasCenterX;
      const dy = e.clientY - canvasCenterY;
      const angle = Math.atan2(dy, dx);
      
      drawArrow(angle);
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      
      const rect = canvas.getBoundingClientRect();
      const canvasCenterX = rect.left + centerX;
      const canvasCenterY = rect.top + centerY;
      
      const dx = touch.clientX - canvasCenterX;
      const dy = touch.clientY - canvasCenterY;
      const angle = Math.atan2(dy, dx);
      
      drawArrow(angle);
    };
    
    // Add event listeners to the document instead of just the canvas
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    // Clean up event listeners on component unmount
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);
  
  return (
    <VisualizationContainer>
      <Title>{title}</Title>
      <CanvasContainer>
        <StyledCanvas ref={canvasRef} />
      </CanvasContainer>
    </VisualizationContainer>
  );
};

export default ArrowVisualization;