export type SpatialAnchorId = 
  | 'PantryAnchor' 
  | 'AIAnchor' 
  | 'CookingAnchor' 
  | 'GroceryAnchor';

export interface SpatialVector3 {
  x: number;
  y: number;
  z?: number;
}

export interface SpatialAnchor {
  id: SpatialAnchorId;
  name: string;
  position: SpatialVector3;
  zoneId: string;
  description: string;
}

export interface SpatialObjectData {
  id: string;
  type: string;
  position: SpatialVector3;
  scale?: number;
  rotation?: number;
  visible?: boolean;
  interactive?: boolean;
  payload?: Record<string, unknown>;
}

export interface MotionPathConfig {
  id?: string;
  start: SpatialVector3 | SpatialAnchorId;
  destination: SpatialVector3 | SpatialAnchorId;
  duration?: number; // in milliseconds
  easing?: 'linear' | 'ease-in-out' | 'cubic-bezier';
  delay?: number;
  onComplete?: () => void;
}

export interface SpatialMotionState {
  isAnimating: boolean;
  currentPosition: SpatialVector3;
  progress: number; // 0.0 to 1.0
}
