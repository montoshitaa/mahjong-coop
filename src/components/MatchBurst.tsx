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
    const distance = 40;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    return (
      <div
        key={i}
        className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
        style={{
          backgroundColor: color,
          left: '50%',
          top: '50%',
          '--dx': `${dx}px`,
          '--dy': `${dy}px`,
          animation: 'burst 0.5s ease-out forwards',
        } as React.CSSProperties}
      />
    );
  });

  return (
    <div 
      className="absolute z-[1000] pointer-events-none"
      style={{ left: x, top: y, width: 0, height: 0 }}
    >
      {particles}
      <style>{`
        @keyframes burst {
          0%   { transform: translate(-50%, -50%) scale(0); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MatchBurst;
