import type { Recipe, RecipeIngredientItem } from '../../../types/recipe';
import type { Ingredient } from '../../../types/ingredient';

export interface IngredientValidationResult {
  ingredient: RecipeIngredientItem;
  pantryItem?: Ingredient;
  isAvailable: boolean;
  requiredAmount: number;
  availableAmount: number;
  unit: string;
  isInsufficient: boolean;
}

export interface CookingValidationSummary {
  canCook: boolean;
  validationDetails: IngredientValidationResult[];
  missingCount: number;
  insufficientCount: number;
}

export class CookingService {
  /**
   * Validates required recipe ingredients against current pantry state.
   */
  static validateIngredients(recipe: Recipe, pantry: Ingredient[]): CookingValidationSummary {
    let missingCount = 0;
    let insufficientCount = 0;

    const validationDetails: IngredientValidationResult[] = recipe.ingredients.map((req) => {
      const reqNameLower = req.name.toLowerCase().trim();
      const pantryItem = pantry.find((p) => p.name.toLowerCase().trim() === reqNameLower || p.name.toLowerCase().includes(reqNameLower));

      const availableAmount = pantryItem ? pantryItem.quantity : 0;
      const isAvailable = Boolean(pantryItem && pantryItem.quantity > 0);
      const isInsufficient = isAvailable && availableAmount < req.amount;

      if (!isAvailable) missingCount++;
      if (isInsufficient) insufficientCount++;

      return {
        ingredient: req,
        pantryItem,
        isAvailable,
        requiredAmount: req.amount,
        availableAmount,
        unit: req.unit,
        isInsufficient
      };
    });

    const canCook = missingCount === 0 && insufficientCount === 0;

    return {
      canCook,
      validationDetails,
      missingCount,
      insufficientCount
    };
  }

  /**
   * Calculates exact pantry deductions without introducing negative values.
   */
  static calculateDeductions(recipe: Recipe, pantry: Ingredient[]): { id: string; name: string; deducted: number; remaining: number }[] {
    const deductions: { id: string; name: string; deducted: number; remaining: number }[] = [];

    recipe.ingredients.forEach((req) => {
      const reqNameLower = req.name.toLowerCase().trim();
      const pantryItem = pantry.find((p) => p.name.toLowerCase().trim() === reqNameLower || p.name.toLowerCase().includes(reqNameLower));

      if (pantryItem) {
        const deducted = Math.min(pantryItem.quantity, req.amount);
        const remaining = Math.max(0, pantryItem.quantity - req.amount);
        deductions.push({
          id: pantryItem.id,
          name: pantryItem.name,
          deductions: deducted,
          remaining
        } as any);
      }
    });

    return deductions;
  }
}
