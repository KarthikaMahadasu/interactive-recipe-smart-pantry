import type { Ingredient, FreshnessLevel } from '../types/ingredient';
import type { KitchenZoneId } from '../types/kitchen';
import type { AIBrainState, AIResponsePayload } from '../types/ai';
import type { Recipe } from '../types/recipe';
import type { InventoryTransaction } from '../features/inventory/types/transactionTypes';
import type { SmartGroceryItem } from '../features/grocery/types/groceryTypes';

export interface UserPreferences {
  dietaryRestrictions: string[];
  unitSystem: 'metric' | 'imperial';
  theme: 'dark' | 'glassmorphism';
  soundEnabled: boolean;
  spatial3dEnabled: boolean;
  voiceGuidanceEnabled?: boolean;
}

export interface KitchenGlobalState {
  pantry: Ingredient[];
  recipes: Recipe[];
  groceryList: SmartGroceryItem[];
  transactions: InventoryTransaction[];
  selectedRecipeId: string | null;
  activeCookingRecipe: Recipe | null;
  aiState: AIBrainState;
  activeZone: KitchenZoneId | null;
  hasVisited: boolean;
  userPreferences: UserPreferences;
  aiHistory: AIResponsePayload[];
}

export type KitchenAction =
  | { type: 'SET_AI_STATE'; payload: AIBrainState }
  | { type: 'SET_ACTIVE_ZONE'; payload: KitchenZoneId | null }
  | { type: 'SET_PANTRY_DATA'; payload: Ingredient[] }
  | { type: 'SET_TRANSACTIONS_DATA'; payload: InventoryTransaction[] }
  | { type: 'SET_GROCERY_DATA'; payload: SmartGroceryItem[] }
  | { type: 'ADD_INGREDIENT'; payload: Ingredient }
  | { type: 'UPDATE_INGREDIENT'; payload: Ingredient }
  | { type: 'UPDATE_INGREDIENT_QUANTITY'; payload: { id: string; delta: number } }
  | { type: 'UPDATE_FRESHNESS'; payload: { id: string; freshness: FreshnessLevel } }
  | { type: 'REMOVE_INGREDIENT'; payload: string }
  | { type: 'CLEAR_PANTRY' }
  | { type: 'LOG_TRANSACTION'; payload: InventoryTransaction }
  | { type: 'RECORD_USAGE'; payload: { itemId: string; quantity: number; unit: string; reason: string; createdBy: string } }
  | { type: 'RECORD_WASTE'; payload: { itemId: string; quantity: number; unit: string; reason: string; createdBy: string } }
  | { type: 'ADJUST_STOCK'; payload: { itemId: string; actualQuantity: number; reason: string; createdBy: string } }
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'SET_SELECTED_RECIPE'; payload: string | null }
  | { type: 'START_COOKING_RECIPE'; payload: Recipe }
  | { type: 'FINISH_COOKING_DEDUCTION'; payload: { recipe: Recipe; user?: string } }
  | { type: 'ADD_GROCERY_ITEM'; payload: SmartGroceryItem }
  | { type: 'UPDATE_GROCERY_ITEM'; payload: SmartGroceryItem }
  | { type: 'DELETE_GROCERY_ITEM'; payload: string }
  | { type: 'MARK_GROCERY_PURCHASED'; payload: string }
  | { type: 'RECEIVE_GROCERY_DELIVERY'; payload: { groceryId: string; receivedQuantity: number; receivedUnit?: string; user?: string } }
  | { type: 'SET_ALL_GROCERY_ITEMS'; payload: SmartGroceryItem[] }
  | { type: 'ADD_AI_RESPONSE'; payload: AIResponsePayload }
  | { type: 'TOGGLE_SPATIAL_3D'; payload: boolean }
  | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'MARK_VISITED' };
