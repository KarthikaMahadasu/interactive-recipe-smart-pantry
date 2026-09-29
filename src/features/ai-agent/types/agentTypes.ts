export type AgentIntent =
  | 'ADD_PANTRY_ITEM'
  | 'REMOVE_PANTRY_ITEM'
  | 'UPDATE_PANTRY_ITEM'
  | 'GET_PANTRY'
  | 'GET_PANTRY_ITEM'
  | 'CHECK_AVAILABILITY'
  | 'GET_LOW_STOCK_ITEMS'
  | 'FIND_RECIPES'
  | 'FIND_RECIPES_BY_INGREDIENT'
  | 'CHECK_RECIPE_AVAILABILITY'
  | 'GET_MISSING_INGREDIENTS'
  | 'GET_EXPIRING_ITEMS'
  | 'GET_RECIPE_DETAILS'
  | 'SUGGEST_SUBSTITUTION'
  | 'START_COOKING'
  | 'GET_COOKING_STATUS'
  | 'COMPLETE_COOKING'
  | 'CLEAR_PANTRY'
  | 'RECORD_USAGE'
  | 'RECORD_WASTE'
  | 'ADJUST_STOCK'
  | 'GET_INVENTORY_HISTORY'
  | 'GENERATE_GROCERY_LIST'
  | 'GET_GROCERY_STATUS'
  | 'ADD_GROCERY_ITEM'
  | 'UPDATE_GROCERY_ITEM'
  | 'MARK_GROCERY_PURCHASED'
  | 'RECEIVE_GROCERY'
  | 'GET_GROCERY_HISTORY'
  | 'GET_STAFF'
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
  reason?: string;
  queryType?: 'all' | 'expiring' | 'specific' | 'waste' | 'history' | 'grocery';
}

export interface AgentAction {
  intent: AgentIntent;
  parameters: ExtractedEntities;
  rawCommand: string;
  normalizedCommand: string;
  confidence: number;
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
