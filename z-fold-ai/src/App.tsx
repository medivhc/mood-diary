import React, { useState, useCallback, useEffect } from 'react';
import InputHub from './InputHub';
import SpatialCanvas from './SpatialCanvas';
import EdgeScrubber from './EdgeScrubber';
import { AppState, TaskCard } from './types';

// Sample data for demonstration
const generateSampleCards = (): { current: TaskCard; history: TaskCard[] } => {
  const now = Date.now();
  
  return {
    current: {
      id: 'current-1',
      title: 'React Component Design',
      content: `Here's a comprehensive React component design for your Z-axis folding interaction system:\n\n## Key Features\n\n1. **State Machine**: Three core states (Min-State, Active-Focus, Z-Stack-History)\n2. **Gesture Recognition**: Pinch-to-dive, swipe-up唤醒，edge scrubbing\n3. **3D Transforms**: CSS translateZ for depth perception\n4. **Backdrop Filters**: Glassmorphism effects for visual hierarchy\n\n## Implementation Notes\n\n- Use framer-motion for spring animations\n- Implement touch events for mobile gestures\n- Maintain keyboard stability with absolute positioning`,
      summary: undefined,
      timestamp: now,
      zIndex: 0,
    },
    history: [
      {
        id: 'hist-1',
        title: 'Nginx Reverse Proxy Config',
        content: 'Configuration for setting up Nginx as a reverse proxy with SSL termination and load balancing...',
        summary: '配置 Nginx 反向代理',
        timestamp: now - 3600000,
        zIndex: 1,
      },
      {
        id: 'hist-2',
        title: 'Database Schema Design',
        content: 'Proposed schema for the user management system with normalized tables and indexes...',
        summary: '设计用户管理系统数据库架构',
        timestamp: now - 7200000,
        zIndex: 2,
      },
      {
        id: 'hist-3',
        title: 'API Rate Limiting Strategy',
        content: 'Implementation of token bucket algorithm for API rate limiting with Redis backend...',
        summary: '实现 API 限流策略',
        timestamp: now - 10800000,
        zIndex: 3,
      },
      {
        id: 'hist-4',
        title: 'CSS Grid Layout Tutorial',
        content: 'Complete guide to CSS Grid Layout with practical examples and common patterns...',
        summary: 'CSS Grid 布局教程',
        timestamp: now - 14400000,
        zIndex: 4,
      },
    ] as TaskCard[],
  };
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('Min-State');
  const [taskData, setTaskData] = useState(generateSampleCards());
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Detect keyboard visibility (mobile)
  useEffect(() => {
    const handleResize = () => {
      const isKeyboardVisible = window.innerHeight < window.screen.height * 0.7;
      setKeyboardVisible(isKeyboardVisible);
      
      // Auto-collapse when keyboard hides
      if (!isKeyboardVisible && state === 'Active-Focus') {
        setState('Min-State');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state]);

  // Handle swipe up gesture for input唤醒
  useEffect(() => {
    let startY: number | null = null;
    
    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger from bottom area, not on cards
      const target = e.target as HTMLElement;
      if (target.closest('.task-card') || target.closest('.edge-scrubber')) {
        return;
      }
      
      if (e.touches.length === 2) {
        startY = Math.min(e.touches[0].clientY, e.touches[1].clientY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (startY === null || e.changedTouches.length !== 2) {
        startY = null;
        return;
      }

      const endY = Math.max(e.changedTouches[0].clientY, e.changedTouches[1].clientY);
      const deltaY = endY - startY;

      // Swipe up threshold (negative delta means upward movement)
      if (deltaY < -100 && state === 'Min-State') {
        setState('Active-Focus');
      }

      startY = null;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [state]);

  const handleExpand = useCallback(() => {
    setState('Active-Focus');
  }, []);

  const handleCollapse = useCallback(() => {
    setState('Min-State');
  }, []);

  const handleSubmit = useCallback((text: string) => {
    // Simulate AI response
    const newCard: TaskCard = {
      id: `card-${Date.now()}`,
      title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
      content: `AI Response to: "${text}"\n\nThis is a simulated response demonstrating the Z-axis folding interaction pattern. In a real implementation, this would contain the actual AI-generated content, code snippets, or tool execution results.`,
      timestamp: Date.now(),
      zIndex: 0,
    };

    // Move current to history
    setTaskData(prev => ({
      current: newCard,
      history: prev.current ? [prev.current, ...prev.history] : prev.history,
    }));
  }, []);

  const handlePinchIn = useCallback(() => {
    if (state === 'Min-State') {
      setState('Z-Stack-History');
    }
  }, [state]);

  const handlePinchOut = useCallback(() => {
    if (state === 'Z-Stack-History') {
      setState('Min-State');
    }
  }, [state]);

  const handleCardSelect = useCallback((card: TaskCard) => {
    // Promote selected card to current
    setTaskData(prev => ({
      current: card,
      history: prev.history.filter(c => c.id !== card.id),
    }));
    setState('Min-State');
  }, []);

  const handleHistoryNavigate = useCallback((card: TaskCard) => {
    handleCardSelect(card);
  }, [handleCardSelect]);

  const handleEdgeActivate = useCallback(() => {
    // Could trigger haptic feedback here
    console.log('Edge scrubber activated');
  }, []);

  return (
    <div 
      className="app-container"
      data-testid="app-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Top Input Hub */}
      <InputHub
        state={state}
        onExpand={handleExpand}
        onCollapse={handleCollapse}
        onSubmit={handleSubmit}
      />

      {/* Z-Axis Spatial Canvas */}
      <SpatialCanvas
        currentCard={taskData.current}
        historyCards={taskData.history}
        state={state}
        onPinchIn={handlePinchIn}
        onPinchOut={handlePinchOut}
        onCardSelect={handleCardSelect}
      />

      {/* Edge Scrubber for timeline navigation */}
      <EdgeScrubber
        historyCards={taskData.history}
        state={state}
        onHistoryNavigate={handleHistoryNavigate}
        onActivate={handleEdgeActivate}
      />

      {/* State indicator for debugging/demo */}
      <div
        data-testid="state-indicator"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          padding: '8px 12px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '8px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          zIndex: 3000,
          pointerEvents: 'none',
        }}
      >
        State: <strong style={{ color: '#4f46e5' }}>{state}</strong>
        {keyboardVisible && ' (Keyboard Visible)'}
      </div>

      {/* Gesture hints overlay */}
      {state === 'Min-State' && (
        <div
          data-testid="gesture-hints"
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '12px',
            zIndex: 2999,
            pointerEvents: 'none',
            animation: 'pulse 2s infinite',
          }}
        >
          <p>Two-finger swipe up to input</p>
          <p>Pinch in to view history</p>
          <p>Long press right edge to scrub</p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default App;
