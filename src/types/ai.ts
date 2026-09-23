export type AIBrainState = 
  | 'idle' 
  | 'listening' 
  | 'thinking' 
  | 'working' 
  | 'success' 
  | 'error';

export interface AIBrainStateConfig {
  label: string;
  description: string;
  coreColor: string;
  glowColor: string;
  particleSpeed: number;
  pulseRate: number;
}

export interface AIPromptContext {
  pantryCount: number;
  dietaryRestrictions?: string[];
  userIntent?: string;
  activeZone?: string;
}

export interface AIResponsePayload {
  message: string;
  actionRequired?: 'explore_pantry' | 'view_recipes' | 'add_grocery' | 'none';
  suggestedItems?: string[];
  timestamp: string;
  isMock: boolean;
}
