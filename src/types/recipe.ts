export type RecipeCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert' | 'Beverage';

export type RecipeDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface RecipeIngredientItem {
  name: string;
  amount: number;
  unit: string;
  optional?: boolean;
}

export interface RecipeInstructionStep {
  step: number;
  text: string;
  durationMinutes?: number;
  tip?: string;
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
  cuisine: string;
  dietaryTags: string[]; // e.g. ['Vegetarian', 'Gluten-Free', 'Keto', 'High-Protein']
  ingredients: RecipeIngredientItem[];
  instructions: RecipeInstructionStep[];
  nutrition: RecipeNutrition;
  colorGradient?: string;
  createdAt: string;
}
