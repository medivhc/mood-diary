import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputHubProps } from './types';

const InputHub: React.FC<InputHubProps> = ({ state, onExpand, onCollapse, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const longPressTimer = useRef<number | null>(null);

  // Auto-focus when entering Active-Focus state
  useEffect(() => {
    if (state === 'Active-Focus' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state]);

  const handleTouchStart = () => {
    longPressTimer.current = window.setTimeout(() => {
      // Haptic feedback for long press (if supported)
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      onExpand();
    }, 300);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue('');
      onCollapse();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="safe-area-top" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 }}>
      <AnimatePresence>
        {state === 'Min-State' ? (
          // Collapsed state - minimal pill indicator
          <motion.div
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '12px',
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              style={{
                width: '40px',
                height: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderRadius: '2px',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
              }}
            />
          </motion.div>
        ) : (
          // Expanded state - full input box
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              type: "spring",
              damping: 25,
              stiffness: 500,
              duration: 0.2
            }}
            style={{
              margin: '16px',
              marginTop: '8px',
              padding: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your command..."
              rows={3}
              style={{
                width: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '16px',
                resize: 'none',
                fontFamily: 'inherit',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                style={{
                  padding: '10px 24px',
                  backgroundColor: inputValue.trim() ? '#4f46e5' : 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s',
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputHub;
