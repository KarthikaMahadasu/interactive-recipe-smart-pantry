import type { SmartGroceryItem, GroceryPriority, GrocerySource } from '../types/groceryTypes';
import type { Ingredient } from '../../../types/ingredient';
import type { Recipe } from '../../../types/recipe';
import { getInventoryStatus } from '../../inventory/utils/inventoryUtils';
import { RecipeMatchingService } from '../../../services/recipes/recipeMatchingService';

const DEFAULT_GROCERY_KEY = 'smart_grocery_items_v1';

function getGroceryStorageKey(restaurantId?: string | null): string {
  if (restaurantId) {
    return `restaurant_${restaurantId}_grocery_v1`;
  }
  return DEFAULT_GROCERY_KEY;
}

export class GroceryService {
  /**
   * Load grocery items for a restaurant workspace.
   */
  static loadGrocery(restaurantId?: string | null): SmartGroceryItem[] {
    const key = getGroceryStorageKey(restaurantId);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn(`Failed to parse grocery items for key ${key}`, e);
    }
    return [
      {
        id: 'g_init_1',
        restaurantId: restaurantId || 'rest_spice_garden',
        name: 'Cherry Tomatoes',
        quantity: 5,
        unit: 'kg',
        reason: 'Low Stock Threshold',
        priority: 'MEDIUM',
        source: 'LOW_STOCK',
        status: 'NEEDED',
        category: 'Produce',
        createdAt: new Date().toISOString()
      },
      {
        id: 'g_init_2',
        restaurantId: restaurantId || 'rest_spice_garden',
        name: 'Extra Virgin Olive Oil',
        quantity: 2,
        unit: 'L',
        reason: 'Out of Stock',
        priority: 'HIGH',
        source: 'OUT_OF_STOCK',
        status: 'NEEDED',
        category: 'Pantry',
        createdAt: new Date().toISOString()
      }
    ];
  }

  /**
   * Save grocery items for a restaurant workspace.
   */
  static saveGrocery(restaurantId: string | null | undefined, list: SmartGroceryItem[]): void {
    const key = getGroceryStorageKey(restaurantId);
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      console.warn(`Failed to save grocery items for key ${key}`, e);
    }
  }

  /**
   * Generates grocery recommendations based on inventory low/out-of-stock items.
   */
  static generateFromInventory(
    pantry: Ingredient[],
    currentGrocery: SmartGroceryItem[],
    restaurantId?: string
  ): SmartGroceryItem[] {
    const newItems: SmartGroceryItem[] = [];

    pantry.forEach((item) => {
      const status = getInventoryStatus(item);
      const alreadyExists = currentGrocery.some(
        (g) => g.status !== 'RECEIVED' && g.name.toLowerCase() === item.name.toLowerCase()
      );

      if (!alreadyExists && (status === 'low_stock' || status === 'out_of_stock' || status === 'expiring_soon')) {
        let priority: GroceryPriority = 'MEDIUM';
        let reason = 'Low Stock Threshold';
        let source: GrocerySource = 'LOW_STOCK';
        let suggestQty = Math.max(2, item.quantity > 0 ? item.quantity * 2 : 5);

        if (status === 'out_of_stock') {
          priority = 'HIGH';
          reason = 'Out of Stock';
          source = 'OUT_OF_STOCK';
          suggestQty = 10;
        } else if (status === 'expiring_soon') {
          priority = 'LOW';
          reason = 'Expiring Soon - Replacement Restock';
          source = 'LOW_STOCK';
        }

        newItems.push({
          id: `g_auto_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          restaurantId,
          name: item.name,
          quantity: suggestQty,
          unit: item.unit,
          reason,
          priority,
          source,
          status: 'NEEDED',
          category: item.category,
          createdAt: new Date().toISOString()
        });
      }
    });

    return newItems;
  }

  /**
   * Generates grocery requirements from a single selected recipe missing ingredients.
   */
  static generateFromRecipe(
    recipe: Recipe,
    pantry: Ingredient[],
    currentGrocery: SmartGroceryItem[],
    restaurantId?: string
  ): SmartGroceryItem[] {
    const match = RecipeMatchingService.matchRecipe(recipe, pantry);
    const newItems: SmartGroceryItem[] = [];

    match.missingIngredients.forEach((missing) => {
      const alreadyExists = currentGrocery.some(
        (g) => g.status !== 'RECEIVED' && g.name.toLowerCase() === missing.recipeIngredient.name.toLowerCase()
      );

      if (!alreadyExists) {
        const reqQty = missing.recipeIngredient.amount;
        const availableQty = missing.pantryItem ? missing.pantryItem.quantity : 0;
        const missingQty = Math.max(1, reqQty - availableQty);

        newItems.push({
          id: `g_recipe_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          restaurantId,
          name: missing.recipeIngredient.name,
          quantity: missingQty,
          unit: missing.recipeIngredient.unit,
          reason: `Required for "${recipe.title}"`,
          priority: 'HIGH',
          source: 'RECIPE_MISSING',
          sourceReferenceId: recipe.id,
          status: 'NEEDED',
          category: 'Produce',
          createdAt: new Date().toISOString()
        });
      }
    });

    return newItems;
  }

  /**
   * Calculates combined grocery requirements from multiple recipes, merging duplicate ingredients when units match.
   */
  static generateFromMultipleRecipes(
    recipes: Recipe[],
    pantry: Ingredient[],
    currentGrocery: SmartGroceryItem[],
    restaurantId?: string
  ): SmartGroceryItem[] {
    const combinedRequirements: Record<string, { amount: number; unit: string; recipeTitles: string[] }> = {};

    recipes.forEach((recipe) => {
      const match = RecipeMatchingService.matchRecipe(recipe, pantry);
      match.missingIngredients.forEach((missing) => {
        const key = `${missing.recipeIngredient.name.toLowerCase()}_${missing.recipeIngredient.unit.toLowerCase()}`;
        if (!combinedRequirements[key]) {
          combinedRequirements[key] = {
            amount: 0,
            unit: missing.recipeIngredient.unit,
            recipeTitles: []
          };
        }

        const reqQty = missing.recipeIngredient.amount;
        const availableQty = missing.pantryItem ? missing.pantryItem.quantity : 0;
        const missingQty = Math.max(1, reqQty - availableQty);

        combinedRequirements[key].amount += missingQty;
        if (!combinedRequirements[key].recipeTitles.includes(recipe.title)) {
          combinedRequirements[key].recipeTitles.push(recipe.title);
        }
      });
    });

    const newItems: SmartGroceryItem[] = [];

    Object.entries(combinedRequirements).forEach(([key, data]) => {
      const namePart = key.split('_')[0];
      const nameFormatted = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      const alreadyExists = currentGrocery.some(
        (g) => g.status !== 'RECEIVED' && g.name.toLowerCase() === namePart
      );

      if (!alreadyExists) {
        newItems.push({
          id: `g_multi_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          restaurantId,
          name: nameFormatted,
          quantity: Math.round(data.amount * 100) / 100,
          unit: data.unit,
          reason: `Required for recipes: ${data.recipeTitles.join(', ')}`,
          priority: 'HIGH',
          source: 'RECIPE_MISSING',
          status: 'NEEDED',
          category: 'Produce',
          createdAt: new Date().toISOString()
        });
      }
    });

    return newItems;
  }
}
