import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { KitchenGlobalState, KitchenAction, GroceryItem, UserPreferences } from './types';
import type { AIBrainState, AIResponsePayload } from '../types/ai';
import type { KitchenZoneId } from '../types/kitchen';
import type { Ingredient, FreshnessLevel } from '../types/ingredient';
import type { Recipe } from '../types/recipe';

const LOCAL_STORAGE_PANTRY_KEY = 'smart_pantry_items_v1';

const defaultPantry: Ingredient[] = [
  {
    id: 'ing_1',
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
    name: 'Greek Yogurt',
    category: 'dairy',
    quantity: 500,
    unit: 'g',
    freshness: 'expiring_soon',
    colorCode: '#38bdf8',
    tags: ['probiotic', 'high-protein'],
    createdAt: new Date().toISOString()
  }
];

function loadSavedPantry(): Ingredient[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PANTRY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Could not parse saved pantry from localStorage', e);
  }
  return defaultPantry;
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
      { name: 'Raw Cashews', amount: 30, unit: 'g' },
      { name: 'Honey or Maple Syrup', amount: 1, unit: 'tbsp', optional: true }
    ],
    instructions: [
      { step: 1, text: 'Dice the fresh dragon fruit into uniform cubes, reserving half for topping.', durationMinutes: 2, tip: 'Keep fruit chilled beforehand for maximum freshness.' },
      { step: 2, text: 'Blend remaining dragon fruit with Greek yogurt until velvety smooth.', durationMinutes: 3, tip: 'Add a splash of almond milk if blend is too thick.' },
      { step: 3, text: 'Pour into chilled serving bowl and garnish with cashews and fresh dragon fruit slices.', durationMinutes: 2 }
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
      { name: 'Cherry Tomatoes', amount: 100, unit: 'g' },
      { name: 'Olive Oil', amount: 1, unit: 'tbsp' }
    ],
    instructions: [
      { step: 1, text: 'Cut paneer into 1-inch cubes and toss gently with salt, turmeric, and paprika.', durationMinutes: 3 },
      { step: 2, text: 'Heat olive oil in a non-stick skillet over medium-high heat.', durationMinutes: 2 },
      { step: 3, text: 'Sear paneer cubes for 2-3 minutes per side until beautifully golden brown.', durationMinutes: 5, tip: 'Avoid over-cooking paneer to maintain soft texture.' },
      { step: 4, text: 'Assemble bowl with sliced avocado, blistered cherry tomatoes, and warm paneer.', durationMinutes: 2 }
    ],
    nutrition: { calories: 480, protein: 24, carbs: 16, fat: 36 }
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
      { name: 'Raw Cashews', amount: 50, unit: 'g' },
      { name: 'Water or Milk', amount: 400, unit: 'ml' },
      { name: 'Jaggery or Brown Sugar', amount: 2, unit: 'tbsp', optional: true }
    ],
    instructions: [
      { step: 1, text: 'Soak cashews in warm water for 10 mins and blend into a rich smooth paste.', durationMinutes: 5 },
      { step: 2, text: 'Whisk ragi flour in room temperature water to form a lump-free slurry.', durationMinutes: 2 },
      { step: 3, text: 'Bring mixture to a gentle boil on low heat, stirring continuously until thickened.', durationMinutes: 8, tip: 'Constant stirring prevents sticking to bottom.' },
      { step: 4, text: 'Stir in cashew cream and sweetener. Serve warm with toasted cashew garnish.', durationMinutes: 2 }
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
      { name: 'Rice', amount: 200, unit: 'g' },
      { name: 'Potato', amount: 2, unit: 'pcs' },
      { name: 'Onion', amount: 1, unit: 'pcs', optional: true },
      { name: 'Spices & Herbs', amount: 1, unit: 'tbsp', optional: true }
    ],
    instructions: [
      { step: 1, text: 'Rinse rice and boil until fluffy and tender.', durationMinutes: 12 },
      { step: 2, text: 'Dice potatoes into small cubes and pan-fry with spices until crispy.', durationMinutes: 8 },
      { step: 3, text: 'Combine rice and potatoes, toss gently, and serve steaming hot.', durationMinutes: 2 }
    ],
    nutrition: { calories: 410, protein: 8, carbs: 78, fat: 8 }
  }
];

const initialGroceryList: GroceryItem[] = [
  { id: 'g_1', name: 'Fresh Mint Leaves', quantity: 1, unit: 'bunch', bought: false, category: 'Produce' },
  { id: 'g_2', name: 'Extra Virgin Olive Oil', quantity: 500, unit: 'ml', bought: false, category: 'Pantry' },
  { id: 'g_3', name: 'Almond Milk', quantity: 1, unit: 'L', bought: true, category: 'Dairy/Alt' }
];

