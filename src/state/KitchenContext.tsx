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
    quantity: 2,
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
    quantity: 500,
    unit: 'g',
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
    quantity: 250,
    unit: 'g',
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
    quantity: 3,
    unit: 'pcs',
    freshness: 'expiring_soon',
    colorCode: '#15803d',
    tags: ['healthy-fats', 'keto'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'ing_5',
    restaurantId: restaurantId || 'rest_spice_garden',
    name: 'Raw Cashews',
    category: 'other',
    quantity: 300,
    unit: 'g',
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
    quantity: 200,
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
    quantity: 500,
    unit: 'g',
    freshness: 'expiring_soon',
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
    quantity: 4,
    unit: 'kg',
    freshness: 'fresh',
    colorCode: '#ef4444',
    tags: ['veggie', 'fresh'],
    createdAt: new Date().toISOString()
  }
];

function loadPantryForRestaurant(restaurantId?: string | null): Ingredient[] {
  const key = getPantryStorageKey(restaurantId);
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn(`Could not parse saved pantry for key ${key}`, e);
  }
  return getDefaultPantry(restaurantId || undefined);
}

const initialRecipes: Recipe[] = [
  {
    id: 'rec_1',
    title: 'Dragon Fruit & Berry Smoothie Bowl',
    description: 'Vibrant, antioxidant-packed bowl crowned with sliced avocado, raw cashews, and chia seeds.',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: 'Easy',
    category: 'Breakfast',
    cuisine: 'Modern Fusion',
    dietaryTags: ['Vegan', 'Gluten-Free', 'High-Antioxidant'],
    colorGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Dragon Fruit', amount: 1, unit: 'pcs' },
      { name: 'Greek Yogurt', amount: 150, unit: 'g' },
      { name: 'Raw Cashews', amount: 30, unit: 'g' }
    ],
    instructions: [
      { step: 1, text: 'Dice the fresh dragon fruit into uniform cubes, reserving half for topping.', durationMinutes: 2 },
      { step: 2, text: 'Blend remaining dragon fruit with Greek yogurt until velvety smooth.', durationMinutes: 3 },
      { step: 3, text: 'Pour into chilled serving bowl and garnish with cashews.', durationMinutes: 2 }
    ],
    nutrition: { calories: 310, protein: 12, carbs: 42, fat: 11 }
  },
  {
    id: 'rec_2',
    title: 'Pan-Seared Paneer & Avocado Bowl',
    description: 'Crispy golden paneer cubes served over warm seasoned grain with creamy Hass avocado slices.',
    prepTime: 15,
    cookTime: 10,
    servings: 2,
    difficulty: 'Medium',
    category: 'Lunch',
    cuisine: 'Indian Fusion',
    dietaryTags: ['Vegetarian', 'High-Protein', 'Keto-Friendly'],
    colorGradient: 'linear-gradient(135deg, #f59e0b 0%, #10b981 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Fresh Paneer', amount: 200, unit: 'g' },
      { name: 'Hass Avocado', amount: 1, unit: 'pcs' },
      { name: 'Cherry Tomatoes', amount: 100, unit: 'g' }
    ],
    instructions: [
      { step: 1, text: 'Cut paneer into 1-inch cubes and toss gently with spices.', durationMinutes: 3 },
      { step: 2, text: 'Sear paneer cubes until golden brown.', durationMinutes: 5 },
      { step: 3, text: 'Assemble bowl with avocado, cherry tomatoes, and warm paneer.', durationMinutes: 2 }
    ],
    nutrition: { calories: 480, protein: 24, carbs: 36, fat: 36 }
  },
  {
    id: 'rec_3',
    title: 'Nutritious Cashew & Ragi Porridge',
    description: 'Wholesome finger millet porridge simmered with roasted cashew cream and cardamom.',
    prepTime: 5,
    cookTime: 15,
    servings: 2,
    difficulty: 'Easy',
    category: 'Breakfast',
    cuisine: 'Traditional Indian',
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'High-Fiber'],
    colorGradient: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Finger Millet (Ragi)', amount: 100, unit: 'g' },
      { name: 'Raw Cashews', amount: 50, unit: 'g' }
    ],
    instructions: [
      { step: 1, text: 'Soak cashews and blend into a rich smooth paste.', durationMinutes: 5 },
      { step: 2, text: 'Whisk ragi flour in water and simmer until thickened.', durationMinutes: 8 },
      { step: 3, text: 'Stir in cashew cream and serve warm.', durationMinutes: 2 }
    ],
    nutrition: { calories: 360, protein: 11, carbs: 54, fat: 12 }
  },
  {
    id: 'rec_4',
    title: 'Comforting Rice & Potato Masala Fry',
    description: 'A savory classic featuring fragrant seasoned rice paired with golden spiced potato cubes.',
    prepTime: 10,
    cookTime: 20,
    servings: 3,
    difficulty: 'Easy',
    category: 'Dinner',
    cuisine: 'Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Comfort-Food'],
    colorGradient: 'linear-gradient(135deg, #38bdf8 0%, #06b6d4 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Rice', amount: 2, unit: 'kg' },
      { name: 'Potato', amount: 1, unit: 'kg' }
    ],
    instructions: [
      { step: 1, text: 'Rinse rice and cook until fluffy.', durationMinutes: 12 },
      { step: 2, text: 'Dice potatoes and pan-fry with spices.', durationMinutes: 8 },
      { step: 3, text: 'Combine rice and potatoes and serve hot.', durationMinutes: 2 }
    ],
    nutrition: { calories: 410, protein: 8, carbs: 78, fat: 8 }
  },
  {
    id: 'rec_5',
    title: 'Chicken Curry',
    description: 'Traditional restaurant style chicken curry prepared with tender chicken pieces, onion gravy, and aromatic spices.',
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medium',
    category: 'Dinner',
    cuisine: 'Indian',
    dietaryTags: ['High-Protein', 'Non-Vegetarian', 'Gluten-Free'],
    colorGradient: 'linear-gradient(135deg, #f43f5e 0%, #b91c1c 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Chicken', amount: 2, unit: 'kg' },
      { name: 'Onion', amount: 1, unit: 'kg' },
      { name: 'Tomato', amount: 500, unit: 'g' }
    ],
    instructions: [
      { step: 1, text: 'Marinate chicken with ginger garlic paste and spices.', durationMinutes: 10 },
      { step: 2, text: 'Sauté chopped onions and tomatoes until oil separates.', durationMinutes: 10 },
      { step: 3, text: 'Add chicken and simmer until cooked thoroughly.', durationMinutes: 20 }
    ],
    nutrition: { calories: 520, protein: 45, carbs: 12, fat: 32 }
  },
  {
    id: 'rec_6',
    title: 'Paneer Butter Masala',
    description: 'Rich and creamy paneer curry in a fragrant tomato-butter gravy.',
    prepTime: 15,
    cookTime: 20,
    servings: 3,
    difficulty: 'Medium',
    category: 'Dinner',
    cuisine: 'North Indian',
    dietaryTags: ['Vegetarian', 'High-Protein'],
    colorGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Fresh Paneer', amount: 400, unit: 'g' },
      { name: 'Tomato', amount: 400, unit: 'g' },
      { name: 'Raw Cashews', amount: 100, unit: 'g' },
      { name: 'Greek Yogurt', amount: 100, unit: 'g' }
    ],
    instructions: [
      { step: 1, text: 'Make cashew and tomato puree.', durationMinutes: 5 },
      { step: 2, text: 'Simmer gravy with spices.', durationMinutes: 10 },
      { step: 3, text: 'Add paneer cubes and simmer.', durationMinutes: 5 }
    ],
    nutrition: { calories: 450, protein: 18, carbs: 22, fat: 32 }
  }
];

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
          (ing) => ing.name.toLowerCase() === pantryItem.name.toLowerCase()
        );
        if (matchedReq) {
          const remaining = Math.max(0, pantryItem.quantity - matchedReq.amount);
          newTransactions.push({
            id: `tx_cook_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            restaurantId: pantryItem.restaurantId || 'rest_spice_garden',
            inventoryItemId: pantryItem.id,
            itemName: pantryItem.name,
            type: 'USED_IN_COOKING',
            quantity: matchedReq.amount,
            unit: matchedReq.unit || pantryItem.unit,
            previousQuantity: pantryItem.quantity,
            newQuantity: remaining,
            reason: `Used in cooking "${recipe.title}"`,
            referenceId: recipe.id,
            createdBy: user || 'Chef',
            createdAt: new Date().toISOString()
          });

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
      const { groceryId, receivedQuantity, user } = action.payload;
      const targetGrocery = state.groceryList.find((g) => g.id === groceryId);
      if (!targetGrocery) return state;

      const restId = targetGrocery.restaurantId || 'rest_spice_garden';
      const existingIng = state.pantry.find((p) => p.name.toLowerCase() === targetGrocery.name.toLowerCase());

      let updatedPantry = [...state.pantry];
      let prevQty = 0;
      let newQty = receivedQuantity;

      if (existingIng) {
        prevQty = existingIng.quantity;
        newQty = Math.round((existingIng.quantity + receivedQuantity) * 100) / 100;
        updatedPantry = state.pantry.map((p) =>
          p.id === existingIng.id ? { ...p, quantity: newQty, freshness: 'fresh', updatedAt: new Date().toISOString() } : p
        );
      } else {
        const newIng: Ingredient = {
          id: `ing_deliv_${Date.now()}`,
          restaurantId: restId,
          name: targetGrocery.name,
          quantity: receivedQuantity,
          unit: targetGrocery.unit,
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
        unit: targetGrocery.unit,
        previousQuantity: prevQty,
        newQuantity: newQty,
        reason: `Delivery received from grocery item (Order #${groceryId.slice(0, 6)})`,
        referenceId: groceryId,
        createdBy: user || 'Staff',
        createdAt: new Date().toISOString()
      };

      const isPartial = receivedQuantity < targetGrocery.quantity;
      const updatedGroceryList = state.groceryList.map((g) => {
        if (g.id === groceryId) {
          if (isPartial) {
            const remainingNeeded = Math.max(0, g.quantity - receivedQuantity);
            return {
              ...g,
              quantity: remainingNeeded,
              reason: `Partial delivery received (${receivedQuantity} ${g.unit} arrived). ${remainingNeeded} ${g.unit} remaining needed.`,
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
  receiveGroceryDelivery: (groceryId: string, receivedQuantity: number) => void;
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

  const receiveGroceryDelivery = (groceryId: string, receivedQuantity: number) => {
    dispatch({
      type: 'RECEIVE_GROCERY_DELIVERY',
      payload: { groceryId, receivedQuantity, user: user?.name || 'Staff' }
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
