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
  | 'GET_RECIPE'
  | 'GET_RECIPE_DETAILS'
  | 'GET_RECIPE_INGREDIENTS'
  | 'GET_RECIPE_INSTRUCTIONS'
  | 'GET_AVAILABLE_RECIPES'
  | 'GET_MISSING_INGREDIENTS'
  | 'GET_EXPIRING_ITEMS'
  | 'SUGGEST_SUBSTITUTION'
  | 'START_COOKING'
  | 'GET_COOKING_STATUS'
  | 'COMPLETE_COOKING'
  | 'RECORD_COOKING_USAGE'
  | 'GET_COOKING_HISTORY'
  | 'CLEAR_PANTRY'
  | 'RECORD_USAGE'
  | 'RECORD_WASTE'
  | 'ADJUST_STOCK'
  | 'GET_INVENTORY_HISTORY'
  | 'GENERATE_GROCERY_LIST'
  | 'GET_GROCERY_STATUS'
  | 'GET_PENDING_GROCERIES'
  | 'GET_PURCHASED_GROCERIES'
  | 'ADD_GROCERY_ITEM'
  | 'UPDATE_GROCERY_ITEM'
  | 'MARK_GROCERY_PURCHASED'
  | 'RECEIVE_GROCERY'
  | 'GET_GROCERY_HISTORY'
  | 'OPEN_CAMERA'
  | 'CAPTURE_ITEM'
  | 'ANALYZE_ITEM'
  | 'CONFIRM_DETECTED_ITEM'
  | 'UPDATE_INVENTORY_FROM_CAMERA'
  | 'GET_STAFF'
  | 'GET_STAFF_MEMBER'
  | 'GET_STAFF_ROLE'
  | 'GREETING'
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
  actionRequired?: 'explore_pantry' | 'view_recipes' | 'start_cooking' | 'add_grocery' | 'open_camera' | 'none';
  pendingAction?: AgentAction;
  debugInfo?: AgentDebugInfo;
  timestamp: string;
}

