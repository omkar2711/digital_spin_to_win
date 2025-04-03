
import React, { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  animationDuration: number;
}

const Confetti: React.FC = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    // Create confetti pieces
    const colors = ['#7C45E4', '#03D3B0', '#FFC107', '#FF5757'];
    const newConfetti: ConfettiPiece[] = [];
    
    for (let i = 0; i < 100; i++) {
      const animationDuration = 3 + Math.random() * 2;
      newConfetti.push({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 80,
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        animationDuration
      });
    }
    
    setConfetti(newConfetti);
    
    // Clean up animation
    return () => {
      setConfetti([]);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style>
        {`
          @keyframes fall {
            from {
              transform: translateY(0) rotate(0deg);
            }
            to {
              transform: translateY(105vh) rotate(720deg);
            }
          }
        `}
      </style>
      
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size * 1.5}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            opacity: 0.8,
            animation: `fall ${piece.animationDuration}s linear forwards`
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
