import type { Ingredient } from '../../../../types/ingredient';
import type { SmartGroceryItem } from '../../../grocery/types/groceryTypes';
import type { CameraInventoryMatch } from '../types/cameraTypes';
import { IngredientNormalizationService } from './ingredientNormalizationService';
import { getInventoryStatus } from '../../utils/inventoryUtils';

export class CameraInventoryService {
  /**
   * Cross-checks detected ingredient against active restaurant inventory and restaurant grocery list.
   */
  static checkInventoryAndGrocery(
    normalizedName: string,
    pantry: Ingredient[],
    groceryList: SmartGroceryItem[]
  ): CameraInventoryMatch {
    // 1. Search restaurant inventory
    const inventoryMatch = IngredientNormalizationService.findInInventory(normalizedName, pantry);

    // 2. Search restaurant grocery list
    const lowerTarget = normalizedName.trim().toLowerCase();
    const groceryMatch = groceryList.find(
      (g) => g.name.trim().toLowerCase() === lowerTarget || g.name.toLowerCase().includes(lowerTarget)
    );

    const existsInInventory = !!inventoryMatch && inventoryMatch.quantity > 0;
    const existsInGrocery = !!groceryMatch && groceryMatch.status !== 'CANCELLED';

    let status: CameraInventoryMatch['status'] = 'not_in_inventory';
    if (inventoryMatch) {
      const invStat = getInventoryStatus(inventoryMatch);
      if (invStat === 'out_of_stock') status = 'out_of_stock';
      else if (invStat === 'low_stock') status = 'low_stock';
      else status = 'available';
    }

    return {
      existsInInventory,
      inventoryItem: inventoryMatch,
      existsInGrocery,
      groceryItem: groceryMatch,
      status,
      groceryStatus: groceryMatch?.status
    };
  }
}
