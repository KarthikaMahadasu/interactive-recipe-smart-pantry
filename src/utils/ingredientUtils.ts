export interface StandardizedQuantity {
  amount: number;
  unit: string;
}

// Normalized base units
export type UnitCategory = 'weight' | 'volume' | 'count' | 'other';

export class IngredientUtils {
  /**
   * Normalizes ingredient names for matching (e.g. "Potatoes" -> "potato", "Fresh Paneer" -> "paneer")
   */
  static normalizeName(name: string): string {
    if (!name) return '';
    let clean = name.trim().toLowerCase();
    
    // Remove common prefixes
    clean = clean.replace(/^(fresh|organic|raw|chopped|diced|sliced|minced|pureed|rinsed|soaked|bone-in|skinless)\s+/i, '');

    // Plural normalization for common ingredients
    if (clean === 'potatoes' || clean === 'potato') return 'potato';
    if (clean === 'tomatoes' || clean === 'tomato') return 'tomato';
    if (clean === 'onions' || clean === 'onion') return 'onion';
    if (clean === 'chillies' || clean === 'chilli' || clean === 'chili' || clean === 'chilies') return 'chilli';
    if (clean === 'green chillies' || clean === 'green chilli') return 'green chilli';
    if (clean === 'red chilli powder' || clean === 'chilli powder' || clean === 'chili powder') return 'red chilli powder';
    if (clean === 'turmeric' || clean === 'turmeric powder') return 'turmeric powder';
    if (clean === 'basmati rice' || clean === 'white rice' || clean === 'rice') return 'rice';
    if (clean === 'cooking oil' || clean === 'vegetable oil' || clean === 'sunflower oil' || clean === 'oil') return 'cooking oil';
    if (clean === 'ginger garlic paste' || clean === 'ginger-garlic paste') return 'ginger garlic paste';
    if (clean === 'toor dal' || clean === 'yellow dal' || clean === 'dal') return 'toor dal';
    if (clean === 'finger millet' || clean === 'finger millet (ragi)' || clean === 'ragi') return 'finger millet (ragi)';
    if (clean === 'hass avocado' || clean === 'avocado') return 'hass avocado';
    if (clean === 'fresh paneer' || clean === 'paneer') return 'fresh paneer';
    if (clean === 'greek yogurt' || clean === 'yogurt' || clean === 'curd') return 'greek yogurt';
    if (clean === 'raw cashews' || clean === 'cashews' || clean === 'cashew') return 'raw cashews';
    if (clean === 'dragon fruit' || clean === 'dragonfruit') return 'dragon fruit';

    // Generic singularize if ends with 's'
    if (clean.endsWith('es') && clean.length > 4) {
      clean = clean.slice(0, -2);
    } else if (clean.endsWith('s') && !clean.endsWith('ss') && clean.length > 3) {
      clean = clean.slice(0, -1);
    }

    return clean;
  }

  /**
   * Checks if two ingredient names match using exact or normalized fuzzy matching
   */
  static areIngredientsMatching(name1: string, name2: string): boolean {
    if (!name1 || !name2) return false;
    const n1 = this.normalizeName(name1);
    const n2 = this.normalizeName(name2);

    if (n1 === n2) return true;
    if (n1.includes(n2) || n2.includes(n1)) return true;

    // Special match groups
    const oilTerms = ['cooking oil', 'oil', 'vegetable oil', 'sunflower oil', 'ghee', 'butter'];
    if (oilTerms.includes(n1) && oilTerms.includes(n2)) return true;

    const riceTerms = ['rice', 'basmati rice', 'white rice'];
    if (riceTerms.includes(n1) && riceTerms.includes(n2)) return true;

    const chilliTerms = ['chilli', 'red chilli powder', 'chilli powder', 'green chilli'];
    if (chilliTerms.includes(n1) && chilliTerms.includes(n2)) return true;

    const dalTerms = ['toor dal', 'yellow dal', 'dal'];
    if (dalTerms.includes(n1) && dalTerms.includes(n2)) return true;

    return false;
  }

