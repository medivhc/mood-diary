import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EdgeScrubberProps } from './types';

const EdgeScrubber: React.FC<EdgeScrubberProps> = ({
  historyCards,
  state,
  onHistoryNavigate,
  onActivate,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const longPressTimer = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    
    if (rect && Math.abs(touch.clientX - rect.right) < 24) {
      longPressTimer.current = window.setTimeout(() => {
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
        setIsActive(true);
        onActivate();
        
        // Calculate initial index based on touch position
        const normalizedY = (touch.clientY - rect.top) / rect.height;
        const newIndex = Math.floor(normalizedY * historyCards.length);
        setSelectedIndex(Math.min(newIndex, historyCards.length - 1));
      }, 300);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    if (isActive && selectedIndex >= 0 && historyCards[selectedIndex]) {
      onHistoryNavigate(historyCards[selectedIndex]);
    }
    
    setIsActive(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isActive) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    
    if (rect) {
      const normalizedY = (touch.clientY - rect.top) / rect.height;
      const newIndex = Math.floor(normalizedY * historyCards.length);
      setSelectedIndex(Math.min(Math.max(newIndex, 0), historyCards.length - 1));
    }
  };

  // Keyboard navigation for desktop testing
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state !== 'Min-State') return;
      
      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, historyCards.length - 1));
        if (navigator.vibrate) navigator.vibrate(5);
      } else if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        if (navigator.vibrate) navigator.vibrate(5);
      } else if (e.altKey && e.key === 'Enter' && historyCards[selectedIndex]) {
        e.preventDefault();
        onHistoryNavigate(historyCards[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, historyCards, selectedIndex, onHistoryNavigate]);

  if (historyCards.length === 0) return null;

  return (
    <>
      {/* Invisible edge hitbox */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '24px',
          height: '100%',
          zIndex: 2000,
          cursor: isActive ? 'grabbing' : 'default',
        }}
      />

      {/* Visual indicator when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{
              position: 'absolute',
              top: 0,
              right: '24px',
              width: '200px',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(20px)',
              zIndex: 1999,
              padding: '16px',
              overflowY: 'auto',
            }}
          >
            <h4 
              style={{ 
                fontSize: '12px', 
                color: 'rgba(255, 255, 255, 0.5)',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              History ({historyCards.length})
            </h4>
            
            {historyCards.map((card, index) => (
              <div
                key={card.id}
                style={{
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: index === selectedIndex 
                    ? 'rgba(79, 70, 229, 0.5)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  border: index === selectedIndex 
                    ? '1px solid rgba(79, 70, 229, 1)' 
                    : '1px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                <p 
                  style={{ 
                    fontSize: '13px', 
                    fontWeight: 500,
                    color: '#ffffff',
                    marginBottom: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {card.title}
                </p>
                {card.summary && (
                  <p 
                    style={{ 
                      fontSize: '11px', 
                      color: 'rgba(255, 255, 255, 0.6)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {card.summary}
                  </p>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center preview overlay during scrubbing */}
      <AnimatePresence>
        {isActive && historyCards[selectedIndex] && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80%',
              maxWidth: '350px',
              padding: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              zIndex: 1998,
              pointerEvents: 'none',
            }}
          >
            <h3 
              style={{ 
                fontSize: '16px', 
                fontWeight: 600,
                color: '#ffffff',
                marginBottom: '8px',
              }}
            >
              {historyCards[selectedIndex].title}
            </h3>
            {historyCards[selectedIndex].summary && (
              <p 
                style={{ 
                  fontSize: '13px', 
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {historyCards[selectedIndex].summary}
              </p>
            )}
            <p 
              style={{ 
                fontSize: '10px', 
                color: 'rgba(255, 255, 255, 0.4)',
                marginTop: '12px',
              }}
            >
              {new Date(historyCards[selectedIndex].timestamp).toLocaleString()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EdgeScrubber;
