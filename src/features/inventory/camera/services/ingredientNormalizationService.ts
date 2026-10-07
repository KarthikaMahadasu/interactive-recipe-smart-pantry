import type { Ingredient, IngredientCategory } from '../../../../types/ingredient';

/**
 * Standard ingredient mappings for name normalization.
 * Maps variations to canonical ingredient names while preserving distinct products.
 */
const CANONICAL_MAPPINGS: Record<string, { name: string; category: IngredientCategory; unit: string }> = {
  // Dairy & Alternatives
  'milk': { name: 'Milk', category: 'dairy', unit: 'L' },
  'whole milk': { name: 'Milk', category: 'dairy', unit: 'L' },
  'full cream milk': { name: 'Milk', category: 'dairy', unit: 'L' },
  'toned milk': { name: 'Milk', category: 'dairy', unit: 'L' },
  'fresh milk': { name: 'Milk', category: 'dairy', unit: 'L' },
  'milk powder': { name: 'Milk Powder', category: 'dairy', unit: 'g' },
  'condensed milk': { name: 'Condensed Milk', category: 'dairy', unit: 'g' },
  'tofu': { name: 'Organic Tofu', category: 'dairy', unit: 'g' },
  'organic tofu': { name: 'Organic Tofu', category: 'dairy', unit: 'g' },
  'paneer': { name: 'Fresh Paneer', category: 'dairy', unit: 'g' },
  'fresh paneer': { name: 'Fresh Paneer', category: 'dairy', unit: 'g' },
  'cottage cheese': { name: 'Fresh Paneer', category: 'dairy', unit: 'g' },
  'yogurt': { name: 'Greek Yogurt', category: 'dairy', unit: 'g' },
  'greek yogurt': { name: 'Greek Yogurt', category: 'dairy', unit: 'g' },
  'curd': { name: 'Greek Yogurt', category: 'dairy', unit: 'g' },
  'cream': { name: 'Heavy Cream', category: 'dairy', unit: 'ml' },
  'heavy cream': { name: 'Heavy Cream', category: 'dairy', unit: 'ml' },
  'butter': { name: 'Unsalted Butter', category: 'dairy', unit: 'g' },
  'cheese': { name: 'Cheddar Cheese', category: 'dairy', unit: 'g' },

  // Grains & Flours
  'rice': { name: 'Rice', category: 'grain', unit: 'kg' },
  'basmati rice': { name: 'Rice', category: 'grain', unit: 'kg' },
  'white rice': { name: 'Rice', category: 'grain', unit: 'kg' },
  'brown rice': { name: 'Rice', category: 'grain', unit: 'kg' },
  'rice flour': { name: 'Rice Flour', category: 'grain', unit: 'kg' },
  'wheat': { name: 'Whole Wheat Flour', category: 'grain', unit: 'kg' },
  'wheat flour': { name: 'Whole Wheat Flour', category: 'grain', unit: 'kg' },
  'whole wheat flour': { name: 'Whole Wheat Flour', category: 'grain', unit: 'kg' },
  'flour': { name: 'Whole Wheat Flour', category: 'grain', unit: 'kg' },
  'millet': { name: 'Finger Millet (Ragi)', category: 'grain', unit: 'g' },
  'ragi': { name: 'Finger Millet (Ragi)', category: 'grain', unit: 'g' },
  'finger millet (ragi)': { name: 'Finger Millet (Ragi)', category: 'grain', unit: 'g' },
  'bread': { name: 'Whole Wheat Bread', category: 'bakery', unit: 'pcs' },

  // Produce
  'tomato': { name: 'Tomato', category: 'produce', unit: 'kg' },
  'tomatoes': { name: 'Tomato', category: 'produce', unit: 'kg' },
  'cherry tomatoes': { name: 'Cherry Tomatoes', category: 'produce', unit: 'g' },
  'tomato sauce': { name: 'Tomato Sauce', category: 'canned', unit: 'g' },
  'potato': { name: 'Potato', category: 'produce', unit: 'kg' },
  'potatoes': { name: 'Potato', category: 'produce', unit: 'kg' },
  'onion': { name: 'Onion', category: 'produce', unit: 'kg' },
  'onions': { name: 'Onion', category: 'produce', unit: 'kg' },
  'carrot': { name: 'Carrot', category: 'produce', unit: 'kg' },
  'carrots': { name: 'Carrot', category: 'produce', unit: 'kg' },
  'avocado': { name: 'Hass Avocado', category: 'produce', unit: 'pcs' },
  'hass avocado': { name: 'Hass Avocado', category: 'produce', unit: 'pcs' },
  'dragon fruit': { name: 'Dragon Fruit', category: 'produce', unit: 'pcs' },

  // Proteins & Meats
  'chicken': { name: 'Chicken', category: 'meat', unit: 'kg' },
  'fresh chicken': { name: 'Chicken', category: 'meat', unit: 'kg' },
  'chicken breast': { name: 'Fresh Chicken Breast', category: 'meat', unit: 'kg' },
  'fresh chicken breast': { name: 'Fresh Chicken Breast', category: 'meat', unit: 'kg' },
  'chicken curry': { name: 'Chicken Curry Dish', category: 'meat', unit: 'pcs' },
  'egg': { name: 'Eggs', category: 'dairy', unit: 'pcs' },
  'eggs': { name: 'Eggs', category: 'dairy', unit: 'pcs' },

  // Pantry Oils & Spices
  'olive oil': { name: 'Extra Virgin Olive Oil', category: 'liquid', unit: 'L' },
  'extra virgin olive oil': { name: 'Extra Virgin Olive Oil', category: 'liquid', unit: 'L' },
  'cooking oil': { name: 'Cooking Oil', category: 'liquid', unit: 'L' },
  'oil': { name: 'Cooking Oil', category: 'liquid', unit: 'L' },
  'cashews': { name: 'Raw Cashews', category: 'other', unit: 'g' },
  'raw cashews': { name: 'Raw Cashews', category: 'other', unit: 'g' },
  'salt': { name: 'Sea Salt', category: 'spice', unit: 'g' },
  'sugar': { name: 'Cane Sugar', category: 'spice', unit: 'kg' }
};

