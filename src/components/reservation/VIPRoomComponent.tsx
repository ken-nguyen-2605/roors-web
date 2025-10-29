// components/restaurant/VIPRoomComponent.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface VIPRoomProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  capacity: 10 | 20;
  status: 'available' | 'booked' | 'selected' | 'closed';
  roomName: string;
  onClick?: () => void;
}

export const VIPRoomComponent: React.FC<VIPRoomProps> = ({
  id,
  x,
  y,
  width,
  height,
  capacity,
  status,
  roomName,
  onClick
}) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'available': return { fill: 'url(#goldGradient)', stroke: '#d4af37', opacity: 0.3 };
      case 'booked': return { fill: 'url(#darkGradient)', stroke: '#8b7355', opacity: 0.8 };
      case 'selected': return { fill: 'url(#selectedGradient)', stroke: '#b8960f', opacity: 0.6 };
      case 'closed': return { fill: '#2a2a2a', stroke: '#666', opacity: 0.5 };
      default: return { fill: 'url(#goldGradient)', stroke: '#d4af37', opacity: 0.3 };
    }
  };

  const style = getStatusStyle();

  return (
    <g
      style={{ cursor: status !== 'closed' ? 'pointer' : 'not-allowed' }}
      onClick={status !== 'closed' ? onClick : undefined}
    >
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4e4bc" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="darkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2c1810" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#1a0f08" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#b8960f" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="8"
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth="3"
        strokeDasharray="5,5"
        opacity={style.opacity}
        whileHover={status === 'available' ? { opacity: 0.5 } : {}}
      />

      <rect
        x={x}
        y={y}
        width={width}
        height={30}
        fill={style.stroke}
        opacity="0.2"
        rx="8"
      />

      <text
        x={x + width/2}
        y={y + 20}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={status === 'booked' ? '#d4af37' : '#2c1810'}
        fontSize="16"
        fontWeight="700"
        fontFamily="Playfair Display, serif"
      >
        {roomName}
      </text>

      <text
        x={x + width/2}
        y={y + height/2 + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={status === 'booked' ? '#fff' : '#666'}
        fontSize="12"
        fontFamily="Inter, sans-serif"
      >
        Capacity: {capacity} guests
      </text>

      {status === 'booked' && (
        <text
          x={x + width/2}
          y={y + height - 20}
          textAnchor="middle"
          fill="#d4af37"
          fontSize="12"
          fontWeight="600"
        >
          RESERVED
        </text>
      )}
    </g>
  );
};