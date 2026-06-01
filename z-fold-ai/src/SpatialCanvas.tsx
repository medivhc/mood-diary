import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TaskCard from './TaskCard';
import { TaskCard as TaskCardType, CanvasProps } from './types';

const SpatialCanvas: React.FC<CanvasProps> = ({
  currentCard,
  historyCards,
  state,
  onPinchIn,
  onPinchOut,
  onCardSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);

  // Handle touch events for pinch gesture
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        setInitialPinchDistance(distance);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDistance !== null) {
        const currentDistance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );

        // Pinch in threshold
        if (currentDistance < initialPinchDistance * 0.7 && state === 'Min-State') {
          onPinchIn();
          setInitialPinchDistance(null);
        }

        // Pinch out threshold
        if (currentDistance > initialPinchDistance * 1.3 && state === 'Z-Stack-History') {
          onPinchOut();
          setInitialPinchDistance(null);
        }
      }
    };

    const handleTouchEnd = () => {
      setInitialPinchDistance(null);
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [initialPinchDistance, state, onPinchIn, onPinchOut]);

  // Calculate scale and opacity based on state
  const getCardTransform = (index: number, isCurrent: boolean) => {
    if (state === 'Min-State') {
      return isCurrent 
        ? { scale: 1, opacity: 1, zIndex: 100 }
        : { scale: 0, opacity: 0, zIndex: 0 };
    }

    if (state === 'Active-Focus') {
      return {
        scale: 0.9,
        opacity: 0.5,
        zIndex: isCurrent ? 100 : 0,
      };
    }

    if (state === 'Z-Stack-History') {
      // Z-stack layout with exponential decay
      const baseScale = 0.8;
      const scaleDecay = 0.1;
      const opacityDecay = 0.15;
      
      return {
        scale: Math.max(baseScale - index * scaleDecay, 0.4),
        opacity: Math.max(0.6 - index * opacityDecay, 0.2),
        zIndex: 100 - index,
      };
    }

    return { scale: 1, opacity: 1, zIndex: 100 };
  };

  // Combine current card with history for Z-stack view
  const allCards = state === 'Z-Stack-History' 
    ? [currentCard, ...historyCards].filter(Boolean) as TaskCardType[]
    : currentCard ? [currentCard] : [];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
      }}
    >
      {/* Background blur overlay for Active-Focus state */}
      {state === 'Active-Focus' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            zIndex: 50,
          }}
        />
      )}

      {/* Render cards */}
      {allCards.map((card, index) => {
        const transform = getCardTransform(index, index === 0);
        const isCurrent = index === 0;

        return (
          <TaskCard
            key={card.id}
            card={card}
            isCurrent={isCurrent}
            scale={transform.scale}
            opacity={transform.opacity}
            onClick={
              state === 'Z-Stack-History' && !isCurrent
                ? () => onCardSelect(card)
                : undefined
            }
          />
        );
      })}

      {/* Empty state message */}
      {!currentCard && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.4)',
          }}
        >
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>No active task</p>
          <p style={{ fontSize: '14px' }}>Swipe up to start a new conversation</p>
        </div>
      )}
    </div>
  );
};

export default SpatialCanvas;
