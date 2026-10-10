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
    tags: ['dairy', 'fat'],
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
    id: 'rec_rice',
    title: 'Steamed Basmati Rice',
    description: 'Fluffy, long-grain basmati rice cooked to perfection with subtle salt and oil seasoning.',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    category: 'Lunch',
    cuisine: 'Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Staple'],
    colorGradient: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Rice', amount: 500, unit: 'g', note: 'Rinsed and soaked for 20 mins' },
      { name: 'Water', amount: 1, unit: 'L', note: 'Filtered cooking water' },
      { name: 'Salt', amount: 5, unit: 'g', note: 'For boiling seasoning' },
      { name: 'Cooking Oil', amount: 10, unit: 'ml', note: 'Prevents rice sticking' }
    ],
    instructions: [
      { step: 1, text: 'Rinse 500 g Rice in cold water until water runs clear; soak for 20 minutes.', durationMinutes: 20, ingredientsUsed: ['Rice', 'Water'], tip: 'Soaking ensures long fluffy grains.' },
      { step: 2, text: 'Bring 1 L Water to a rolling boil, add 5 g Salt and 10 ml Cooking Oil.', durationMinutes: 5, ingredientsUsed: ['Water', 'Salt', 'Cooking Oil'] },
      { step: 3, text: 'Add drained Rice to boiling water, reduce heat to low, cover tightly with lid and simmer for 12 minutes.', durationMinutes: 12, ingredientsUsed: ['Rice'] },
      { step: 4, text: 'Turn off heat, let rest covered for 5 minutes, then fluff gently with a fork before serving.', durationMinutes: 5, ingredientsUsed: [] }
    ],
    nutrition: { calories: 240, protein: 5, carbs: 52, fat: 1 }
  },
  {
    id: 'rec_potato_curry',
    title: 'Homestyle Potato Masala Curry',
    description: 'Tender potato cubes cooked in a spiced onion-tomato gravy with mustard, cumin, and curry leaves.',
    prepTime: 12,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Dinner',
    cuisine: 'Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Comfort-Food'],
    colorGradient: 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Potato', amount: 600, unit: 'g', note: 'Peeled and diced into 1-inch cubes' },
      { name: 'Onion', amount: 150, unit: 'g', note: 'Finely chopped' },
      { name: 'Tomato', amount: 150, unit: 'g', note: 'Pureed or chopped' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'For sautéing and tempering' },
      { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Aromatic paste' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit chillies' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'To taste' },
      { name: 'Red Chilli Powder', amount: 6, unit: 'g', note: 'Warm spice' },
      { name: 'Turmeric Powder', amount: 4, unit: 'g', note: 'Golden color' },
      { name: 'Mustard Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Cumin Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Curry Leaves', amount: 5, unit: 'g', note: 'Fresh sprig' },
      { name: 'Garam Masala', amount: 4, unit: 'g', note: 'Finishing spice' },
      { name: 'Water', amount: 300, unit: 'ml', note: 'Gravy simmer' }
    ],
    instructions: [
      { step: 1, text: 'Peel and cube 600 g Potatoes, chop 150 g Onion and 150 g Tomato.', durationMinutes: 8, ingredientsUsed: ['Potato', 'Onion', 'Tomato'] },
      { step: 2, text: 'Heat 30 ml Cooking Oil in a pan, add Mustard Seeds, Cumin Seeds, and Curry Leaves until they splutter.', durationMinutes: 3, ingredientsUsed: ['Cooking Oil', 'Mustard Seeds', 'Cumin Seeds', 'Curry Leaves'] },
      { step: 3, text: 'Add Onions, Green Chillies, and Ginger Garlic Paste; sauté until golden brown.', durationMinutes: 5, ingredientsUsed: ['Onion', 'Green Chillies', 'Ginger Garlic Paste'] },
      { step: 4, text: 'Add Tomatoes, Salt, Turmeric Powder, and Red Chilli Powder; cook until soft.', durationMinutes: 4, ingredientsUsed: ['Tomato', 'Salt', 'Turmeric Powder', 'Red Chilli Powder'] },
      { step: 5, text: 'Add Potatoes and 300 ml Water; cover and simmer for 12 minutes until potatoes are tender.', durationMinutes: 12, ingredientsUsed: ['Potato', 'Water'] },
      { step: 6, text: 'Stir in 4 g Garam Masala, simmer 2 minutes, and serve hot.', durationMinutes: 2, ingredientsUsed: ['Garam Masala'] }
    ],
    nutrition: { calories: 290, protein: 5, carbs: 42, fat: 11 }
  },
  {
    id: 'rec_egg_curry',
    title: 'Spiced Egg Masala Curry',
    description: 'Hard-boiled eggs simmered in a rich, spicy onion-tomato gravy with aromatic masalas.',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Dinner',
    cuisine: 'Indian',
    dietaryTags: ['High-Protein', 'Gluten-Free'],
    colorGradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Eggs', amount: 4, unit: 'pcs', note: 'Boiled and shallow fried' },
      { name: 'Onion', amount: 200, unit: 'g', note: 'Chopped' },
      { name: 'Tomato', amount: 150, unit: 'g', note: 'Chopped' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'For frying eggs and curry base' },
      { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Fresh' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'To taste' },
      { name: 'Red Chilli Powder', amount: 8, unit: 'g', note: 'Spicy chilli' },
      { name: 'Turmeric Powder', amount: 4, unit: 'g', note: 'For color' },
      { name: 'Garam Masala', amount: 5, unit: 'g', note: 'Finishing spice' },
      { name: 'Water', amount: 250, unit: 'ml', note: 'For gravy' }
    ],
    instructions: [
      { step: 1, text: 'Boil 4 Eggs for 10 minutes, peel shell, and make light vertical slits.', durationMinutes: 10, ingredientsUsed: ['Eggs'] },
      { step: 2, text: 'Heat 10 ml Cooking Oil with pinch of Turmeric & Chilli Powder; sear eggs until golden exterior forms.', durationMinutes: 3, ingredientsUsed: ['Cooking Oil', 'Eggs', 'Turmeric Powder', 'Red Chilli Powder'] },
      { step: 3, text: 'Heat remaining Oil, sauté Onions and Ginger Garlic Paste until translucent.', durationMinutes: 5, ingredientsUsed: ['Cooking Oil', 'Onion', 'Ginger Garlic Paste'] },
      { step: 4, text: 'Add Tomatoes, Salt, and remaining spices; cook until oil separates.', durationMinutes: 5, ingredientsUsed: ['Tomato', 'Salt', 'Red Chilli Powder', 'Turmeric Powder'] },
      { step: 5, text: 'Add 250 ml Water and seared Eggs; simmer for 6 minutes until gravy thickens.', durationMinutes: 6, ingredientsUsed: ['Eggs', 'Water', 'Garam Masala'] }
    ],
    nutrition: { calories: 340, protein: 18, carbs: 14, fat: 22 }
  },
  {
    id: 'rec_tomato_dal',
    title: 'Aromatic Tomato Dal (Pappu)',
    description: 'Yellow lentils cooked with juicy ripe tomatoes, tempered with mustard seeds, cumin, garlic, and curry leaves.',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Lunch',
    cuisine: 'South Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'High-Protein'],
    colorGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Toor Dal', amount: 250, unit: 'g', note: 'Rinsed lentils' },
      { name: 'Tomato', amount: 250, unit: 'g', note: 'Ripe chopped tomatoes' },
      { name: 'Water', amount: 1, unit: 'L', note: 'For cooking lentils' },
      { name: 'Cooking Oil', amount: 25, unit: 'ml', note: 'For tempering' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit chillies' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'To taste' },
      { name: 'Turmeric Powder', amount: 4, unit: 'g', note: 'Golden color' },
      { name: 'Mustard Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Cumin Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Curry Leaves', amount: 5, unit: 'g', note: 'Fresh sprig' }
    ],
    instructions: [
      { step: 1, text: 'Pressure cook 250 g Toor Dal and 250 g Tomatoes with 1 L Water, 4 g Turmeric, and Green Chillies until tender.', durationMinutes: 15, ingredientsUsed: ['Toor Dal', 'Tomato', 'Water', 'Turmeric Powder', 'Green Chillies'] },
      { step: 2, text: 'Mash cooked dal gently to combine tomatoes and lentils.', durationMinutes: 2, ingredientsUsed: ['Toor Dal', 'Tomato'] },
      { step: 3, text: 'Heat 25 ml Cooking Oil in a pan; add Mustard Seeds, Cumin Seeds, and Curry Leaves until fragrant.', durationMinutes: 3, ingredientsUsed: ['Cooking Oil', 'Mustard Seeds', 'Cumin Seeds', 'Curry Leaves'] },
      { step: 4, text: 'Pour tempering into cooked tomato dal, add 10 g Salt, simmer 2 minutes, and serve warm.', durationMinutes: 2, ingredientsUsed: ['Salt'] }
    ],
    nutrition: { calories: 220, protein: 13, carbs: 34, fat: 4 }
  },
  {
    id: 'rec_potato_fry',
    title: 'Crispy Potato Masala Fry',
    description: 'Golden fried potato cubes tossed with mustard, cumin, curry leaves, chillies, and aromatic spices.',
    prepTime: 10,
    cookTime: 18,
    servings: 3,
    difficulty: 'Easy',
    category: 'Dinner',
    cuisine: 'South Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Comfort-Food'],
    colorGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Potato', amount: 600, unit: 'g', note: 'Peeled and diced into 1/2-inch cubes' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'For tempering and roasting' },
      { name: 'Salt', amount: 8, unit: 'g', note: 'Adjust to taste' },
      { name: 'Red Chilli Powder', amount: 5, unit: 'g', note: 'For fiery warmth' },
      { name: 'Turmeric Powder', amount: 3, unit: 'g', note: 'For vibrant golden color' },
      { name: 'Mustard Seeds', amount: 3, unit: 'g', note: 'For tempering' },
      { name: 'Cumin Seeds', amount: 3, unit: 'g', note: 'For earthy aroma' },
      { name: 'Onion', amount: 100, unit: 'g', note: 'Finely sliced' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit lengthwise' },
      { name: 'Curry Leaves', amount: 5, unit: 'g', note: 'Fresh sprig' }
    ],
    instructions: [
      { step: 1, text: 'Wash, peel, and cut 600 g Potatoes into uniform 1/2-inch cubes.', durationMinutes: 10, ingredientsUsed: ['Potato'] },
      { step: 2, text: 'Heat 30 ml Cooking Oil in a wide pan over medium heat. Add 3 g Mustard Seeds, 3 g Cumin Seeds, and 5 g Curry Leaves until they splutter.', durationMinutes: 3, ingredientsUsed: ['Cooking Oil', 'Mustard Seeds', 'Cumin Seeds', 'Curry Leaves'] },
      { step: 3, text: 'Add 100 g sliced Onion and 10 g Green Chillies; sauté for 3 minutes until soft.', durationMinutes: 3, ingredientsUsed: ['Onion', 'Green Chillies'] },
      { step: 4, text: 'Add diced Potatoes, 8 g Salt, 3 g Turmeric Powder, and 5 g Red Chilli Powder. Toss thoroughly.', durationMinutes: 2, ingredientsUsed: ['Potato', 'Salt', 'Turmeric Powder', 'Red Chilli Powder'] },
      { step: 5, text: 'Cover pan and cook on medium-low flame for 10 minutes, stirring occasionally until potatoes are tender inside.', durationMinutes: 10, ingredientsUsed: ['Potato'] },
      { step: 6, text: 'Remove lid, roast on medium heat for 3 minutes until edges become crisp and golden brown.', durationMinutes: 3, ingredientsUsed: [] }
    ],
    nutrition: { calories: 280, protein: 4, carbs: 38, fat: 12 }
  },
  {
    id: 'rec_4',
    title: 'Comforting Rice & Potato Masala Fry',
    description: 'A complete comfort meal pairing fragrant fluffy rice with golden spiced potato masala fry.',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Easy',
    category: 'Dinner',
    cuisine: 'Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Comfort-Food'],
    colorGradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Rice', amount: 500, unit: 'g', note: 'Basmati rice for boiling' },
      { name: 'Potato', amount: 600, unit: 'g', note: 'Diced for frying' },
      { name: 'Water', amount: 1, unit: 'L', note: 'For rice boiling' },
      { name: 'Cooking Oil', amount: 40, unit: 'ml', note: 'For frying and tempering' },
      { name: 'Salt', amount: 13, unit: 'g', note: 'Divided between rice and fry' },
      { name: 'Red Chilli Powder', amount: 5, unit: 'g', note: 'Seasoning for potatoes' },
      { name: 'Turmeric Powder', amount: 3, unit: 'g', note: 'Golden spice color' },
      { name: 'Mustard Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Cumin Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Onion', amount: 100, unit: 'g', note: 'Sliced' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Fresh slit chillies' },
      { name: 'Curry Leaves', amount: 5, unit: 'g', note: 'Fresh leaves' }
    ],
    instructions: [
      { step: 1, text: 'Boil 500 g Rice in 1 L Water with 5 g Salt and 10 ml Cooking Oil until fluffy.', durationMinutes: 15, ingredientsUsed: ['Rice', 'Water', 'Salt', 'Cooking Oil'] },
      { step: 2, text: 'Dice 600 g Potatoes, slice 100 g Onion and 10 g Green Chillies.', durationMinutes: 5, ingredientsUsed: ['Potato', 'Onion', 'Green Chillies'] },
      { step: 3, text: 'Heat 30 ml Cooking Oil in a pan, add Mustard Seeds, Cumin Seeds, Curry Leaves, Onions, and Green Chillies.', durationMinutes: 4, ingredientsUsed: ['Cooking Oil', 'Mustard Seeds', 'Cumin Seeds', 'Curry Leaves', 'Onion', 'Green Chillies'] },
      { step: 4, text: 'Add Potatoes, 8 g Salt, Turmeric Powder, and Red Chilli Powder. Cook until golden crispy.', durationMinutes: 12, ingredientsUsed: ['Potato', 'Salt', 'Turmeric Powder', 'Red Chilli Powder'] },
      { step: 5, text: 'Plate steaming rice alongside crispy spiced potato fry and serve immediately.', durationMinutes: 2, ingredientsUsed: [] }
    ],
    nutrition: { calories: 480, protein: 9, carbs: 85, fat: 13 }
  },
  {
    id: 'rec_5',
    title: 'Restaurant Style Chicken Curry',
    description: 'Tender chicken simmered in an onion-tomato gravy with ginger garlic paste, green chillies, and garish spices.',
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
      { name: 'Chicken', amount: 1, unit: 'kg', note: 'Curry cut pieces' },
      { name: 'Onion', amount: 300, unit: 'g', note: 'Finely chopped' },
      { name: 'Tomato', amount: 200, unit: 'g', note: 'Pureed or chopped' },
      { name: 'Cooking Oil', amount: 45, unit: 'ml', note: '3 tbsp for sautéing' },
      { name: 'Ginger Garlic Paste', amount: 30, unit: 'g', note: 'Freshly ground' },
      { name: 'Salt', amount: 12, unit: 'g', note: 'Seasoning to taste' },
      { name: 'Red Chilli Powder', amount: 10, unit: 'g', note: 'Kashmiri or spicy red chilli' },
      { name: 'Turmeric Powder', amount: 5, unit: 'g', note: 'Color & anti-inflammatory' },
      { name: 'Garam Masala', amount: 5, unit: 'g', note: 'Finishing spice' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit chillies' },
      { name: 'Water', amount: 400, unit: 'ml', note: 'For gravy simmer' }
    ],
    instructions: [
      { step: 1, text: 'Clean 1 kg Chicken and marinate with 15 g Ginger Garlic Paste, 3 g Salt, and 2 g Turmeric Powder for 15 minutes.', durationMinutes: 15, ingredientsUsed: ['Chicken', 'Ginger Garlic Paste', 'Salt', 'Turmeric Powder'] },
      { step: 2, text: 'Heat 45 ml Cooking Oil in a heavy pot, add 300 g Onions and 10 g Green Chillies; sauté until golden brown.', durationMinutes: 8, ingredientsUsed: ['Cooking Oil', 'Onion', 'Green Chillies'] },
      { step: 3, text: 'Add remaining Ginger Garlic Paste and cook for 2 minutes until fragrant.', durationMinutes: 2, ingredientsUsed: ['Ginger Garlic Paste'] },
      { step: 4, text: 'Add 200 g Tomatoes, 9 g Salt, 10 g Red Chilli Powder, and 3 g Turmeric; cook until oil separates.', durationMinutes: 7, ingredientsUsed: ['Tomato', 'Salt', 'Red Chilli Powder', 'Turmeric Powder'] },
      { step: 5, text: 'Add marinated Chicken pieces and sear on high heat for 5 minutes.', durationMinutes: 5, ingredientsUsed: ['Chicken'] },
      { step: 6, text: 'Pour in 400 ml Water, cover tightly, and simmer on medium-low for 15 minutes until chicken is tender.', durationMinutes: 15, ingredientsUsed: ['Water'] },
      { step: 7, text: 'Stir in 5 g Garam Masala, simmer 2 minutes, and garnish.', durationMinutes: 2, ingredientsUsed: ['Garam Masala'] }
    ],
    nutrition: { calories: 420, protein: 42, carbs: 12, fat: 24 }
  },
  {
    id: 'rec_6',
    title: 'Paneer Butter Masala',
    description: 'Succulent paneer cubes simmered in a velvety tomato, cashew, and yogurt butter gravy.',
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
      { name: 'Fresh Paneer', amount: 400, unit: 'g', note: 'Cubed into 1-inch pieces' },
      { name: 'Tomato', amount: 400, unit: 'g', note: 'Pureed' },
      { name: 'Raw Cashews', amount: 50, unit: 'g', note: 'Soaked for creaminess' },
      { name: 'Greek Yogurt', amount: 50, unit: 'g', note: 'Whisked yogurt' },
      { name: 'Butter', amount: 30, unit: 'g', note: 'Rich butter for pan' },
      { name: 'Ginger Garlic Paste', amount: 20, unit: 'g', note: 'Fresh aromatic paste' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'To taste' },
      { name: 'Red Chilli Powder', amount: 8, unit: 'g', note: 'Kashmiri chilli' },
      { name: 'Garam Masala', amount: 4, unit: 'g', note: 'Spice seasoning' },
      { name: 'Water', amount: 200, unit: 'ml', note: 'Gravy adjustment' }
    ],
    instructions: [
      { step: 1, text: 'Blend 400 g Tomatoes and 50 g soaked Raw Cashews into a smooth silky paste.', durationMinutes: 5, ingredientsUsed: ['Tomato', 'Raw Cashews'] },
      { step: 2, text: 'Melt 30 g Butter in a pan, add 20 g Ginger Garlic Paste and sauté for 1 minute.', durationMinutes: 2, ingredientsUsed: ['Butter', 'Ginger Garlic Paste'] },
      { step: 3, text: 'Add tomato cashew puree, 10 g Salt, 8 g Red Chilli Powder, and 200 ml Water; simmer for 8 minutes.', durationMinutes: 8, ingredientsUsed: ['Tomato', 'Raw Cashews', 'Salt', 'Red Chilli Powder', 'Water'] },
      { step: 4, text: 'Whisk in 50 g Greek Yogurt and 4 g Garam Masala until glossy.', durationMinutes: 3, ingredientsUsed: ['Greek Yogurt', 'Garam Masala'] },
      { step: 5, text: 'Gently add 400 g Fresh Paneer cubes and simmer on low heat for 4 minutes before serving.', durationMinutes: 4, ingredientsUsed: ['Fresh Paneer'] }
    ],
    nutrition: { calories: 450, protein: 22, carbs: 24, fat: 30 }
  },
  {
    id: 'rec_dal_tadka',
    title: 'Yellow Dal Tadka',
    description: 'Golden yellow pigeon pea lentil soup tempered with cumin, mustard seeds, garlic, and curry leaves.',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Lunch',
    cuisine: 'Indian',
    dietaryTags: ['Vegetarian', 'High-Protein', 'Gluten-Free'],
    colorGradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Toor Dal', amount: 250, unit: 'g', note: 'Rinsed yellow split lentils' },
      { name: 'Water', amount: 1, unit: 'L', note: 'For boiling lentils' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'For tempering' },
      { name: 'Onion', amount: 100, unit: 'g', note: 'Chopped' },
      { name: 'Tomato', amount: 100, unit: 'g', note: 'Diced' },
      { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Tempering aromatic' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit' },
      { name: 'Salt', amount: 8, unit: 'g', note: 'Seasoning' },
      { name: 'Turmeric Powder', amount: 4, unit: 'g', note: 'Golden color' },
      { name: 'Red Chilli Powder', amount: 4, unit: 'g', note: 'Flavoring' },
      { name: 'Mustard Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Cumin Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Curry Leaves', amount: 5, unit: 'g', note: 'Fresh sprig' }
    ],
    instructions: [
      { step: 1, text: 'Pressure cook 250 g Toor Dal with 1 L Water, 4 g Turmeric Powder, and 4 g Salt for 4 whistles until soft.', durationMinutes: 15, ingredientsUsed: ['Toor Dal', 'Water', 'Turmeric Powder', 'Salt'] },
      { step: 2, text: 'Heat 30 ml Cooking Oil in a pan. Add Mustard Seeds, Cumin Seeds, and Curry Leaves until they pop.', durationMinutes: 3, ingredientsUsed: ['Cooking Oil', 'Mustard Seeds', 'Cumin Seeds', 'Curry Leaves'] },
      { step: 3, text: 'Add 100 g Onion, Green Chillies, and Ginger Garlic Paste; sauté until translucent.', durationMinutes: 4, ingredientsUsed: ['Onion', 'Green Chillies', 'Ginger Garlic Paste'] },
      { step: 4, text: 'Add 100 g Tomato, remaining 4 g Salt, and Red Chilli Powder; cook until soft.', durationMinutes: 3, ingredientsUsed: ['Tomato', 'Salt', 'Red Chilli Powder'] },
      { step: 5, text: 'Pour cooked Dal into tempering pan, mix well, simmer 2 minutes, and serve.', durationMinutes: 2, ingredientsUsed: ['Toor Dal'] }
    ],
    nutrition: { calories: 230, protein: 14, carbs: 36, fat: 5 }
  },
  {
    id: 'rec_veg_curry',
    title: 'Homestyle Mixed Vegetable Curry',
    description: 'Seasonal mixed vegetables cooked in a spiced onion-tomato curry base.',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Dinner',
    cuisine: 'Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'High-Fiber'],
    colorGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Mixed Vegetables', amount: 500, unit: 'g', note: 'Carrot, peas, beans, potato' },
      { name: 'Onion', amount: 150, unit: 'g', note: 'Finely chopped' },
      { name: 'Tomato', amount: 150, unit: 'g', note: 'Chopped' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'Sautéing oil' },
      { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Aromatic base' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'Seasoning' },
      { name: 'Red Chilli Powder', amount: 6, unit: 'g', note: 'Spice powder' },
      { name: 'Turmeric Powder', amount: 3, unit: 'g', note: 'Golden spice' },
      { name: 'Garam Masala', amount: 4, unit: 'g', note: 'Finishing spice' },
      { name: 'Water', amount: 300, unit: 'ml', note: 'Curry liquid' }
    ],
    instructions: [
      { step: 1, text: 'Dice 500 g Mixed Vegetables into bite-sized pieces.', durationMinutes: 8, ingredientsUsed: ['Mixed Vegetables'] },
      { step: 2, text: 'Heat 30 ml Cooking Oil, sauté 150 g Onion and 15 g Ginger Garlic Paste until light brown.', durationMinutes: 4, ingredientsUsed: ['Cooking Oil', 'Onion', 'Ginger Garlic Paste'] },
      { step: 3, text: 'Add 150 g Tomato, 10 g Salt, 6 g Red Chilli Powder, and 3 g Turmeric; cook for 4 minutes.', durationMinutes: 4, ingredientsUsed: ['Tomato', 'Salt', 'Red Chilli Powder', 'Turmeric Powder'] },
      { step: 4, text: 'Add Mixed Vegetables and 300 ml Water; cover and cook on medium flame for 12 minutes.', durationMinutes: 12, ingredientsUsed: ['Mixed Vegetables', 'Water'] },
      { step: 5, text: 'Stir in 4 g Garam Masala and simmer 2 minutes before serving.', durationMinutes: 2, ingredientsUsed: ['Garam Masala'] }
    ],
    nutrition: { calories: 210, protein: 6, carbs: 28, fat: 8 }
  },
  {
    id: 'rec_1',
    title: 'Dragon Fruit & Berry Smoothie Bowl',
    description: 'Vibrant, antioxidant-packed smoothie bowl garnished with raw cashews and honey.',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: 'Easy',
    category: 'Breakfast',
    cuisine: 'Modern Fusion',
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'High-Antioxidant'],
    colorGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Dragon Fruit', amount: 1, unit: 'pcs', note: 'Fresh dragon fruit' },
      { name: 'Greek Yogurt', amount: 150, unit: 'g', note: 'Chilled yogurt' },
      { name: 'Raw Cashews', amount: 30, unit: 'g', note: 'For topping' }
    ],
    instructions: [
      { step: 1, text: 'Dice fresh Dragon Fruit into uniform cubes, set half aside for topping.', durationMinutes: 3, ingredientsUsed: ['Dragon Fruit'] },
      { step: 2, text: 'Blend remaining Dragon Fruit with 150 g Greek Yogurt until smooth.', durationMinutes: 3, ingredientsUsed: ['Dragon Fruit', 'Greek Yogurt'] },
      { step: 3, text: 'Pour into chilled bowl and garnish with 30 g Raw Cashews.', durationMinutes: 2, ingredientsUsed: ['Raw Cashews'] }
    ],
    nutrition: { calories: 310, protein: 12, carbs: 42, fat: 11 }
  },
  {
    id: 'rec_2',
    title: 'Pan-Seared Paneer & Avocado Bowl',
    description: 'Crispy golden paneer cubes served over warm seasoned grain with Hass avocado slices.',
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
      { name: 'Fresh Paneer', amount: 200, unit: 'g', note: 'Cubed paneer' },
      { name: 'Hass Avocado', amount: 1, unit: 'pcs', note: 'Sliced' },
      { name: 'Cherry Tomatoes', amount: 100, unit: 'g', note: 'Halved' },
      { name: 'Cooking Oil', amount: 15, unit: 'ml', note: 'For searing' },
      { name: 'Salt', amount: 4, unit: 'g', note: 'Seasoning' },
      { name: 'Red Chilli Powder', amount: 3, unit: 'g', note: 'Seasoning' }
    ],
    instructions: [
      { step: 1, text: 'Cut Paneer into cubes, toss with 4 g Salt and 3 g Red Chilli Powder.', durationMinutes: 3, ingredientsUsed: ['Fresh Paneer', 'Salt', 'Red Chilli Powder'] },
      { step: 2, text: 'Heat 15 ml Cooking Oil in a pan, sear Paneer cubes until golden brown.', durationMinutes: 5, ingredientsUsed: ['Cooking Oil', 'Fresh Paneer'] },
      { step: 3, text: 'Slice Avocado, halve Cherry Tomatoes, and assemble in bowl with warm paneer.', durationMinutes: 2, ingredientsUsed: ['Hass Avocado', 'Cherry Tomatoes'] }
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
      { name: 'Finger Millet (Ragi)', amount: 100, unit: 'g', note: 'Fine ragi flour' },
      { name: 'Raw Cashews', amount: 50, unit: 'g', note: 'Soaked for cream' },
      { name: 'Water', amount: 500, unit: 'ml', note: 'For whisking' },
      { name: 'Salt', amount: 2, unit: 'g', note: 'Pinch of salt' }
    ],
    instructions: [
      { step: 1, text: 'Soak 50 g Raw Cashews and blend into smooth paste with 100 ml Water.', durationMinutes: 5, ingredientsUsed: ['Raw Cashews', 'Water'] },
      { step: 2, text: 'Whisk 100 g Ragi flour in remaining 400 ml Water with 2 g Salt; simmer until thickened.', durationMinutes: 8, ingredientsUsed: ['Finger Millet (Ragi)', 'Water', 'Salt'] },
      { step: 3, text: 'Stir in cashew cream and serve warm.', durationMinutes: 2, ingredientsUsed: ['Raw Cashews'] }
    ],
    nutrition: { calories: 360, protein: 11, carbs: 54, fat: 12 }
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
