import React from 'react';
import { motion } from 'framer-motion';

type OrbState = 'base' | 'calm' | 'fragmented' | 'learning' | 'high_confidence' | 'low_confidence';

interface OrbProps {
  state?: OrbState;
  className?: string;
  size?: number;
}

export function Orb({ state = 'base', className = '', size = 80 }: OrbProps) {
  // Futuramente, a cor e comportamento dependem do 'state'.
  // Por agora, MVP usa o base (presença silenciosa, inteligência nocturna).
  
  return (
    <div 
      className={`orb-container ${className}`} 
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        className="orb-core"
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.65, 0.85, 0.65],
        }}
        transition={{
          duration: 5,   // 5s cycle - very slow and calm
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(140, 150, 255, 0.8) 0%, rgba(140, 150, 255, 0) 70%)',
          filter: 'blur(3px)',
          boxShadow: '0 0 25px rgba(140, 150, 255, 0.15)',
        }}
      />
    </div>
  );
}
