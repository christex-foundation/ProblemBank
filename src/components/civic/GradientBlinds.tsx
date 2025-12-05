'use client';
import { useEffect, useRef } from 'react';

interface GradientBlindsProps {
  className?: string;
}

export default function GradientBlinds({ className = '' }: GradientBlindsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing content
    container.innerHTML = '';

    // Create blinds
    const numBlinds = 8;
    const colors = [
      '#E6B800', // Primary gold
      '#f7efe3', // Light cream
      '#f2e8dc', // Light tan
      '#fffaf3', // Off-white
      '#e8ddd0', // Light border
    ];

    for (let i = 0; i < numBlinds; i++) {
      const blind = document.createElement('div');
      blind.className = 'gradient-blind';

      // Create gradient with app colors
      const color1 = colors[i % colors.length];
      const color2 = colors[(i + 1) % colors.length];
      const color3 = colors[(i + 2) % colors.length];

      blind.style.cssText = `
        position: absolute;
        top: 0;
        left: ${(i / numBlinds) * 100}%;
        width: ${100 / numBlinds}%;
        height: 100%;
        background: linear-gradient(
          180deg,
          ${color1}00 0%,
          ${color1}40 20%,
          ${color2}60 50%,
          ${color3}40 80%,
          ${color3}00 100%
        );
        animation: blindsMove ${8 + i * 0.5}s ease-in-out infinite;
        animation-delay: ${i * 0.2}s;
        opacity: 0.6;
        filter: blur(40px);
        transform-origin: center center;
      `;

      container.appendChild(blind);
    }

    // Add keyframe animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes blindsMove {
        0%, 100% {
          transform: translateY(0%) scaleY(1);
          opacity: 0.6;
        }
        25% {
          transform: translateY(-10%) scaleY(1.1);
          opacity: 0.8;
        }
        50% {
          transform: translateY(5%) scaleY(0.9);
          opacity: 0.5;
        }
        75% {
          transform: translateY(-5%) scaleY(1.05);
          opacity: 0.7;
        }
      }
    `;
    document.head.appendChild(styleSheet);

    return () => {
      if (document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
}
