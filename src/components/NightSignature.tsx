import React from 'react';
import { motion } from 'framer-motion';

export function NightSignature() {
  return (
    <div className="energy-mass">
      {/* Camada primária profunda */}
      <motion.div
        className="mass-core"
        animate={{
          scale: [1, 1.08, 0.96, 1],
          opacity: [0.4, 0.6, 0.45, 0.4],
          x: ['0%', '-3%', '2%', '0%'],
          y: ['0%', '4%', '-1%', '0%']
        }}
        transition={{
          duration: 14,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      {/* Camada secundária, assimetria */}
      <motion.div
        className="mass-secondary"
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-30%',
          width: '120%',
          height: '140%',
          background: 'radial-gradient(ellipse at 70% 40%, rgba(130, 140, 250, 0.08) 0%, transparent 65%)',
          filter: 'blur(50px)'
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2
        }}
      />
    </div>
  );
}
