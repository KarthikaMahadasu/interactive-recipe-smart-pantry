import type { Ingredient, FreshnessLevel } from '../types/ingredient';
import type { KitchenZoneId } from '../types/kitchen';
import type { AIBrainState, AIResponsePayload } from '../types/ai';
import type { Recipe } from '../types/recipe';

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  bought: boolean;
  category?: string;
}

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
  groceryList: GroceryItem[];
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
  | { type: 'ADD_INGREDIENT'; payload: Ingredient }
  | { type: 'UPDATE_INGREDIENT'; payload: Ingredient }
  | { type: 'UPDATE_INGREDIENT_QUANTITY'; payload: { id: string; delta: number } }
  | { type: 'UPDATE_FRESHNESS'; payload: { id: string; freshness: FreshnessLevel } }
  | { type: 'REMOVE_INGREDIENT'; payload: string }
  | { type: 'CLEAR_PANTRY' }
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'SET_SELECTED_RECIPE'; payload: string | null }
  | { type: 'START_COOKING_RECIPE'; payload: Recipe }
  | { type: 'FINISH_COOKING_DEDUCTION'; payload: { recipe: Recipe } }
  | { type: 'ADD_GROCERY_ITEM'; payload: GroceryItem }
  | { type: 'TOGGLE_GROCERY_ITEM'; payload: string }
  | { type: 'DELETE_GROCERY_ITEM'; payload: string }
  | { type: 'TRANSFER_PURCHASED_TO_PANTRY' }
  | { type: 'ADD_AI_RESPONSE'; payload: AIResponsePayload }
  | { type: 'TOGGLE_SPATIAL_3D'; payload: boolean }
  | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'MARK_VISITED' };