  /**
   * Categorizes unit type (weight, volume, count)
   */
  static getUnitCategory(unit: string): UnitCategory {
    const u = (unit || '').toLowerCase().trim();
    if (['kg', 'g', 'gm', 'gms', 'gram', 'grams', 'mg', 'lb', 'oz', 'pinch'].includes(u)) {
      return 'weight';
    }
    if (['l', 'ltr', 'liter', 'liters', 'litre', 'litres', 'ml', 'tbsp', 'tablespoon', 'tsp', 'teaspoon', 'cup', 'cups'].includes(u)) {
      return 'volume';
    }
    if (['pcs', 'pc', 'piece', 'pieces', 'clove', 'cloves', 'sprig', 'bunch', 'pack', 'bottle'].includes(u)) {
      return 'count';
    }
    return 'other';
  }

  /**
   * Converts a quantity from one unit to another compatible unit
   */
  static convertUnit(amount: number, fromUnit: string, toUnit: string): number {
    const from = (fromUnit || '').toLowerCase().trim();
    const to = (toUnit || '').toLowerCase().trim();

    if (from === to) return amount;

    // Direct Weight Conversions (base = grams)
    const weightInGrams: Record<string, number> = {
      kg: 1000,
      g: 1,
      gm: 1,
      gms: 1,
      gram: 1,
      grams: 1,
      mg: 0.001,
      lb: 453.592,
      oz: 28.3495,
      pinch: 0.5
    };

    if (weightInGrams[from] !== undefined && weightInGrams[to] !== undefined) {
      const grams = amount * weightInGrams[from];
      return grams / weightInGrams[to];
    }

    // Direct Volume Conversions (base = ml)
    const volumeInMl: Record<string, number> = {
      l: 1000,
      ltr: 1000,
      liter: 1000,
      liters: 1000,
      litre: 1000,
      litres: 1000,
      ml: 1,
      tbsp: 15,
      tablespoon: 15,
      tablespoons: 15,
      tsp: 5,
      teaspoon: 5,
      teaspoons: 5,
      cup: 240,
      cups: 240
    };

    if (volumeInMl[from] !== undefined && volumeInMl[to] !== undefined) {
      const ml = amount * volumeInMl[from];
      return ml / volumeInMl[to];
    }

    // Cross-category approximation for cooking fats/liquids (1 tbsp oil = 15 ml ~ 14 g, 1 L water = 1 kg)
    if (weightInGrams[from] !== undefined && volumeInMl[to] !== undefined) {
      const grams = amount * weightInGrams[from];
      return grams / volumeInMl[to]; // 1 g approx 1 ml for kitchen liquids
    }

    if (volumeInMl[from] !== undefined && weightInGrams[to] !== undefined) {
      const ml = amount * volumeInMl[from];
      return ml / weightInGrams[to]; // 1 ml approx 1 g for kitchen liquids
    }

    // Count conversion fallback
    return amount;
  }

  /**
   * Checks if an ingredient is classified as a spice or seasoning
   */
  static isSpice(name: string): boolean {
    const norm = this.normalizeName(name);
    const spiceKeywords = [
      'salt', 'chilli', 'turmeric', 'mustard', 'cumin', 'garam masala', 'pepper', 'cardamom',
      'clove', 'cinnamon', 'coriander', 'fenugreek', 'bay leaf', 'hing', 'asafoetida', 'kasuri methi', 'spices'
    ];
    return spiceKeywords.some((k) => norm.includes(k));
  }

  /**
   * Merges multiple ingredient arrays into a single combined list with summed quantities
   */
  static mergeIngredientLists(
    lists: Array<Array<{ name: string; amount: number; unit: string; optional?: boolean; note?: string }>>
  ): Array<{ name: string; amount: number; unit: string; optional?: boolean; note?: string }> {
    const mergedMap = new Map<string, { name: string; amount: number; unit: string; optional?: boolean; notes: string[] }>();

    lists.forEach((list) => {
      list.forEach((item) => {
        const normKey = this.normalizeName(item.name);
        const existing = mergedMap.get(normKey);

        if (existing) {
          const convertedAmount = this.convertUnit(item.amount, item.unit, existing.unit);
          existing.amount = Math.round((existing.amount + convertedAmount) * 100) / 100;
          if (item.note && !existing.notes.includes(item.note)) {
            existing.notes.push(item.note);
          }
        } else {
          mergedMap.set(normKey, {
            name: item.name,
            amount: item.amount,
            unit: item.unit,
            optional: item.optional,
            notes: item.note ? [item.note] : []
          });
        }
      });
    });

    return Array.from(mergedMap.values()).map((entry) => ({
      name: entry.name,
      amount: entry.amount,
      unit: entry.unit,
      optional: entry.optional,
      note: entry.notes.join('; ')
    }));
  }
}
