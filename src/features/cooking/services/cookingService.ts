import type { Recipe, RecipeIngredientItem } from '../../../types/recipe';
import type { Ingredient } from '../../../types/ingredient';
import { IngredientUtils } from '../../../utils/ingredientUtils';

export interface IngredientValidationResult {
  ingredient: RecipeIngredientItem;
  pantryItem?: Ingredient;
  isAvailable: boolean;
  requiredAmount: number;
  availableAmount: number;
  availableUnit: string;
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
   * Validates required recipe ingredients against current pantry state using matching and unit conversions.
   */
  static validateIngredients(recipe: Recipe, pantry: Ingredient[]): CookingValidationSummary {
    let missingCount = 0;
    let insufficientCount = 0;

    const validationDetails: IngredientValidationResult[] = recipe.ingredients.map((req) => {
      const pantryItem = pantry.find((p) => IngredientUtils.areIngredientsMatching(req.name, p.name));

      if (!pantryItem || pantryItem.quantity <= 0) {
        missingCount++;
        return {
          ingredient: req,
          pantryItem: undefined,
          isAvailable: false,
          requiredAmount: req.amount,
          availableAmount: 0,
          availableUnit: req.unit,
          unit: req.unit,
          isInsufficient: false
        };
      }

      // Convert pantry item quantity to recipe unit for comparison
      const convertedPantryQtyInRecipeUnit = IngredientUtils.convertUnit(pantryItem.quantity, pantryItem.unit, req.unit);
      const isAvailable = true;
      const isInsufficient = convertedPantryQtyInRecipeUnit < req.amount;

      if (isInsufficient) {
        insufficientCount++;
      }

      return {
        ingredient: req,
        pantryItem,
        isAvailable,
        requiredAmount: req.amount,
        availableAmount: pantryItem.quantity,
        availableUnit: pantryItem.unit,
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
  static calculateDeductions(recipe: Recipe, pantry: Ingredient[]): Array<{ id: string; name: string; deducted: number; remaining: number; unit: string }> {
    const deductions: Array<{ id: string; name: string; deducted: number; remaining: number; unit: string }> = [];

    recipe.ingredients.forEach((req) => {
      const pantryItem = pantry.find((p) => IngredientUtils.areIngredientsMatching(req.name, p.name));

      if (pantryItem) {
        const convertedReqInPantryUnit = IngredientUtils.convertUnit(req.amount, req.unit, pantryItem.unit);
        const deducted = Math.min(pantryItem.quantity, convertedReqInPantryUnit);
        const remaining = Math.max(0, Math.round((pantryItem.quantity - deducted) * 100) / 100);

        deductions.push({
          id: pantryItem.id,
          name: pantryItem.name,
          deducted: Math.round(deducted * 100) / 100,
          remaining,
          unit: pantryItem.unit
        });
      }
    });

    return deductions;
  }
}
