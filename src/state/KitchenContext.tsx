import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { KitchenGlobalState, KitchenAction, UserPreferences } from './types';
import type { AIBrainState, AIResponsePayload } from '../types/ai';
import type { KitchenZoneId } from '../types/kitchen';
import type { Ingredient, FreshnessLevel } from '../types/ingredient';
import type { Recipe } from '../types/recipe';
import type { InventoryTransaction } from '../features/inventory/types/transactionTypes';
import type { SmartGroceryItem } from '../features/grocery/types/groceryTypes';
import { InventoryTransactionService } from '../features/inventory/services/inventoryTransactionService';
import { GroceryService } from '../features/grocery/services/groceryService';
import { useAuth } from '../contexts/AuthContext';
import { IngredientUtils } from '../utils/ingredientUtils';
import { MASTER_RECIPE_CATALOG } from '../services/recipes/masterRecipeCatalog';

const DEFAULT_PANTRY_KEY = 'smart_pantry_items_v1';

function getPantryStorageKey(restaurantId?: string | null): string {
  if (restaurantId) {
    return `restaurant_${restaurantId}_inventory_v1`;
  }
  return DEFAULT_PANTRY_KEY;
}

const getDefaultPantry = (restaurantId?: string): Ingredient[] => [
  {
    id: 'ing_1',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Dragon Fruit',
    category: 'produce',
    quantity: 5,
    unit: 'pcs',
    freshness: 'fresh',
    colorCode: '#ec4899',
    tags: ['exotic', 'antioxidants', 'fruit'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_2',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Finger Millet (Ragi)',
    category: 'grain',
    quantity: 2,
    unit: 'kg',
    freshness: 'pantry_stable',
    colorCode: '#a16207',
    tags: ['superfood', 'high-fiber', 'gluten-free'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_3',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Fresh Paneer',
    category: 'dairy',
    quantity: 1,
    unit: 'kg',
    freshness: 'fresh',
    colorCode: '#fde047',
    tags: ['protein', 'vegetarian'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_4',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Hass Avocado',
    category: 'produce',
    quantity: 5,
    unit: 'pcs',
    freshness: 'fresh',
    colorCode: '#15803d',
    tags: ['healthy-fats', 'keto'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_5',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Raw Cashews',
    category: 'other',
    quantity: 1,
    unit: 'kg',
    freshness: 'pantry_stable',
    colorCode: '#fef08a',
    tags: ['nuts', 'vegan-cream'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_6',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Organic Tofu',
    category: 'dairy',
    quantity: 400,
    unit: 'g',
    freshness: 'fresh',
    colorCode: '#e2e8f0',
    tags: ['plant-protein', 'vegan'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_7',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Cherry Tomatoes',
    category: 'produce',
    quantity: 500,
    unit: 'g',
    freshness: 'fresh',
    colorCode: '#ef4444',
    tags: ['salad', 'mediterranean'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_8',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Greek Yogurt',
    category: 'dairy',
    quantity: 1,
    unit: 'kg',
    freshness: 'fresh',
    colorCode: '#38bdf8',
    tags: ['probiotic', 'high-protein'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_9',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Rice',
    category: 'grain',
    quantity: 25,
    unit: 'kg',
    freshness: 'pantry_stable',
    colorCode: '#f8fafc',
    tags: ['staple', 'restaurant-bulk'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_10',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Chicken',
    category: 'meat',
    quantity: 5,
    unit: 'kg',
    freshness: 'fresh',
    colorCode: '#f43f5e',
    tags: ['poultry', 'protein'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_11',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Onion',
    category: 'produce',
    quantity: 10,
    unit: 'kg',
    freshness: 'pantry_stable',
    colorCode: '#a855f7',
    tags: ['veggie', 'staple'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_12',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Tomato',
    category: 'produce',
    quantity: 5,
    unit: 'kg',
    freshness: 'fresh',
    colorCode: '#ef4444',
    tags: ['veggie', 'fresh'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_13',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Potato',
    category: 'produce',
    quantity: 10,
    unit: 'kg',
    freshness: 'pantry_stable',
    colorCode: '#eab308',
    tags: ['veggie', 'staple'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_14',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Cooking Oil',
    category: 'liquid',
    quantity: 5,
    unit: 'L',
    freshness: 'pantry_stable',
    colorCode: '#f59e0b',
    tags: ['fat', 'staple'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_15',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Salt',
    category: 'spice',
    quantity: 2,
    unit: 'kg',
    freshness: 'pantry_stable',
    colorCode: '#94a3b8',
    tags: ['seasoning', 'staple'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_16',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Red Chilli Powder',
    category: 'spice',
    quantity: 500,
    unit: 'g',
    freshness: 'pantry_stable',
    colorCode: '#dc2626',
    tags: ['spice', 'staple'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_17',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Turmeric Powder',
    category: 'spice',
    quantity: 500,
    unit: 'g',
    freshness: 'pantry_stable',
    colorCode: '#eab308',
    tags: ['spice', 'staple'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_18',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Mustard Seeds',
    category: 'spice',
    quantity: 250,
    unit: 'g',
    freshness: 'pantry_stable',
    colorCode: '#a16207',
    tags: ['tempering', 'spice'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_19',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Cumin Seeds',
    category: 'spice',
    quantity: 250,
    unit: 'g',
    freshness: 'pantry_stable',
    colorCode: '#854d0e',
    tags: ['tempering', 'spice'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_20',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Curry Leaves',
    category: 'produce',
    quantity: 100,
    unit: 'g',
    freshness: 'fresh',
    colorCode: '#15803d',
    tags: ['herbs', 'fresh'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_21',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Ginger Garlic Paste',
    category: 'spice',
    quantity: 500,
    unit: 'g',
    freshness: 'fresh',
    colorCode: '#fef08a',
    tags: ['aromatic', 'staple'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_22',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Green Chillies',
    category: 'produce',
    quantity: 250,
    unit: 'g',
    freshness: 'fresh',
    colorCode: '#16a34a',
    tags: ['spicy', 'produce'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_23',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Toor Dal',
    category: 'grain',
    quantity: 5,
    unit: 'kg',
    freshness: 'pantry_stable',
    colorCode: '#f59e0b',
    tags: ['lentils', 'protein'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_24',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Mixed Vegetables',
    category: 'produce',
    quantity: 3,
    unit: 'kg',
    freshness: 'fresh',
    colorCode: '#22c55e',
    tags: ['produce', 'veggies'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_25',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Water',
    category: 'liquid',
    quantity: 50,
    unit: 'L',
    freshness: 'pantry_stable',
    colorCode: '#38bdf8',
    tags: ['liquid', 'staple'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_26',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Garam Masala',
    category: 'spice',
    quantity: 250,
    unit: 'g',
    freshness: 'pantry_stable',
    colorCode: '#b45309',
    tags: ['spice', 'aromatic'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_27',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Butter',
    category: 'dairy',
    quantity: 500,
    unit: 'g',
    freshness: 'fresh',
    colorCode: '#fef08a',
    tags: ['dairy', 'fat', 'baking'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_28',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'All-Purpose Flour',
    category: 'grain',
    quantity: 5,
    unit: 'kg',
    freshness: 'pantry_stable',
    colorCode: '#fef9c3',
    tags: ['baking', 'staple', 'pastry'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_29',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Sugar',
    category: 'other',
    quantity: 3,
    unit: 'kg',
    freshness: 'pantry_stable',
    colorCode: '#ffffff',
    tags: ['baking', 'sweetener', 'staple'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_30',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Cocoa Powder',
    category: 'other',
    quantity: 500,
    unit: 'g',
    freshness: 'pantry_stable',
    colorCode: '#78350f',
    tags: ['baking', 'chocolate', 'dessert'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_31',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Milk',
    category: 'dairy',
    quantity: 3,
    unit: 'L',
    freshness: 'fresh',
    colorCode: '#e0f2fe',
    tags: ['dairy', 'baking', 'beverage'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_32',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Eggs',
    category: 'dairy',
    quantity: 12,
    unit: 'pcs',
    freshness: 'fresh',
    colorCode: '#fed7aa',
    tags: ['protein', 'baking'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_33',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Dark Chocolate',
    category: 'other',
    quantity: 500,
    unit: 'g',
    freshness: 'pantry_stable',
    colorCode: '#451a03',
    tags: ['chocolate', 'baking', 'dessert'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_34',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Drumsticks',
    category: 'produce',
    quantity: 1,
    unit: 'kg',
    freshness: 'fresh',
    colorCode: '#15803d',
    tags: ['vegetable', 'curry', 'fresh'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_35',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Pasta',
    category: 'grain',
    quantity: 2,
    unit: 'kg',
    freshness: 'pantry_stable',
    colorCode: '#fde68a',
    tags: ['pasta', 'staple', 'italian'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_36',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Baking Powder',
    category: 'other',
    quantity: 200,
    unit: 'g',
    freshness: 'pantry_stable',
    colorCode: '#f1f5f9',
    tags: ['baking', 'leavening'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_37',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Vanilla Extract',
    category: 'liquid',
    quantity: 100,
    unit: 'ml',
    freshness: 'pantry_stable',
    colorCode: '#b45309',
    tags: ['baking', 'flavoring'],
    createdAt: new Date().toISOString()
  }
];

function loadPantryForRestaurant(restaurantId?: string | null): Ingredient[] {
  const key = getPantryStorageKey(restaurantId);
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Merge missing default essentials into user's saved pantry so baking/curry recipes can run seamlessly
        const defaults = getDefaultPantry(restaurantId || undefined);
        const existingNames = new Set(parsed.map((p: Ingredient) => p.name.toLowerCase()));
        const missingDefaults = defaults.filter((d) => !existingNames.has(d.name.toLowerCase()));
        if (missingDefaults.length > 0) {
          const merged = [...parsed, ...missingDefaults];
          localStorage.setItem(key, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn(`Could not parse saved pantry for key ${key}`, e);
  }
  const defaultItems = getDefaultPantry(restaurantId || undefined);
  localStorage.setItem(key, JSON.stringify(defaultItems));
  return defaultItems;
}

const initialRecipes: Recipe[] = MASTER_RECIPE_CATALOG;


const initialState: KitchenGlobalState = {
  pantry: loadPantryForRestaurant(null),
  recipes: initialRecipes,
  groceryList: GroceryService.loadGrocery(null),
  transactions: InventoryTransactionService.loadTransactions(null),
  selectedRecipeId: null,
  activeCookingRecipe: null,
  aiState: 'idle',
  activeZone: null,
  hasVisited: false,
  userPreferences: {
    dietaryRestrictions: ['Vegetarian', 'Gluten-Free Friendly'],
    unitSystem: 'metric',
    theme: 'glassmorphism',
    soundEnabled: true,
    spatial3dEnabled: true,
    voiceGuidanceEnabled: true
  },
  aiHistory: []
};

function kitchenReducer(state: KitchenGlobalState, action: KitchenAction): KitchenGlobalState {
  switch (action.type) {
    case 'SET_PANTRY_DATA':
      return { ...state, pantry: action.payload };

    case 'SET_TRANSACTIONS_DATA':
      return { ...state, transactions: action.payload };

    case 'SET_GROCERY_DATA':
      return { ...state, groceryList: action.payload };

    case 'SET_AI_STATE':
      return { ...state, aiState: action.payload };

    case 'SET_ACTIVE_ZONE':
      return { ...state, activeZone: action.payload };

    case 'ADD_INGREDIENT':
      return { ...state, pantry: [action.payload, ...state.pantry] };

    case 'UPDATE_INGREDIENT':
      return {
        ...state,
        pantry: state.pantry.map((item) => (item.id === action.payload.id ? action.payload : item))
      };

    case 'UPDATE_INGREDIENT_QUANTITY': {
      return {
        ...state,
        pantry: state.pantry.map((item) => {
          if (item.id === action.payload.id) {
            const newQty = Math.max(0, item.quantity + action.payload.delta);
            return {
              ...item,
              quantity: newQty,
              freshness: newQty === 0 ? 'critical' : item.freshness
            };
          }
          return item;
        })
      };
    }

    case 'UPDATE_FRESHNESS': {
      return {
        ...state,
        pantry: state.pantry.map((item) =>
          item.id === action.payload.id ? { ...item, freshness: action.payload.freshness } : item
        )
      };
    }

    case 'REMOVE_INGREDIENT':
      return { ...state, pantry: state.pantry.filter((item) => item.id !== action.payload) };

    case 'CLEAR_PANTRY':
      return { ...state, pantry: [] };

    case 'LOG_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case 'RECORD_USAGE': {
      const { itemId, quantity, unit, reason, createdBy } = action.payload;
      const target = state.pantry.find((p) => p.id === itemId);
      if (!target) return state;

      const prevQty = target.quantity;
      const newQty = Math.max(0, prevQty - quantity);
      const updatedPantry = state.pantry.map((p) =>
        p.id === itemId ? { ...p, quantity: newQty, freshness: newQty === 0 ? ('critical' as FreshnessLevel) : p.freshness } : p
      );

      const tx: InventoryTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        restaurantId: target.restaurantId || 'rest_spice_garden',
        inventoryItemId: itemId,
        itemName: target.name,
        type: 'MANUAL_ADJUSTMENT',
        quantity,
        unit,
        previousQuantity: prevQty,
        newQuantity: newQty,
        reason: reason || 'Kitchen Usage',
        createdBy,
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        pantry: updatedPantry,
        transactions: [tx, ...state.transactions]
      };
    }

    case 'RECORD_WASTE': {
      const { itemId, quantity, unit, reason, createdBy } = action.payload;
      const target = state.pantry.find((p) => p.id === itemId);
      if (!target) return state;

      const prevQty = target.quantity;
      const newQty = Math.max(0, prevQty - quantity);
      const updatedPantry = state.pantry.map((p) =>
        p.id === itemId ? { ...p, quantity: newQty, freshness: newQty === 0 ? ('critical' as FreshnessLevel) : p.freshness } : p
      );

      const tx: InventoryTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        restaurantId: target.restaurantId || 'rest_spice_garden',
        inventoryItemId: itemId,
        itemName: target.name,
        type: 'WASTE',
        quantity,
        unit,
        previousQuantity: prevQty,
        newQuantity: newQty,
        reason: reason || 'Waste recorded',
        createdBy,
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        pantry: updatedPantry,
        transactions: [tx, ...state.transactions]
      };
    }

    case 'ADJUST_STOCK': {
      const { itemId, actualQuantity, reason, createdBy } = action.payload;
      const target = state.pantry.find((p) => p.id === itemId);
      if (!target) return state;

      const prevQty = target.quantity;
      const diff = actualQuantity - prevQty;
      const updatedPantry = state.pantry.map((p) =>
        p.id === itemId ? { ...p, quantity: actualQuantity, freshness: actualQuantity === 0 ? ('critical' as FreshnessLevel) : p.freshness } : p
      );

      const tx: InventoryTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        restaurantId: target.restaurantId || 'rest_spice_garden',
        inventoryItemId: itemId,
        itemName: target.name,
        type: 'CORRECTION',
        quantity: Math.abs(diff),
        unit: target.unit,
        previousQuantity: prevQty,
        newQuantity: actualQuantity,
        reason: reason || 'Stock Reconciliation',
        createdBy,
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        pantry: updatedPantry,
        transactions: [tx, ...state.transactions]
      };
    }

    case 'ADD_RECIPE':
      return { ...state, recipes: [action.payload, ...state.recipes] };

    case 'SET_SELECTED_RECIPE':
      return { ...state, selectedRecipeId: action.payload };

    case 'START_COOKING_RECIPE':
      return { ...state, activeCookingRecipe: action.payload, selectedRecipeId: action.payload.id };

    case 'FINISH_COOKING_DEDUCTION': {
      const { recipe, user } = action.payload;
      const newTransactions: InventoryTransaction[] = [];

      const updatedPantry = state.pantry.map((pantryItem) => {
        const matchedReq = recipe.ingredients.find(
          (ing) => IngredientUtils.areIngredientsMatching(ing.name, pantryItem.name)
        );
        if (matchedReq) {
          const convertedDeduction = IngredientUtils.convertUnit(matchedReq.amount, matchedReq.unit, pantryItem.unit);
          const remaining = Math.max(0, Math.round((pantryItem.quantity - convertedDeduction) * 100) / 100);
          const actualDeducted = Math.round((pantryItem.quantity - remaining) * 100) / 100;

          if (actualDeducted > 0) {
            newTransactions.push({
              id: `tx_cook_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              restaurantId: pantryItem.restaurantId || 'rest_spice_garden',
              inventoryItemId: pantryItem.id,
              itemName: pantryItem.name,
              type: 'USED_IN_COOKING',
              quantity: actualDeducted,
              unit: pantryItem.unit,
              previousQuantity: pantryItem.quantity,
              newQuantity: remaining,
              reason: `Used in cooking "${recipe.title}"`,
              referenceId: recipe.id,
              createdBy: user || 'Chef',
              createdAt: new Date().toISOString()
            });
          }

          return {
            ...pantryItem,
            quantity: remaining,
            freshness: remaining === 0 ? ('critical' as FreshnessLevel) : pantryItem.freshness
          };
        }
        return pantryItem;
      });

      return {
        ...state,
        pantry: updatedPantry,
        transactions: [...newTransactions, ...state.transactions]
      };
    }

    case 'ADD_GROCERY_ITEM':
      return { ...state, groceryList: [action.payload, ...state.groceryList] };

    case 'UPDATE_GROCERY_ITEM':
      return {
        ...state,
        groceryList: state.groceryList.map((g) => (g.id === action.payload.id ? action.payload : g))
      };

    case 'DELETE_GROCERY_ITEM':
      return {
        ...state,
        groceryList: state.groceryList.filter((g) => g.id !== action.payload)
      };

    case 'MARK_GROCERY_PURCHASED':
      return {
        ...state,
        groceryList: state.groceryList.map((g) =>
          g.id === action.payload ? { ...g, status: 'PURCHASED', updatedAt: new Date().toISOString() } : g
        )
      };

    case 'RECEIVE_GROCERY_DELIVERY': {
      const { groceryId, receivedQuantity, receivedUnit, user } = action.payload;
      const targetGrocery = state.groceryList.find((g) => g.id === groceryId);
      if (!targetGrocery) return state;

      const restId = targetGrocery.restaurantId || 'rest_spice_garden';
      const actualUnit = receivedUnit || targetGrocery.unit;

      // Find existing inventory item by fuzzy matching
      const existingIng = state.pantry.find((p) => IngredientUtils.areIngredientsMatching(targetGrocery.name, p.name));

      let updatedPantry = [...state.pantry];
      let prevQty = 0;
      let newQty = receivedQuantity;

      if (existingIng) {
        prevQty = existingIng.quantity;
        const convertedAddQty = IngredientUtils.convertUnit(receivedQuantity, actualUnit, existingIng.unit);
        newQty = Math.round((existingIng.quantity + convertedAddQty) * 100) / 100;

        updatedPantry = state.pantry.map((p) =>
          p.id === existingIng.id ? { ...p, quantity: newQty, freshness: 'fresh', updatedAt: new Date().toISOString() } : p
        );
      } else {
        const newIng: Ingredient = {
          id: `ing_deliv_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
          restaurantId: restId,
          name: targetGrocery.name,
          quantity: receivedQuantity,
          unit: actualUnit,
          category: (targetGrocery.category?.toLowerCase() as any) || 'produce',
          freshness: 'fresh',
          colorCode: '#10b981',
          createdAt: new Date().toISOString(),
          createdBy: user || 'Staff'
        };
        updatedPantry = [newIng, ...state.pantry];
      }

      const tx: InventoryTransaction = {
        id: `tx_deliv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        restaurantId: restId,
        inventoryItemId: existingIng?.id,
        itemName: targetGrocery.name,
        type: 'RECEIVED',
        quantity: receivedQuantity,
        unit: actualUnit,
        previousQuantity: prevQty,
        newQuantity: newQty,
        reason: `Quick-add delivery received from grocery item (${targetGrocery.name})`,
        referenceId: groceryId,
        createdBy: user || 'Staff',
        createdAt: new Date().toISOString()
      };

      // Check partial vs full receipt
      const convertedReceivedInGroceryUnit = IngredientUtils.convertUnit(receivedQuantity, actualUnit, targetGrocery.unit);
      const isPartial = convertedReceivedInGroceryUnit < targetGrocery.quantity;

      const updatedGroceryList = state.groceryList.map((g) => {
        if (g.id === groceryId) {
          if (isPartial) {
            const remainingNeeded = Math.max(0, Math.round((g.quantity - convertedReceivedInGroceryUnit) * 100) / 100);
            return {
              ...g,
              quantity: remainingNeeded,
              reason: `Partial delivery received (${receivedQuantity} ${actualUnit} arrived). ${remainingNeeded} ${g.unit} remaining needed.`,
              updatedAt: new Date().toISOString()
            };
          } else {
            return { ...g, status: 'RECEIVED' as const, updatedAt: new Date().toISOString() };
          }
        }
        return g;
      });

      return {
        ...state,
        pantry: updatedPantry,
        groceryList: updatedGroceryList,
        transactions: [tx, ...state.transactions]
      };
    }

    case 'SET_ALL_GROCERY_ITEMS':
      return { ...state, groceryList: action.payload };

    case 'ADD_AI_RESPONSE':
      return { ...state, aiHistory: [action.payload, ...state.aiHistory] };

    case 'TOGGLE_SPATIAL_3D':
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          spatial3dEnabled: action.payload
        }
      };

    case 'UPDATE_USER_PREFERENCES':
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          ...action.payload
        }
      };

    case 'MARK_VISITED':
      return { ...state, hasVisited: true };

    default:
      return state;
  }
}

interface KitchenContextType {
  state: KitchenGlobalState;
  dispatch: React.Dispatch<KitchenAction>;
  setAIState: (aiState: AIBrainState) => void;
  setActiveZone: (zoneId: KitchenZoneId | null) => void;
  addIngredient: (ingredient: Ingredient) => void;
  updateIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (id: string) => void;
  clearPantry: () => void;
  updateQuantity: (id: string, delta: number) => void;
  updateFreshness: (id: string, freshness: FreshnessLevel) => void;
  logTransaction: (tx: InventoryTransaction) => void;
  recordUsage: (itemId: string, quantity: number, unit: string, reason: string) => void;
  recordWaste: (itemId: string, quantity: number, unit: string, reason: string) => void;
  adjustStock: (itemId: string, actualQuantity: number, reason: string) => void;
  addRecipe: (recipe: Recipe) => void;
  setSelectedRecipe: (id: string | null) => void;
  startCooking: (recipe: Recipe) => void;
  finishCookingDeduction: (recipe: Recipe) => void;
  addGroceryItem: (item: SmartGroceryItem) => void;
  updateGroceryItem: (item: SmartGroceryItem) => void;
  deleteGroceryItem: (id: string) => void;
  markGroceryPurchased: (id: string) => void;
  receiveGroceryDelivery: (groceryId: string, receivedQuantity: number, receivedUnit?: string) => void;
  setAllGroceryItems: (items: SmartGroceryItem[]) => void;
  addAIResponse: (response: AIResponsePayload) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined);

export const KitchenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { restaurantId, user } = useAuth();
  const [state, dispatch] = useReducer(kitchenReducer, initialState);

  // Sync pantry data whenever restaurantId changes
  useEffect(() => {
    const restaurantPantry = loadPantryForRestaurant(restaurantId);
    dispatch({ type: 'SET_PANTRY_DATA', payload: restaurantPantry });

    const restaurantTxs = InventoryTransactionService.loadTransactions(restaurantId);
    dispatch({ type: 'SET_TRANSACTIONS_DATA', payload: restaurantTxs });

    const restaurantGrocery = GroceryService.loadGrocery(restaurantId);
    dispatch({ type: 'SET_GROCERY_DATA', payload: restaurantGrocery });
  }, [restaurantId]);

  // Persist pantry data
  useEffect(() => {
    const key = getPantryStorageKey(restaurantId);
    try {
      localStorage.setItem(key, JSON.stringify(state.pantry));
    } catch (e) {
      console.warn(`Failed to save pantry for key ${key}`, e);
    }
  }, [state.pantry, restaurantId]);

  // Persist transactions data
  useEffect(() => {
    InventoryTransactionService.saveTransactions(restaurantId, state.transactions);
  }, [state.transactions, restaurantId]);

  // Persist grocery data
  useEffect(() => {
    GroceryService.saveGrocery(restaurantId, state.groceryList);
  }, [state.groceryList, restaurantId]);

  const setAIState = (aiState: AIBrainState) => {
    dispatch({ type: 'SET_AI_STATE', payload: aiState });
  };

  const setActiveZone = (zoneId: KitchenZoneId | null) => {
    dispatch({ type: 'SET_ACTIVE_ZONE', payload: zoneId });
  };

  const addIngredient = (ingredient: Ingredient) => {
    const stamped: Ingredient = {
      ...ingredient,
      restaurantId: restaurantId || ingredient.restaurantId || 'rest_spice_garden',
      createdBy: ingredient.createdBy || user?.name || 'Staff Member'
    };
    dispatch({ type: 'ADD_INGREDIENT', payload: stamped });

    // Log transaction
    const tx = InventoryTransactionService.createTransaction({
      restaurantId: stamped.restaurantId!,
      inventoryItemId: stamped.id,
      itemName: stamped.name,
      type: stamped.notes?.includes('Camera') ? 'CAMERA_RECEIVED' : 'RECEIVED',
      quantity: stamped.quantity,
      unit: stamped.unit,
      previousQuantity: 0,
      newQuantity: stamped.quantity,
      reason: stamped.notes || 'Added stock item to restaurant inventory',
      createdBy: user?.name || 'Staff'
    });
    dispatch({ type: 'LOG_TRANSACTION', payload: tx });
  };

  const updateIngredient = (ingredient: Ingredient) => {
    const prev = state.pantry.find((p) => p.id === ingredient.id);
    const prevQty = prev ? prev.quantity : 0;

    const stamped: Ingredient = {
      ...ingredient,
      restaurantId: restaurantId || ingredient.restaurantId || 'rest_spice_garden',
      updatedBy: user?.name || 'Staff Member',
      updatedAt: new Date().toISOString()
    };
    dispatch({ type: 'UPDATE_INGREDIENT', payload: stamped });

    if (prev && prev.quantity !== ingredient.quantity) {
      const tx = InventoryTransactionService.createTransaction({
        restaurantId: stamped.restaurantId!,
        inventoryItemId: stamped.id,
        itemName: stamped.name,
        type: ingredient.quantity > prevQty ? (ingredient.notes?.includes('Camera') ? 'CAMERA_RECEIVED' : 'RECEIVED') : 'MANUAL_ADJUSTMENT',
        quantity: Math.abs(ingredient.quantity - prevQty),
        unit: ingredient.unit,
        previousQuantity: prevQty,
        newQuantity: ingredient.quantity,
        reason: 'Stock updated by user',
        createdBy: user?.name || 'Staff'
      });
      dispatch({ type: 'LOG_TRANSACTION', payload: tx });
    }
  };

  const removeIngredient = (id: string) => {
    dispatch({ type: 'REMOVE_INGREDIENT', payload: id });
  };

  const clearPantry = () => {
    dispatch({ type: 'CLEAR_PANTRY' });
  };

  const updateQuantity = (id: string, delta: number) => {
    const item = state.pantry.find((p) => p.id === id);
    if (item) {
      const prevQty = item.quantity;
      const newQty = Math.max(0, item.quantity + delta);
      dispatch({ type: 'UPDATE_INGREDIENT_QUANTITY', payload: { id, delta } });

      const tx = InventoryTransactionService.createTransaction({
        restaurantId: item.restaurantId || restaurantId || 'rest_spice_garden',
        inventoryItemId: id,
        itemName: item.name,
        type: delta > 0 ? 'RECEIVED' : 'MANUAL_ADJUSTMENT',
        quantity: Math.abs(delta),
        unit: item.unit,
        previousQuantity: prevQty,
        newQuantity: newQty,
        reason: 'Quick quantity delta adjustment',
        createdBy: user?.name || 'Staff'
      });
      dispatch({ type: 'LOG_TRANSACTION', payload: tx });
    }
  };

  const updateFreshness = (id: string, freshness: FreshnessLevel) => {
    dispatch({ type: 'UPDATE_FRESHNESS', payload: { id, freshness } });
  };

  const logTransaction = (tx: InventoryTransaction) => {
    dispatch({ type: 'LOG_TRANSACTION', payload: tx });
  };

  const recordUsage = (itemId: string, quantity: number, unit: string, reason: string) => {
    dispatch({
      type: 'RECORD_USAGE',
      payload: { itemId, quantity, unit, reason, createdBy: user?.name || 'Staff' }
    });
  };

  const recordWaste = (itemId: string, quantity: number, unit: string, reason: string) => {
    dispatch({
      type: 'RECORD_WASTE',
      payload: { itemId, quantity, unit, reason, createdBy: user?.name || 'Staff' }
    });
  };

  const adjustStock = (itemId: string, actualQuantity: number, reason: string) => {
    dispatch({
      type: 'ADJUST_STOCK',
      payload: { itemId, actualQuantity, reason, createdBy: user?.name || 'Staff' }
    });
  };

  const addRecipe = (recipe: Recipe) => {
    dispatch({ type: 'ADD_RECIPE', payload: recipe });
  };

  const setSelectedRecipe = (id: string | null) => {
    dispatch({ type: 'SET_SELECTED_RECIPE', payload: id });
  };

  const startCooking = (recipe: Recipe) => {
    dispatch({ type: 'START_COOKING_RECIPE', payload: recipe });
  };

  const finishCookingDeduction = (recipe: Recipe) => {
    dispatch({ type: 'FINISH_COOKING_DEDUCTION', payload: { recipe, user: user?.name || 'Chef' } });
  };

  const addGroceryItem = (item: SmartGroceryItem) => {
    const stamped: SmartGroceryItem = {
      ...item,
      restaurantId: restaurantId || item.restaurantId || 'rest_spice_garden',
      createdBy: user?.name || 'Staff'
    };
    dispatch({ type: 'ADD_GROCERY_ITEM', payload: stamped });
  };

  const updateGroceryItem = (item: SmartGroceryItem) => {
    dispatch({ type: 'UPDATE_GROCERY_ITEM', payload: item });
  };

  const deleteGroceryItem = (id: string) => {
    dispatch({ type: 'DELETE_GROCERY_ITEM', payload: id });
  };

  const markGroceryPurchased = (id: string) => {
    dispatch({ type: 'MARK_GROCERY_PURCHASED', payload: id });
  };

  const receiveGroceryDelivery = (groceryId: string, receivedQuantity: number, receivedUnit?: string) => {
    dispatch({
      type: 'RECEIVE_GROCERY_DELIVERY',
      payload: { groceryId, receivedQuantity, receivedUnit, user: user?.name || 'Staff' }
    });
  };

  const setAllGroceryItems = (items: SmartGroceryItem[]) => {
    dispatch({ type: 'SET_ALL_GROCERY_ITEMS', payload: items });
  };

  const addAIResponse = (response: AIResponsePayload) => {
    dispatch({ type: 'ADD_AI_RESPONSE', payload: response });
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: prefs });
  };

  return (
    <KitchenContext.Provider
      value={{
        state,
        dispatch,
        setAIState,
        setActiveZone,
        addIngredient,
        updateIngredient,
        removeIngredient,
        clearPantry,
        updateQuantity,
        updateFreshness,
        logTransaction,
        recordUsage,
        recordWaste,
        adjustStock,
        addRecipe,
        setSelectedRecipe,
        startCooking,
        finishCookingDeduction,
        addGroceryItem,
        updateGroceryItem,
        deleteGroceryItem,
        markGroceryPurchased,
        receiveGroceryDelivery,
        setAllGroceryItems,
        addAIResponse,
        updatePreferences
      }}
    >
      {children}
    </KitchenContext.Provider>
  );
};

export function useKitchenState() {
  const context = useContext(KitchenContext);
  if (!context) {
    throw new Error('useKitchenState must be used within a KitchenProvider');
  }
  return context;
}