export class IngredientNormalizationService {
  /**
   * Normalizes a raw string input into a canonical ingredient name, category, and default unit.
   */
  static normalize(rawName: string): { name: string; category: IngredientCategory; unit: string } {
    if (!rawName || !rawName.trim()) {
      return { name: 'Stock Item', category: 'other', unit: 'pcs' };
    }

    const cleaned = rawName.trim().toLowerCase();

    // Direct lookup in canonical map
    if (CANONICAL_MAPPINGS[cleaned]) {
      return CANONICAL_MAPPINGS[cleaned];
    }

    // Check partial exact phrase match (e.g. "whole milk carton" -> "Milk")
    for (const [key, mapping] of Object.entries(CANONICAL_MAPPINGS)) {
      if (cleaned === key) return mapping;
    }

    // Capitalize first letter of each word if no canonical map hit
    const formattedName = rawName
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return {
      name: formattedName,
      category: 'produce',
      unit: 'kg'
    };
  }

  /**
   * Searches for a matching ingredient in active restaurant inventory.
   * Matches case-insensitively and intelligently avoids duplicate logical items.
   */
  static findInInventory(normalizedName: string, pantry: Ingredient[]): Ingredient | undefined {
    if (!normalizedName || !pantry.length) return undefined;
    const lowerTarget = normalizedName.trim().toLowerCase();

    // 1. Exact match case-insensitive
    const exactMatch = pantry.find((p) => p.name.trim().toLowerCase() === lowerTarget);
    if (exactMatch) return exactMatch;

    // 2. Canonical alias match (e.g., target "Whole Milk" matching pantry "Milk" or vice versa)
    const targetNormalized = this.normalize(normalizedName).name.toLowerCase();
    const aliasMatch = pantry.find((p) => {
      const pNorm = this.normalize(p.name).name.toLowerCase();
      return pNorm === targetNormalized;
    });
    if (aliasMatch) return aliasMatch;

    // 3. Substring match for non-conflicting distinct products
    // Note: Do NOT match Milk to Milk Powder or Rice to Rice Flour
    return pantry.find((p) => {
      const pLower = p.name.toLowerCase();
      if (pLower === lowerTarget) return true;
      if (lowerTarget.includes(pLower) && !this.isDistinctProductMismatch(lowerTarget, pLower)) {
        return true;
      }
      if (pLower.includes(lowerTarget) && !this.isDistinctProductMismatch(pLower, lowerTarget)) {
        return true;
      }
      return false;
    });
  }

  /**
   * Checks whether two names represent distinct products that must NOT be merged
   * (e.g. Milk vs Milk Powder, Rice vs Rice Flour, Paneer vs Tofu).
   */
  private static isDistinctProductMismatch(nameA: string, nameB: string): boolean {
    const distinctSuffixes = ['powder', 'flour', 'sauce', 'curry', 'condensed', 'butter', 'oil'];
    for (const suffix of distinctSuffixes) {
      if (nameA.includes(suffix) !== nameB.includes(suffix)) {
        return true; // One has powder/flour/sauce and the other doesn't
      }
    }

    if ((nameA.includes('paneer') && nameB.includes('tofu')) || (nameA.includes('tofu') && nameB.includes('paneer'))) {
      return true;
    }

    return false;
  }
}
