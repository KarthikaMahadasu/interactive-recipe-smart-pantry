import type { Recipe, RecipeIngredientItem } from '../../types/recipe';
import type { Ingredient } from '../../types/ingredient';

export interface MatchedIngredientDetail {
  recipeIngredient: RecipeIngredientItem;
  isAvailable: boolean;
  pantryItem?: Ingredient;
  suggestedSubstitution?: string;
}

export interface RecipeMatchResult {
  recipe: Recipe;
  availableIngredients: MatchedIngredientDetail[];
  missingIngredients: MatchedIngredientDetail[];
  matchPercentage: number;
  isFullyMatch: boolean;
  canMakeWithSubstitutions: boolean;
}

// Data-driven substitution lookup table
const SUBSTITUTION_DICTIONARY: Record<string, string[]> = {
  'milk': ['soy milk', 'almond milk', 'oat milk', 'coconut milk', 'greek yogurt', 'heavy cream'],
  'paneer': ['tofu', 'ricotta', 'halloumi'],
  'tofu': ['paneer', 'tempeh'],
  'olive oil': ['vegetable oil', 'coconut oil', 'butter', 'ghee'],
  'cooking oil': ['butter', 'ghee', 'olive oil', 'coconut oil'],
  'butter': ['ghee', 'olive oil', 'coconut oil', 'cooking oil'],
  'greek yogurt': ['curd', 'sour cream', 'coconut yogurt', 'milk'],
  'rice': ['quinoa', 'millet', 'cauliflower rice'],
  'chicken': ['tofu', 'paneer', 'mushroom', 'seitan'],
  'eggs': ['greek yogurt', 'applesauce', 'banana', 'tofu', 'buttermilk'],
  'sugar': ['honey', 'maple syrup', 'jaggery', 'powdered sugar'],
  'all-purpose flour': ['whole wheat flour', 'oat flour', 'finger millet (ragi)'],
  'cocoa powder': ['dark chocolate'],
  'dark chocolate': ['cocoa powder']
};

export class RecipeMatchingService {
  /**
   * Calculates dynamic matching between pantry state and a single recipe.
   */
  static matchRecipe(recipe: Recipe, pantry: Ingredient[]): RecipeMatchResult {
    const availableIngredients: MatchedIngredientDetail[] = [];
    const missingIngredients: MatchedIngredientDetail[] = [];

    recipe.ingredients.forEach((req) => {
      const reqNameLower = req.name.toLowerCase().trim();
      
      // Match against active pantry items (name inclusion or exact match)
      const matchedPantryItem = pantry.find((p) => {
        const pNameLower = p.name.toLowerCase().trim();
        return (
          pNameLower === reqNameLower ||
          pNameLower.includes(reqNameLower) ||
          reqNameLower.includes(pNameLower)
        ) && p.quantity > 0;
      });

      if (matchedPantryItem) {
        availableIngredients.push({
          recipeIngredient: req,
          isAvailable: true,
          pantryItem: matchedPantryItem
        });
      } else {
        // Check substitution dictionary for potential alternative present in pantry
        let suggestedSub: string | undefined = undefined;
        const possibleSubs = SUBSTITUTION_DICTIONARY[reqNameLower] || [];
        for (const subName of possibleSubs) {
          const subItemInPantry = pantry.find((p) => p.name.toLowerCase().includes(subName) && p.quantity > 0);
          if (subItemInPantry) {
            suggestedSub = subItemInPantry.name;
            break;
          }
        }

        missingIngredients.push({
          recipeIngredient: req,
          isAvailable: false,
          suggestedSubstitution: suggestedSub
        });
      }
    });

    const totalRequired = recipe.ingredients.length;
    const availableCount = availableIngredients.length;
    const matchPercentage = totalRequired > 0 ? Math.round((availableCount / totalRequired) * 100) : 0;
    const isFullyMatch = availableCount === totalRequired;
    const canMakeWithSubstitutions = availableIngredients.length + missingIngredients.filter(m => m.suggestedSubstitution).length === totalRequired;

    return {
      recipe,
      availableIngredients,
      missingIngredients,
      matchPercentage,
      isFullyMatch,
      canMakeWithSubstitutions
    };
  }

  /**
   * Matches all recipes in catalog against current pantry and sorts by match percentage descending.
   */
  static matchAllRecipes(recipes: Recipe[], pantry: Ingredient[]): RecipeMatchResult[] {
    return recipes
      .map((r) => this.matchRecipe(r, pantry))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
}
