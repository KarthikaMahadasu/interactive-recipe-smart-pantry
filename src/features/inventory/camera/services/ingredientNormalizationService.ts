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
  'unsalted butter': { name: 'Unsalted Butter', category: 'dairy', unit: 'g' },
  'cheese': { name: 'Cheddar Cheese', category: 'dairy', unit: 'g' },
  'cheddar cheese': { name: 'Cheddar Cheese', category: 'dairy', unit: 'g' },

  // Grains & Flours
  'rice': { name: 'Rice', category: 'grain', unit: 'kg' },
  'basmati rice': { name: 'Rice', category: 'grain', unit: 'kg' },
  'white rice': { name: 'Rice', category: 'grain', unit: 'kg' },
  'brown rice': { name: 'Rice', category: 'grain', unit: 'kg' },
  'jasmine rice': { name: 'Rice', category: 'grain', unit: 'kg' },
  'rice flour': { name: 'Rice Flour', category: 'grain', unit: 'kg' },
  'wheat': { name: 'Whole Wheat Flour', category: 'grain', unit: 'kg' },
  'wheat flour': { name: 'Whole Wheat Flour', category: 'grain', unit: 'kg' },
  'whole wheat flour': { name: 'Whole Wheat Flour', category: 'grain', unit: 'kg' },
  'flour': { name: 'Whole Wheat Flour', category: 'grain', unit: 'kg' },
  'all-purpose flour': { name: 'Whole Wheat Flour', category: 'grain', unit: 'kg' },
  'maida': { name: 'Whole Wheat Flour', category: 'grain', unit: 'kg' },
  'millet': { name: 'Finger Millet (Ragi)', category: 'grain', unit: 'g' },
  'ragi': { name: 'Finger Millet (Ragi)', category: 'grain', unit: 'g' },
  'finger millet (ragi)': { name: 'Finger Millet (Ragi)', category: 'grain', unit: 'g' },
  'bread': { name: 'Whole Wheat Bread', category: 'bakery', unit: 'pcs' },
  'whole wheat bread': { name: 'Whole Wheat Bread', category: 'bakery', unit: 'pcs' },

  // Produce (Vegetables & Tubers)
  'potato': { name: 'Potato', category: 'produce', unit: 'kg' },
  'potatoes': { name: 'Potato', category: 'produce', unit: 'kg' },
  'russet potato': { name: 'Potato', category: 'produce', unit: 'kg' },
  'baby potato': { name: 'Potato', category: 'produce', unit: 'kg' },
  'sweet potato': { name: 'Potato', category: 'produce', unit: 'kg' },
  'onion': { name: 'Onion', category: 'produce', unit: 'kg' },
  'onions': { name: 'Onion', category: 'produce', unit: 'kg' },
  'yellow onion': { name: 'Onion', category: 'produce', unit: 'kg' },
  'red onion': { name: 'Onion', category: 'produce', unit: 'kg' },
  'white onion': { name: 'Onion', category: 'produce', unit: 'kg' },
  'shallots': { name: 'Onion', category: 'produce', unit: 'kg' },
  'tomato': { name: 'Tomato', category: 'produce', unit: 'kg' },
  'tomatoes': { name: 'Tomato', category: 'produce', unit: 'kg' },
  'cherry tomatoes': { name: 'Cherry Tomatoes', category: 'produce', unit: 'g' },
  'cherry tomato': { name: 'Cherry Tomatoes', category: 'produce', unit: 'g' },
  'tomato sauce': { name: 'Tomato Sauce', category: 'canned', unit: 'g' },
  'carrot': { name: 'Carrot', category: 'produce', unit: 'kg' },
  'carrots': { name: 'Carrot', category: 'produce', unit: 'kg' },
  'garlic': { name: 'Garlic', category: 'produce', unit: 'g' },
  'ginger': { name: 'Ginger', category: 'produce', unit: 'g' },
  'bell pepper': { name: 'Bell Pepper', category: 'produce', unit: 'pcs' },
  'capsicum': { name: 'Bell Pepper', category: 'produce', unit: 'pcs' },
  'broccoli': { name: 'Broccoli', category: 'produce', unit: 'kg' },
  'spinach': { name: 'Fresh Spinach', category: 'produce', unit: 'g' },
  'fresh spinach': { name: 'Fresh Spinach', category: 'produce', unit: 'g' },

  // Fruits
  'avocado': { name: 'Hass Avocado', category: 'produce', unit: 'pcs' },
  'hass avocado': { name: 'Hass Avocado', category: 'produce', unit: 'pcs' },
  'dragon fruit': { name: 'Dragon Fruit', category: 'produce', unit: 'pcs' },
  'lemon': { name: 'Lemon', category: 'produce', unit: 'pcs' },
  'lime': { name: 'Lime', category: 'produce', unit: 'pcs' },
  'apple': { name: 'Apple', category: 'produce', unit: 'kg' },
  'apples': { name: 'Apple', category: 'produce', unit: 'kg' },
  'banana': { name: 'Banana', category: 'produce', unit: 'pcs' },
  'bananas': { name: 'Banana', category: 'produce', unit: 'pcs' },
  'orange': { name: 'Orange', category: 'produce', unit: 'kg' },
  'oranges': { name: 'Orange', category: 'produce', unit: 'kg' },

  // Proteins & Eggs
  'egg': { name: 'Eggs', category: 'dairy', unit: 'pcs' },
  'eggs': { name: 'Eggs', category: 'dairy', unit: 'pcs' },
  'chicken': { name: 'Chicken', category: 'meat', unit: 'kg' },
  'fresh chicken': { name: 'Chicken', category: 'meat', unit: 'kg' },
  'chicken breast': { name: 'Fresh Chicken Breast', category: 'meat', unit: 'kg' },
  'fresh chicken breast': { name: 'Fresh Chicken Breast', category: 'meat', unit: 'kg' },
  'chicken curry': { name: 'Chicken Curry Dish', category: 'meat', unit: 'pcs' },

  // Pantry, Sweets & Spices
  'chocolate': { name: 'Dark Chocolate', category: 'other', unit: 'g' },
  'dark chocolate': { name: 'Dark Chocolate', category: 'other', unit: 'g' },
  'cocoa': { name: 'Dark Chocolate', category: 'other', unit: 'g' },
  'olive oil': { name: 'Extra Virgin Olive Oil', category: 'liquid', unit: 'L' },
  'extra virgin olive oil': { name: 'Extra Virgin Olive Oil', category: 'liquid', unit: 'L' },
  'cooking oil': { name: 'Cooking Oil', category: 'liquid', unit: 'L' },
  'oil': { name: 'Cooking Oil', category: 'liquid', unit: 'L' },
  'cashews': { name: 'Raw Cashews', category: 'other', unit: 'g' },
  'raw cashews': { name: 'Raw Cashews', category: 'other', unit: 'g' },
  'salt': { name: 'Sea Salt', category: 'spice', unit: 'g' },
  'sea salt': { name: 'Sea Salt', category: 'spice', unit: 'g' },
  'sugar': { name: 'Cane Sugar', category: 'spice', unit: 'kg' },
  'cane sugar': { name: 'Cane Sugar', category: 'spice', unit: 'kg' }
};

