import React, { useEffect, useState } from 'react';

interface MatchBurstProps {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}

const MatchBurst: React.FC<MatchBurstProps> = ({ x, y, color, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  const particles = Array.from({ length: 8 }).map((_, i) => {
    const angle = (i * 45) * (Math.PI / 180);
    const distance = 60;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    
    // 4 sparkle diamonds (◆) at cardinal, 4 small leaf shapes (🍃) at diagonal
    const isCardinal = i % 2 === 0;
    const symbol = isCardinal ? '◆' : '🍃';

    return (
      <div
        key={i}
        className="absolute pointer-events-none flex items-center justify-center"
        style={{
          color: color,
          left: '50%',
          top: '50%',
          fontSize: isCardinal ? '14px' : '12px',
          textShadow: `0 0 8px ${color}, 0 0 4px var(--jungle-green)`,
          '--dx': `${dx}px`,
          '--dy': `${dy}px`,
          animation: 'jungleBurst 0.6s ease-out forwards',
        } as React.CSSProperties}
      >
        {symbol}
      </div>
    );
  });

  return (
    <div 
      className="absolute z-[1000] pointer-events-none"
      style={{ left: x, top: y, width: 0, height: 0 }}
    >
      {/* Ring Burst */}
      <div 
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: `2px solid ${color}`,
          transform: 'translate(-50%, -50%)',
          animation: 'ringBurst 0.5s ease-out forwards',
        }}
      />
      
      {particles}
      
      <style>{`
        @keyframes jungleBurst {
          0%   { transform: translate(-50%, -50%) scale(0) rotate(0deg); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1.5) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MatchBurst;
