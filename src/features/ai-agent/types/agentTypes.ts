export type AgentIntent =
  | 'ADD_PANTRY_ITEM'
  | 'REMOVE_PANTRY_ITEM'
  | 'UPDATE_PANTRY_ITEM'
  | 'GET_PANTRY'
  | 'GET_PANTRY_ITEM'
  | 'CHECK_AVAILABILITY'
  | 'FIND_RECIPES'
  | 'FIND_RECIPES_BY_INGREDIENT'
  | 'GET_MISSING_INGREDIENTS'
  | 'GET_EXPIRING_ITEMS'
  | 'GET_RECIPE_DETAILS'
  | 'SUGGEST_SUBSTITUTION'
  | 'START_COOKING'
  | 'GET_COOKING_STATUS'
  | 'CLEAR_PANTRY'
  | 'HELP'
  | 'UNKNOWN';

export interface ExtractedEntities {
  name?: string;
  quantity?: number;
  unit?: string;
  category?: string;
  recipeName?: string;
  targetIngredient?: string;
  expiryDate?: string;
  queryType?: 'all' | 'expiring' | 'specific';
}

export interface AgentAction {
  intent: AgentIntent;
  parameters: ExtractedEntities;
  rawCommand: string;
  normalizedCommand: string;
  confidence: number; // 0.0 to 1.0
  requiresConfirmation: boolean;
  confirmationMessage?: string;
  validationResult?: {
    passed: boolean;
    reason?: string;
  };
}

export type AgentResponseStatus = 'success' | 'info' | 'warning' | 'error' | 'confirmation_required';

export interface AgentDebugInfo {
  userInput: string;
  intent: AgentIntent;
  entities: ExtractedEntities;
  validation: {
    passed: boolean;
    reason?: string;
  };
  action: AgentIntent;
  resultStatus: AgentResponseStatus;
  resultMessage: string;
}

export interface AgentResponse {
  message: string;
  intent: AgentIntent;
  status: AgentResponseStatus;
  data?: Record<string, unknown>;
  actionRequired?: 'explore_pantry' | 'view_recipes' | 'start_cooking' | 'add_grocery' | 'none';
  pendingAction?: AgentAction;
  debugInfo?: AgentDebugInfo;
  timestamp: string;
}

