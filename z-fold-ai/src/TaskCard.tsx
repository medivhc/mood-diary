import React from 'react';
import { motion } from 'framer-motion';
import { TaskCard as TaskCardType } from './types';

interface TaskCardProps {
  card: TaskCardType;
  isCurrent: boolean;
  scale?: number;
  opacity?: number;
  zIndex?: number;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  card, 
  isCurrent, 
  scale = 1, 
  opacity = 1, 
  zIndex = 0,
  onClick 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale, opacity }}
      transition={{ 
        type: "spring",
        damping: 20,
        stiffness: 300,
        duration: 0.3
      }}
      onClick={onClick}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '90%',
        maxWidth: '400px',
        maxHeight: '60vh',
        transform: `translate(-50%, -50%) translateZ(${zIndex * -200}px)`,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: isCurrent 
            ? 'rgba(255, 255, 255, 0.15)' 
            : 'rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          backdropFilter: isCurrent ? 'blur(10px)' : 'blur(20px)',
          boxShadow: isCurrent 
            ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 4px 16px rgba(0, 0, 0, 0.2)',
          border: isCurrent 
            ? '1px solid rgba(255, 255, 255, 0.2)' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Card Header */}
        <div style={{ 
          padding: '16px 20px', 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0,
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 600,
            marginBottom: '4px',
            color: '#ffffff',
          }}>
            {card.title}
          </h3>
          {card.summary && (
            <p style={{ 
              fontSize: '12px', 
              color: 'rgba(255, 255, 255, 0.6)',
              marginTop: '4px',
            }}>
              {card.summary}
            </p>
          )}
          <p style={{ 
            fontSize: '10px', 
            color: 'rgba(255, 255, 255, 0.4)',
            marginTop: '8px',
          }}>
            {new Date(card.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Card Content - Scrollable internally */}
        <div 
          style={{ 
            padding: '20px',
            overflowY: 'auto',
            flex: 1,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <p style={{ 
            fontSize: '14px', 
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.9)',
            whiteSpace: 'pre-wrap',
          }}>
            {card.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