/**
 * Patterns that represent measurements, volumes, weights, or metadata
 * which MUST NEVER be treated as food ingredient names.
 */
const MEASUREMENT_OR_METADATA_REGEX = /^(?:(?:\d+(?:\.\d+)?|\.\d+)\s*(?:l|ml|g|kg|mg|oz|lb|lbs|litre|litres|liter|liters|gm|gms|pcs|pc|pack|packs|bottle|bottles|cup|cups|tbsp|tsp|ct)\b|\d+\s*l$|\d+\s*kg$|\d+\s*g$|\d+\s*ml$|net\s*wt|mrp|exp(?:iry)?|mfd|batch|qty|ingredients?:?|barcode|fssai)$/i;

export class IngredientNormalizationService {
  /**
   * Checks whether a string is a measurement, quantity, or metadata rather than a food item name.
   * e.g., "1l", "2l", "500g", "2kg", "net wt", "100ml" are not ingredient names!
   */
  static isMeasurementOrQuantity(rawText: string): boolean {
    if (!rawText || !rawText.trim()) return true;
    const cleaned = rawText.trim().toLowerCase();
    
    // Check direct regex match
    if (MEASUREMENT_OR_METADATA_REGEX.test(cleaned)) {
      return true;
    }

    // Check pure numbers or digits with unit suffixes
    if (/^\d+(\.\d+)?$/.test(cleaned)) {
      return true;
    }

    // Check common isolated unit abbreviations
    const isolatedUnits = ['1l', '2l', '3l', '5l', '500ml', '250ml', '1kg', '2kg', '5kg', '10kg', '25kg', '500g', '250g', '100g'];
    if (isolatedUnits.includes(cleaned)) {
      return true;
    }

    return false;
  }

  /**
   * Validates whether a candidate string is a plausible food ingredient name.
   */
  static isValidFoodIngredientName(rawName: string): boolean {
    if (!rawName || rawName.trim().length < 2) return false;
    if (this.isMeasurementOrQuantity(rawName)) return false;
    
    // Filter out generic strings
    const lower = rawName.trim().toLowerCase();
    if (['unknown', 'unknown item', 'item', 'food', 'produce', 'undefined', 'null'].includes(lower)) {
      return false;
    }

    return true;
  }

  /**
   * Normalizes a raw string input into a canonical ingredient name, category, and default unit.
   * Returns empty name if input is a measurement/unit or invalid.
   */
  static normalize(rawName: string): { name: string; category: IngredientCategory; unit: string } {
    if (!rawName || !rawName.trim()) {
      return { name: '', category: 'other', unit: 'pcs' };
    }

    const cleaned = rawName.trim().toLowerCase();

    // Reject measurement strings like "1l", "500g", "2kg"
    if (this.isMeasurementOrQuantity(cleaned)) {
      return { name: '', category: 'other', unit: 'pcs' };
    }

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
   * Strictly ignores raw measurement strings like "1l".
   */
  static findInInventory(normalizedName: string, pantry: Ingredient[]): Ingredient | undefined {
    if (!normalizedName || !normalizedName.trim() || !pantry.length) return undefined;
    if (this.isMeasurementOrQuantity(normalizedName)) return undefined;

    const lowerTarget = normalizedName.trim().toLowerCase();
    if (lowerTarget === 'unknown' || lowerTarget === 'ingredient not confidently identified') {
      return undefined;
    }

    // 1. Exact match case-insensitive
    const exactMatch = pantry.find((p) => p.name.trim().toLowerCase() === lowerTarget);
    if (exactMatch) return exactMatch;

    // 2. Canonical alias match (e.g., target "Whole Milk" matching pantry "Milk" or vice versa)
    const targetNorm = this.normalize(normalizedName);
    if (!targetNorm.name) return undefined;
    const targetNormalized = targetNorm.name.toLowerCase();

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

