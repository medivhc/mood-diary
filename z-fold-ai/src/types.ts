// State Machine Types
export type AppState = 'Min-State' | 'Active-Focus' | 'Z-Stack-History';

export interface TaskCard {
  id: string;
  title: string;
  content: string;
  summary?: string;
  timestamp: number;
  zIndex: number;
}

export interface GestureState {
  isPinching: boolean;
  pinchScale: number;
  isSwiping: boolean;
  swipeStartY: number;
  isEdgeDragging: boolean;
  edgeDragY: number;
}

export interface InputHubProps {
  state: AppState;
  onExpand: () => void;
  onCollapse: () => void;
  onSubmit: (text: string) => void;
}

export interface CanvasProps {
  currentCard: TaskCard | null;
  historyCards: TaskCard[];
  state: AppState;
  onPinchIn: () => void;
  onPinchOut: () => void;
  onCardSelect: (card: TaskCard) => void;
}

export interface EdgeScrubberProps {
  historyCards: TaskCard[];
  state: AppState;
  onHistoryNavigate: (card: TaskCard) => void;
  onActivate: () => void;
}
