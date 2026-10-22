export type RecipeCategory =
  | 'Breakfast'
  | 'Lunch'
  | 'Dinner'
  | 'Snack'
  | 'Dessert'
  | 'Beverage'
  | 'Curries & Gravies'
  | 'Rice Dishes'
  | 'Cakes & Baking'
  | 'Pastries'
  | 'Chocolate & Confectionery'
  | 'Cookies & Brownies'
  | 'Puddings & Chilled Desserts'
  | 'Pasta & Noodles';

export type CookingCategoryType =
  | 'curry'
  | 'rice'
  | 'cake'
  | 'pastry'
  | 'chocolate'
  | 'brownie'
  | 'cupcake'
  | 'cookie'
  | 'chilled_dessert'
  | 'pasta'
  | 'breakfast'
  | 'snack'
  | 'beverage'
  | 'general';

export type RecipeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface RecipeIngredientItem {
  name: string;
  amount: number;
  unit: string;
  optional?: boolean;
  note?: string;
  preparationNote?: string;
}

export interface RecipeInstructionStep {
  step: number;
  text: string;
  durationMinutes?: number;
  ingredientsUsed?: string[];
  tip?: string;
  temperature?: string;
  equipmentRequired?: string[];
}

export interface RecipeNutrition {
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: RecipeDifficulty;
  category: RecipeCategory;
  cookingCategory?: CookingCategoryType;
  cuisine: string;
  dietaryTags: string[]; // e.g. ['Vegetarian', 'Gluten-Free', 'Eggless', 'No-Oven', 'High-Protein']
  equipment?: string[];
  temperature?: string; // e.g. "175°C (350°F)" or "Stovetop Medium Flame"
  storageGuidance?: string;
  safetyNotes?: string;
  ingredients: RecipeIngredientItem[];
  instructions: RecipeInstructionStep[];
  nutrition: RecipeNutrition;
  colorGradient?: string;
  createdAt?: string;
}