const initialState: KitchenGlobalState = {
  pantry: loadSavedPantry(),
  recipes: initialRecipes,
  groceryList: initialGroceryList,
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

    case 'ADD_RECIPE':
      return { ...state, recipes: [action.payload, ...state.recipes] };

    case 'SET_SELECTED_RECIPE':
      return { ...state, selectedRecipeId: action.payload };

    case 'START_COOKING_RECIPE':
      return { ...state, activeCookingRecipe: action.payload, selectedRecipeId: action.payload.id };

    case 'FINISH_COOKING_DEDUCTION': {
      const { recipe } = action.payload;
      const updatedPantry = state.pantry.map((pantryItem) => {
        const matchedReq = recipe.ingredients.find(
          (ing) => ing.name.toLowerCase() === pantryItem.name.toLowerCase()
        );
        if (matchedReq) {
          const remaining = Math.max(0, pantryItem.quantity - matchedReq.amount);
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
        pantry: updatedPantry
      };
    }

    case 'ADD_GROCERY_ITEM':
      return { ...state, groceryList: [action.payload, ...state.groceryList] };

    case 'TOGGLE_GROCERY_ITEM':
      return {
        ...state,
        groceryList: state.groceryList.map((g) => (g.id === action.payload ? { ...g, bought: !g.bought } : g))
      };

    case 'DELETE_GROCERY_ITEM':
      return {
        ...state,
        groceryList: state.groceryList.filter((g) => g.id !== action.payload)
      };

    case 'TRANSFER_PURCHASED_TO_PANTRY': {
      const purchased = state.groceryList.filter((g) => g.bought);
      if (purchased.length === 0) return state;

      const colors = ['#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'];
      const newPantryAdditions: Ingredient[] = purchased.map((g, idx) => ({
        id: `ing_restock_${Date.now()}_${idx}`,
        name: g.name,
        category: (g.category?.toLowerCase().includes('dairy') ? 'dairy' : 'produce') as any,
        quantity: g.quantity || 1,
        unit: g.unit || 'pcs',
        freshness: 'fresh' as FreshnessLevel,
        colorCode: colors[idx % colors.length],
        tags: ['restocked'],
        createdAt: new Date().toISOString()
      }));

      return {
        ...state,
        pantry: [...newPantryAdditions, ...state.pantry],
        groceryList: state.groceryList.filter((g) => !g.bought)
      };
    }

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
  addRecipe: (recipe: Recipe) => void;
  setSelectedRecipe: (id: string | null) => void;
  startCooking: (recipe: Recipe) => void;
  finishCookingDeduction: (recipe: Recipe) => void;
  addGroceryItem: (item: GroceryItem) => void;
  toggleGroceryItem: (id: string) => void;
  deleteGroceryItem: (id: string) => void;
  transferPurchasedToPantry: () => void;
  addAIResponse: (response: AIResponsePayload) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const KitchenContext = createContext<KitchenContextType | undefined>(undefined);

export const KitchenProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(kitchenReducer, initialState);

  // Requirement 11: Persist pantry data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PANTRY_KEY, JSON.stringify(state.pantry));
    } catch (e) {
      console.warn('Failed to save pantry to localStorage', e);
    }
  }, [state.pantry]);

  const setAIState = (aiState: AIBrainState) => {
    dispatch({ type: 'SET_AI_STATE', payload: aiState });
  };

  const setActiveZone = (zoneId: KitchenZoneId | null) => {
    dispatch({ type: 'SET_ACTIVE_ZONE', payload: zoneId });
  };

  const addIngredient = (ingredient: Ingredient) => {
    dispatch({ type: 'ADD_INGREDIENT', payload: ingredient });
  };

  const updateIngredient = (ingredient: Ingredient) => {
    dispatch({ type: 'UPDATE_INGREDIENT', payload: ingredient });
  };

  const removeIngredient = (id: string) => {
    dispatch({ type: 'REMOVE_INGREDIENT', payload: id });
  };

  const clearPantry = () => {
    dispatch({ type: 'CLEAR_PANTRY' });
  };

  const updateQuantity = (id: string, delta: number) => {
    dispatch({ type: 'UPDATE_INGREDIENT_QUANTITY', payload: { id, delta } });
  };

  const updateFreshness = (id: string, freshness: FreshnessLevel) => {
    dispatch({ type: 'UPDATE_FRESHNESS', payload: { id, freshness } });
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
    dispatch({ type: 'FINISH_COOKING_DEDUCTION', payload: { recipe } });
  };

  const addGroceryItem = (item: GroceryItem) => {
    dispatch({ type: 'ADD_GROCERY_ITEM', payload: item });
  };

  const toggleGroceryItem = (id: string) => {
    dispatch({ type: 'TOGGLE_GROCERY_ITEM', payload: id });
  };

  const deleteGroceryItem = (id: string) => {
    dispatch({ type: 'DELETE_GROCERY_ITEM', payload: id });
  };

  const transferPurchasedToPantry = () => {
    dispatch({ type: 'TRANSFER_PURCHASED_TO_PANTRY' });
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
        addRecipe,
        setSelectedRecipe,
        startCooking,
        finishCookingDeduction,
        addGroceryItem,
        toggleGroceryItem,
        deleteGroceryItem,
        transferPurchasedToPantry,
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
