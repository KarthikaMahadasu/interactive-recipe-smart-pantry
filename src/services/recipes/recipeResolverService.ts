import type { Recipe, RecipeIngredientItem, RecipeInstructionStep, CookingCategoryType } from '../../types/recipe';
import { IngredientUtils } from '../../utils/ingredientUtils';
import { MASTER_RECIPE_CATALOG } from './masterRecipeCatalog';

export interface RecipeResolutionResult {
  recipe: Recipe | null;
  matchedRecipes: Recipe[];
  isAmbiguous: boolean;
  ambiguousChoices?: Recipe[];
  clarificationMessage?: string;
  detectedCategory?: CookingCategoryType;
  requestedServings?: number;
  dietaryConstraints?: string[];
  equipmentConstraints?: string[];
}

export class RecipeResolverService {
  /**
   * Resolves a user's natural language food query to a structured recipe.
   */
  static resolveQuery(query: string, availableRecipes: Recipe[] = []): RecipeResolutionResult {
    const rawText = query.trim();
    if (!rawText) {
      const defaultRec = availableRecipes[0] || MASTER_RECIPE_CATALOG[0];
      return {
        recipe: defaultRec,
        matchedRecipes: [defaultRec],
        isAmbiguous: false
      };
    }

    // 1. Combine catalog with available recipes without duplicates
    const combinedCatalog: Recipe[] = [...availableRecipes];
    MASTER_RECIPE_CATALOG.forEach((catRecipe) => {
      if (!combinedCatalog.some((r) => r.id === catRecipe.id || r.title.toLowerCase() === catRecipe.title.toLowerCase())) {
        combinedCatalog.push(catRecipe);
      }
    });

    // 2. Extract requested servings (e.g., "for four people", "for 6", "serves 2")
    const requestedServings = this.extractServings(rawText);

    // 3. Extract dietary and equipment constraints
    const dietaryConstraints: string[] = [];
    const equipmentConstraints: string[] = [];

    const lower = rawText.toLowerCase();
    if (/\b(without eggs?|no eggs?|eggless)\b/i.test(lower)) {
      dietaryConstraints.push('Eggless');
    }
    if (/\b(without (an )?oven|no oven|stovetop|gas stove|without baking in oven)\b/i.test(lower)) {
      equipmentConstraints.push('No-Oven');
    }
    if (/\b(vegetarian|veg)\b/i.test(lower)) {
      dietaryConstraints.push('Vegetarian');
    }
    if (/\b(vegan|dairy free|no dairy)\b/i.test(lower)) {
      dietaryConstraints.push('Vegan');
    }

    // 4. Normalize query text to target dish title
    const cleanDishName = this.extractCleanDishName(rawText);

    // 5. Detect cooking category
    const detectedCategory = this.detectCategory(cleanDishName, rawText);

    // 6. Multi-dish query support (e.g., "egg curry with rice")
    const multiTokens = this.splitMultiDishQuery(cleanDishName);
    if (multiTokens.length > 1) {
      const subMatches: Recipe[] = [];
      for (const token of multiTokens) {
        const match = this.findBestMatch(token, combinedCatalog, detectedCategory, dietaryConstraints, equipmentConstraints);
        if (match) subMatches.push(match);
      }
      if (subMatches.length > 1) {
        const combined = this.combineRecipes(subMatches);
        const scaled = requestedServings ? this.scaleRecipe(combined, requestedServings) : combined;
        return {
          recipe: scaled,
          matchedRecipes: subMatches,
          isAmbiguous: false,
          detectedCategory,
          requestedServings,
          dietaryConstraints,
          equipmentConstraints
        };
      }
    }

    // 7. If dish is broad/ambiguous (e.g. user just said "curry" or "cake" or "dessert" with no specificity)
    if (this.isBroadQuery(cleanDishName)) {
      const candidates = combinedCatalog.filter((r) => {
        if (detectedCategory === 'cake') return r.cookingCategory === 'cake' || r.cookingCategory === 'cupcake';
        if (detectedCategory === 'chocolate') return r.cookingCategory === 'chocolate' || r.title.toLowerCase().includes('chocolate');
        if (detectedCategory === 'curry') return r.cookingCategory === 'curry' || r.category === 'Curries & Gravies';
        if (detectedCategory === 'pasta') return r.cookingCategory === 'pasta';
        if (detectedCategory === 'rice') return r.cookingCategory === 'rice';
        if (detectedCategory === 'brownie') return r.cookingCategory === 'brownie';
        return false;
      });

      if (candidates.length > 1) {
        const titles = candidates.slice(0, 4).map((c) => `"${c.title}"`).join(', ');
        return {
          recipe: candidates[0],
          matchedRecipes: candidates,
          isAmbiguous: true,
          ambiguousChoices: candidates,
          clarificationMessage: `We have several ${detectedCategory} options: ${titles}. Which one would you prefer to prepare?`,
          detectedCategory,
          requestedServings
        };
      }
    }

    // 8. Find best match in catalog
    const matchedCandidate = this.findBestMatch(cleanDishName, combinedCatalog, detectedCategory, dietaryConstraints, equipmentConstraints);

    if (matchedCandidate) {
      const finalRecipe = requestedServings ? this.scaleRecipe(matchedCandidate, requestedServings) : matchedCandidate;
      return {
        recipe: finalRecipe,
        matchedRecipes: [finalRecipe],
        isAmbiguous: false,
        detectedCategory,
        requestedServings,
        dietaryConstraints,
        equipmentConstraints
      };
    }

    // 9. Generate realistic, category-specific dynamic recipe (NEVER substitute curry for cake!)
    const dynamicRecipe = this.generateCategoryAwareRecipe(cleanDishName, detectedCategory, requestedServings || 4, dietaryConstraints, equipmentConstraints);
    return {
      recipe: dynamicRecipe,
      matchedRecipes: [dynamicRecipe],
      isAmbiguous: false,
      detectedCategory,
      requestedServings,
      dietaryConstraints,
      equipmentConstraints
    };
  }

  /**
   * Cleans natural language intent prefixes, suffixes, servings, and constraints from the dish name.
   */
  static extractCleanDishName(query: string): string {
    let text = query.trim().toLowerCase();

    // Remove polite / assistant prefixes
    text = text.replace(/^(can you|could you|please|kindly|i want to|i'd like to|i would like to|help me|teach me to|teach me how to|show me how to|show me|how can i|how to|what is the recipe for|recipe for|give me a|give me|let's make|lets make|make me|prepare|bake|cook|make)\s+/i, '').trim();
    text = text.replace(/^(prepare|bake|cook|make|start cooking|start baking|start|open)\s+/i, '').trim();

    // Remove "from scratch"
    text = text.replace(/\bfrom scratch\b/gi, '').trim();

    // Remove servings phrases like "for four people", "for 6 persons", "for 4", "serves 6"
    text = text.replace(/\bfor\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+(people|persons|servings|guests)?\b/gi, '').trim();
    text = text.replace(/\bfor\s+(\d+)\b/gi, '').trim();

    // Remove constraint phrases like "without an oven", "without eggs", "without oven"
    text = text.replace(/\b(without an? oven|no oven|without eggs?|eggless|vegetarian|vegan)\b/gi, '').trim();

    // Clean leading/trailing punctuation and residual filler words
    text = text.replace(/^(a|an|the|some)\s+/i, '').trim();
    text = text.replace(/[?.!,;:]/g, '').trim();

    return text || query.trim();
  }

  /**
   * Extracts servings number from natural language (supports digits and word numbers).
   */
  static extractServings(text: string): number | undefined {
    const wordNumbers: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      twelve: 12
    };

    const matchWord = text.match(/\bfor\s+(one|two|three|four|five|six|seven|eight|nine|ten|twelve)\b/i);
    if (matchWord) {
      return wordNumbers[matchWord[1].toLowerCase()];
    }

    const matchDigits = text.match(/\b(?:for|serves|servings?)\s*(\d+)\b/i) || text.match(/\b(\d+)\s*(?:people|persons|servings|guests)\b/i);
    if (matchDigits) {
      const parsed = parseInt(matchDigits[1], 10);
      if (parsed > 0 && parsed <= 50) return parsed;
    }

    return undefined;
  }

  /**
   * Categorizes the user request into distinct culinary categories.
   */
  static detectCategory(dishName: string, fullQuery: string): CookingCategoryType {
    const text = `${dishName} ${fullQuery}`.toLowerCase();

    if (/\b(cupcakes?|muffins?)\b/i.test(text)) return 'cupcake';
    if (/\b(brownies?|blondies?)\b/i.test(text)) return 'brownie';
    if (/\b(cookies?|biscuits?)\b/i.test(text)) return 'cookie';
    if (/\b(pastr(y|ies)|croissant|puff pastry|turnovers?|tarts?|pies?)\b/i.test(text)) return 'pastry';
    if (/\b(cakes?|sponge cake|cheesecake|gateau|torte)\b/i.test(text)) return 'cake';
    if (/\b(mousse|pudding|custard|panna cotta|creme caramel|tiramisu)\b/i.test(text)) return 'chilled_dessert';
    if (/\b(chocolates?|truffles?|pralines?|fudge|confectionery)\b/i.test(text)) return 'chocolate';
    if (/\b(pastas?|penne|spaghetti|macaroni|noodles?|ramen|lasagna|ravioli)\b/i.test(text)) return 'pasta';
    if (/\b(fried rice|biryani|pulao|steamed rice|jeera rice|khichdi|risotto|rice)\b/i.test(text)) return 'rice';
    if (/\b(smoothie|porridge|oatmeal|pancakes?|waffles?)\b/i.test(text)) return 'breakfast';
    if (/\b(curry|curries|masala|dal|sambar|korma|gravy|fry|paneer|kuzhambu)\b/i.test(text)) return 'curry';

    return 'general';
  }

  /**
   * Splits multi-dish query like "egg curry with rice" or "rice, dal, and vegetable curry".
   */
  private static splitMultiDishQuery(text: string): string[] {
    return text
      .split(/\b(and|with)\b|[,&]/i)
      .map((t) => t.trim())
      .filter((t) => t.length > 2 && t !== 'and' && t !== 'with');
  }

  private static isBroadQuery(name: string): boolean {
    const broadWords = ['curry', 'cake', 'pastry', 'pastries', 'chocolate', 'brownie', 'brownies', 'pasta', 'rice', 'dessert', 'cupcake', 'cupcakes'];
    return broadWords.includes(name.toLowerCase().trim());
  }

  /**
   * Matches clean dish name against available recipes with category and constraint validation.
   */
  private static findBestMatch(
    cleanName: string,
    recipes: Recipe[],
    category: CookingCategoryType,
    dietaryConstraints: string[],
    equipmentConstraints: string[]
  ): Recipe | null {
    const target = cleanName.toLowerCase().trim();
    if (!target) return null;

    // 1. Exact match on title or alias
    const exact = recipes.find((r) => r.title.toLowerCase() === target);
    if (exact) return exact;

    // 2. High confidence partial title match within matching category
    const categoryMatches = recipes.filter((r) => {
      const titleLower = r.title.toLowerCase();
      const titleCleaned = titleLower.replace(/^(homestyle|restaurant style|crispy|decadent|moist|classic|fluffy|traditional|aromatic|golden|french)\s+/i, '');
      return (
        titleLower.includes(target) ||
        target.includes(titleLower) ||
        titleCleaned.includes(target) ||
        target.includes(titleCleaned)
      );
    });

    if (categoryMatches.length > 0) {
      // Prioritize constraint match (e.g. eggless or no-oven)
      if (equipmentConstraints.includes('No-Oven')) {
        const noOvenMatch = categoryMatches.find((r) => r.dietaryTags.some((t) => /no-oven/i.test(t)) || r.equipment?.some((e) => /stovetop|cooker/i.test(e)));
        if (noOvenMatch) return noOvenMatch;
      }

      if (dietaryConstraints.includes('Eggless')) {
        const egglessMatch = categoryMatches.find((r) => r.dietaryTags.some((t) => /eggless/i.test(t)) || !r.ingredients.some((ing) => ing.name.toLowerCase() === 'eggs'));
        if (egglessMatch) return egglessMatch;
      }

      // Prioritize matching cookingCategory
      if (category !== 'general') {
        const sameCategory = categoryMatches.find((r) => r.cookingCategory === category);
        if (sameCategory) return sameCategory;
      }

      return categoryMatches[0];
    }

    // 3. Fallback: Search by main ingredient or dish keyword
    const keywordMatch = recipes.find((r) => {
      if (category !== 'general' && r.cookingCategory && r.cookingCategory !== category) {
        return false;
      }
      return r.ingredients.some((ing) => IngredientUtils.areIngredientsMatching(ing.name, target));
    });

    return keywordMatch || null;
  }

  /**
   * Generates a fully structured, category-appropriate recipe dynamically.
   * NEVER generates curry for cake, chocolate, or pastry!
   */
  static generateCategoryAwareRecipe(
    dishName: string,
    category: CookingCategoryType,
    servings: number = 4,
    dietaryConstraints: string[] = [],
    equipmentConstraints: string[] = []
  ): Recipe {
    const formattedTitle = dishName
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    const id = `rec_dyn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const isEggless = dietaryConstraints.includes('Eggless');
    const isNoOven = equipmentConstraints.includes('No-Oven');

    if (category === 'cake' || category === 'cupcake') {
      const isCupcake = category === 'cupcake';
      return {
        id,
        title: isCupcake ? `${formattedTitle} Cupcakes` : `${formattedTitle}`,
        description: `Chef-crafted recipe for moist ${formattedTitle} with balanced crumb structure, rich aromatics, and precise temperature-controlled baking.`,
        prepTime: 20,
        cookTime: isCupcake ? 20 : 35,
        servings,
        difficulty: 'Medium',
        category: 'Cakes & Baking',
        cookingCategory: category,
        cuisine: 'Bakery',
        dietaryTags: isEggless ? ['Vegetarian', 'Eggless'] : ['Vegetarian'],
        equipment: isCupcake ? ['Cupcake Pan', 'Liners', 'Whisk', 'Mixing Bowl', 'Oven'] : ['Round Cake Tin', 'Parchment Paper', 'Whisk', 'Mixing Bowl', 'Oven or Stovetop Cooker'],
        temperature: '175°C (350°F)',
        storageGuidance: 'Store at room temperature in an airtight box for up to 4 days.',
        safetyNotes: 'Use oven mitts when handling hot cake pans.',
        ingredients: [
          { name: 'All-Purpose Flour', amount: Math.round(50 * servings), unit: 'g', note: 'Sifted fine flour' },
          { name: 'Sugar', amount: Math.round(35 * servings), unit: 'g', note: 'Fine castor or granulated sugar' },
          { name: 'Butter', amount: Math.round(20 * servings), unit: 'g', note: 'Softened unsalted butter or neutral oil' },
          { name: 'Milk', amount: Math.round(40 * servings), unit: 'ml', note: 'Whole milk or plant-based milk' },
          { name: 'Baking Powder', amount: Math.max(4, Math.round(1.5 * servings)), unit: 'g', note: 'Leavening agent' },
          { name: 'Vanilla Extract', amount: 5, unit: 'ml', note: 'Flavoring extract' },
          { name: 'Salt', amount: 2, unit: 'g', note: 'Pinch of salt' },
          ...(isEggless
            ? [{ name: 'Greek Yogurt', amount: Math.round(25 * servings), unit: 'g', note: 'Provides moisture and rise in eggless baking' }]
            : [{ name: 'Eggs', amount: Math.max(1, Math.round(servings / 2)), unit: 'pcs', note: 'Room temperature' }])
        ],
        instructions: [
          { step: 1, text: `Preheat oven to 175°C (350°F). Grease cake pan and line with parchment paper.`, durationMinutes: 5, equipmentRequired: ['Oven', 'Round Cake Tin'], temperature: '175°C' },
          { step: 2, text: `Sift ${Math.round(50 * servings)} g Flour, Baking Powder, and Salt into a bowl.`, durationMinutes: 4, equipmentRequired: ['Mixing Bowl'] },
          { step: 3, text: `Cream ${Math.round(20 * servings)} g Butter and ${Math.round(35 * servings)} g Sugar together until light and fluffy. Beat in ${isEggless ? 'Yogurt' : 'Eggs'} and Vanilla Extract.`, durationMinutes: 5, equipmentRequired: ['Whisk'] },
          { step: 4, text: `Gently fold dry ingredients and Milk alternately into the wet mixture until smooth. Pour into prepared pan.`, durationMinutes: 4 },
          { step: 5, text: `Bake at 175°C for ${isCupcake ? '18-20' : '30-35'} minutes until a toothpick inserted into the center comes out clean.`, durationMinutes: isCupcake ? 20 : 35, temperature: '175°C' },
          { step: 6, text: 'Cool on a wire rack for 15 minutes before unmoulding and serving.', durationMinutes: 15 }
        ],
        nutrition: { calories: 310, protein: 5, carbs: 46, fat: 12 },
        colorGradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        createdAt: new Date().toISOString()
      };
    }

    if (category === 'chocolate' || category === 'chilled_dessert') {
      return {
        id,
        title: formattedTitle,
        description: `Silky, decadent ${formattedTitle} prepared using real cocoa solids and gentle temperature-controlled setting.`,
        prepTime: 15,
        cookTime: 10,
        servings,
        difficulty: 'Medium',
        category: category === 'chocolate' ? 'Chocolate & Confectionery' : 'Puddings & Chilled Desserts',
        cookingCategory: category,
        cuisine: 'Confectionery',
        dietaryTags: ['Vegetarian', 'No-Bake'],
        equipment: ['Double Boiler / Heatproof Bowl', 'Silicone Moulds or Glasses', 'Spatula', 'Refrigerator'],
        temperature: 'Gentle Melt (< 45°C) & Refrigerator Chilling (4°C)',
        storageGuidance: 'Keep refrigerated for up to 10 days.',
        safetyNotes: 'Keep moisture away from melting chocolate.',
        ingredients: [
          { name: 'Dark Chocolate', amount: Math.round(35 * servings), unit: 'g', note: 'Quality dark chocolate' },
          { name: 'Heavy Cream', amount: Math.round(40 * servings), unit: 'ml', note: 'Chilled whipping cream or milk' },
          { name: 'Sugar', amount: Math.round(15 * servings), unit: 'g', note: 'Fine castor sugar' },
          { name: 'Butter', amount: Math.round(10 * servings), unit: 'g', note: 'Unsalted butter for glossy finish' },
          { name: 'Vanilla Extract', amount: 4, unit: 'ml', note: 'Pure vanilla' }
        ],
        instructions: [
          { step: 1, text: `Melt ${Math.round(35 * servings)} g Dark Chocolate and ${Math.round(10 * servings)} g Butter in a heatproof bowl set over simmering water (double boiler).`, durationMinutes: 5, equipmentRequired: ['Double Boiler / Heatproof Bowl'] },
          { step: 2, text: `Stir in ${Math.round(15 * servings)} g Sugar and Vanilla Extract until glossy and dissolved.`, durationMinutes: 3 },
          { step: 3, text: `Whisk in ${Math.round(40 * servings)} ml Cream until velvety and unified.`, durationMinutes: 3, equipmentRequired: ['Spatula'] },
          { step: 4, text: 'Pour into moulds or serving glasses. Chill in refrigerator for 2 hours until firmly set.', durationMinutes: 120, equipmentRequired: ['Refrigerator'] }
        ],
        nutrition: { calories: 290, protein: 4, carbs: 24, fat: 20 },
        colorGradient: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
        createdAt: new Date().toISOString()
      };
    }

    if (category === 'brownie' || category === 'cookie') {
      return {
        id,
        title: `${formattedTitle}`,
        description: `Fudgy, chewy ${formattedTitle} with crispy crackly exterior and molten interior crumb.`,
        prepTime: 15,
        cookTime: 25,
        servings,
        difficulty: 'Easy',
        category: 'Cookies & Brownies',
        cookingCategory: category,
        cuisine: 'Bakery',
        dietaryTags: isNoOven ? ['Vegetarian', 'No-Oven-Friendly'] : ['Vegetarian'],
        equipment: isNoOven ? ['Heavy-Bottom Pot / Cooker', 'Trivet', 'Baking Pan', 'Whisk'] : ['8-inch Baking Pan', 'Whisk', 'Oven'],
        temperature: isNoOven ? 'Stovetop Low Flame' : '170°C (340°F)',
        storageGuidance: 'Store in an airtight container for 5 days.',
        ingredients: [
          { name: 'All-Purpose Flour', amount: Math.round(25 * servings), unit: 'g', note: 'Flour for dense structure' },
          { name: 'Cocoa Powder', amount: Math.round(15 * servings), unit: 'g', note: 'Unsweetened cocoa powder' },
          { name: 'Butter', amount: Math.round(25 * servings), unit: 'g', note: 'Melted butter' },
          { name: 'Sugar', amount: Math.round(35 * servings), unit: 'g', note: 'Granulated sugar' },
          { name: 'Eggs', amount: Math.max(1, Math.round(servings / 2)), unit: 'pcs', note: 'Room temperature' },
          { name: 'Vanilla Extract', amount: 4, unit: 'ml', note: 'Pure vanilla' },
          { name: 'Salt', amount: 2, unit: 'g', note: 'Fine salt' }
        ],
        instructions: [
          { step: 1, text: `${isNoOven ? 'Preheat a heavy pot with trivet on medium flame for 10 minutes.' : 'Preheat oven to 170°C and grease baking pan.'}`, durationMinutes: 10, temperature: '170°C / Stovetop' },
          { step: 2, text: `Melt Butter and whisk with Sugar, Eggs, and Vanilla Extract until frothy.`, durationMinutes: 4, equipmentRequired: ['Whisk'] },
          { step: 3, text: `Fold in Flour, Cocoa Powder, and Salt until a thick glossy batter forms.`, durationMinutes: 3 },
          { step: 4, text: `Pour into baking tin and bake for 22-25 minutes until fudgy in the center. Cool before slicing.`, durationMinutes: 25 }
        ],
        nutrition: { calories: 340, protein: 4, carbs: 38, fat: 18 },
        colorGradient: 'linear-gradient(135deg, #9a3412 0%, #7c2d12 100%)',
        createdAt: new Date().toISOString()
      };
    }

    if (category === 'pastry') {
      return {
        id,
        title: `${formattedTitle}`,
        description: `Delicate golden flaky pastry with crisp layers and buttery interior.`,
        prepTime: 40,
        cookTime: 25,
        servings,
        difficulty: 'Hard',
        category: 'Pastries',
        cookingCategory: 'pastry',
        cuisine: 'French Patisserie',
        dietaryTags: ['Vegetarian'],
        equipment: ['Rolling Pin', 'Baking Sheet', 'Parchment Paper', 'Oven'],
        temperature: '200°C (400°F)',
        ingredients: [
          { name: 'All-Purpose Flour', amount: Math.round(50 * servings), unit: 'g', note: 'Fine pastry flour' },
          { name: 'Butter', amount: Math.round(35 * servings), unit: 'g', note: 'Cold unsalted butter for lamination' },
          { name: 'Salt', amount: 3, unit: 'g', note: 'Fine sea salt' },
          { name: 'Cold Water', amount: Math.round(25 * servings), unit: 'ml', note: 'Ice cold' },
          { name: 'Sugar', amount: 10, unit: 'g', note: 'Castor sugar' }
        ],
        instructions: [
          { step: 1, text: 'Mix flour and salt; rub in a portion of butter and add cold water to form dough. Chill for 20 minutes.', durationMinutes: 20 },
          { step: 2, text: 'Encase cold butter slab inside dough and perform repeated laminating folds (turns) to create flaky layers.', durationMinutes: 25, equipmentRequired: ['Rolling Pin'] },
          { step: 3, text: 'Roll out, shape into pastries, and bake at 200°C for 22 minutes until puffed, golden, and crisp.', durationMinutes: 22, temperature: '200°C' }
        ],
        nutrition: { calories: 360, protein: 5, carbs: 35, fat: 22 },
        colorGradient: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
        createdAt: new Date().toISOString()
      };
    }

    if (category === 'pasta') {
      return {
        id,
        title: `${formattedTitle}`,
        description: `Al dente pasta tossed in an aromatic sauce with fresh herbs and olive oil.`,
        prepTime: 10,
        cookTime: 18,
        servings,
        difficulty: 'Easy',
        category: 'Pasta & Noodles',
        cookingCategory: 'pasta',
        cuisine: 'Italian',
        dietaryTags: ['Vegetarian'],
        equipment: ['Stockpot', 'Skillet', 'Colander'],
        temperature: 'Boiling Water & Medium Simmer',
        ingredients: [
          { name: 'Pasta', amount: Math.round(85 * servings), unit: 'g', note: 'Penne or preferred pasta' },
          { name: 'Water', amount: Math.max(2, Math.round(servings * 0.7)), unit: 'L', note: 'For boiling' },
          { name: 'Tomato', amount: Math.round(100 * servings), unit: 'g', note: 'Crushed ripe tomatoes' },
          { name: 'Cooking Oil', amount: Math.round(8 * servings), unit: 'ml', note: 'Olive oil' },
          { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Minced garlic' },
          { name: 'Salt', amount: Math.round(4 * servings), unit: 'g', note: 'Salt for pasta and sauce' }
        ],
        instructions: [
          { step: 1, text: 'Boil pasta in salted water for 9-11 minutes until al dente. Reserve 1/2 cup pasta water, then drain.', durationMinutes: 11, equipmentRequired: ['Stockpot', 'Colander'] },
          { step: 2, text: 'Sauté garlic in olive oil, add tomatoes and seasoning, and simmer for 6 minutes.', durationMinutes: 6, equipmentRequired: ['Skillet'] },
          { step: 3, text: 'Toss pasta into sauce with reserved water for 2 minutes until glossy.', durationMinutes: 2 }
        ],
        nutrition: { calories: 350, protein: 10, carbs: 60, fat: 8 },
        colorGradient: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
        createdAt: new Date().toISOString()
      };
    }

    if (category === 'rice') {
      return {
        id,
        title: `${formattedTitle}`,
        description: `Wok-tossed seasoned rice with crisp vegetables, aromatics, and savoury seasoning.`,
        prepTime: 10,
        cookTime: 15,
        servings,
        difficulty: 'Easy',
        category: 'Rice Dishes',
        cookingCategory: 'rice',
        cuisine: 'Asian / Indian',
        dietaryTags: ['Vegan', 'Gluten-Free'],
        equipment: ['Wok / Kadai', 'Spatula'],
        temperature: 'High Flame',
        ingredients: [
          { name: 'Rice', amount: Math.round(100 * servings), unit: 'g', note: 'Cooked chilled rice' },
          { name: 'Cooking Oil', amount: Math.round(8 * servings), unit: 'ml', note: 'Cooking oil' },
          { name: 'Mixed Vegetables', amount: Math.round(50 * servings), unit: 'g', note: 'Diced crisp vegetables' },
          { name: 'Onion', amount: Math.round(25 * servings), unit: 'g', note: 'Finely sliced' },
          { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Aromatics' },
          { name: 'Salt', amount: Math.round(2 * servings), unit: 'g', note: 'To taste' }
        ],
        instructions: [
          { step: 1, text: 'Heat oil in wok over high flame. Sauté aromatics and onions for 2 minutes.', durationMinutes: 2, temperature: 'High Flame' },
          { step: 2, text: 'Add vegetables and stir fry for 3 minutes keeping them crisp.', durationMinutes: 3, temperature: 'High Flame' },
          { step: 3, text: 'Add cooked rice, salt, and seasonings; toss vigorously on high heat for 3 minutes.', durationMinutes: 3 }
        ],
        nutrition: { calories: 290, protein: 5, carbs: 50, fat: 7 },
        colorGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        createdAt: new Date().toISOString()
      };
    }

    // Default: Savory Curry / Gravy
    return {
      id,
      title: `${formattedTitle}`,
      description: `Chef-crafted authentic curry recipe for ${formattedTitle} with slow-simmered onion-tomato gravy and balanced spices.`,
      prepTime: 15,
      cookTime: 25,
      servings,
      difficulty: 'Medium',
      category: 'Curries & Gravies',
      cookingCategory: 'curry',
      cuisine: 'Indian',
      dietaryTags: ['Gluten-Free'],
      equipment: ['Kadai / Heavy Pot', 'Chef Knife', 'Lid'],
      temperature: 'Medium Flame Simmer',
      ingredients: [
        { name: formattedTitle.replace(/\b(Curry|Masala|Gravy|Fry)\b/gi, '').trim() || 'Vegetable', amount: Math.round(120 * servings), unit: 'g', note: 'Cleaned and prepped' },
        { name: 'Cooking Oil', amount: Math.round(8 * servings), unit: 'ml', note: 'For cooking and tempering' },
        { name: 'Onion', amount: Math.round(40 * servings), unit: 'g', note: 'Finely sliced' },
        { name: 'Tomato', amount: Math.round(40 * servings), unit: 'g', note: 'Chopped' },
        { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Freshly ground' },
        { name: 'Salt', amount: Math.round(2.5 * servings), unit: 'g', note: 'Seasoning to taste' },
        { name: 'Red Chilli Powder', amount: Math.max(3, Math.round(1.5 * servings)), unit: 'g', note: 'For warm spice' },
        { name: 'Turmeric Powder', amount: 3, unit: 'g', note: 'Golden spice' },
        { name: 'Garam Masala', amount: 4, unit: 'g', note: 'Finishing spice' },
        { name: 'Water', amount: Math.round(75 * servings), unit: 'ml', note: 'For gravy simmer' }
      ],
      instructions: [
        { step: 1, text: `Prepare and cut main ingredients into uniform pieces.`, durationMinutes: 6 },
        { step: 2, text: `Heat cooking oil in a pan, sauté onions and ginger garlic paste until golden brown.`, durationMinutes: 5 },
        { step: 3, text: `Add tomatoes, salt, turmeric, and red chilli powder; cook until soft and oil separates.`, durationMinutes: 5 },
        { step: 4, text: `Add prepped ingredients and water; cover and simmer on medium flame for 12 minutes.`, durationMinutes: 12, temperature: 'Medium Flame' },
        { step: 5, text: `Stir in garam masala, simmer for 2 minutes, and serve hot.`, durationMinutes: 2 }
      ],
      nutrition: { calories: 340, protein: 12, carbs: 28, fat: 14 },
      colorGradient: 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)',
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Scales a recipe's ingredient quantities proportionally to requested servings.
   */
  static scaleRecipe(recipe: Recipe, targetServings: number): Recipe {
    if (!targetServings || targetServings === recipe.servings) {
      return recipe;
    }

    const ratio = targetServings / recipe.servings;

    const scaledIngredients = recipe.ingredients.map((ing) => ({
      ...ing,
      amount: Math.round(ing.amount * ratio * 10) / 10
    }));

    return {
      ...recipe,
      servings: targetServings,
      ingredients: scaledIngredients
    };
  }

  /**
   * Combines multiple distinct recipes into a composite menu recipe.
   */
  static combineRecipes(recipes: Recipe[]): Recipe {
    const titles = recipes.map((r) => r.title).join(' & ');
    const combinedId = `rec_combo_${recipes.map((r) => r.id).join('_')}`;

    const ingredientLists = recipes.map((r) => r.ingredients);
    const mergedIngredients: RecipeIngredientItem[] = IngredientUtils.mergeIngredientLists(ingredientLists);

    const mergedInstructions: RecipeInstructionStep[] = [];
    let stepNum = 1;

    recipes.forEach((r) => {
      r.instructions.forEach((inst) => {
        mergedInstructions.push({
          step: stepNum++,
          text: `[${r.title}] ${inst.text}`,
          durationMinutes: inst.durationMinutes,
          ingredientsUsed: inst.ingredientsUsed,
          tip: inst.tip,
          temperature: inst.temperature
        });
      });
    });

    const maxPrep = Math.max(...recipes.map((r) => r.prepTime));
    const totalCook = recipes.reduce((sum, r) => sum + r.cookTime, 0);

    return {
      id: combinedId,
      title: `Combined Menu: ${titles}`,
      description: `Complete combined recipe workspace for ${titles}. Ingredients and preparation steps merged seamlessly.`,
      prepTime: maxPrep,
      cookTime: totalCook,
      servings: 4,
      difficulty: 'Medium',
      category: 'Dinner',
      cuisine: 'Fusion / Multi-Course',
      dietaryTags: Array.from(new Set(recipes.flatMap((r) => r.dietaryTags))),
      ingredients: mergedIngredients,
      instructions: mergedInstructions,
      nutrition: {
        calories: recipes.reduce((s, r) => s + r.nutrition.calories, 0),
        protein: recipes.reduce((s, r) => s + r.nutrition.protein, 0),
        carbs: recipes.reduce((s, r) => s + r.nutrition.carbs, 0),
        fat: recipes.reduce((s, r) => s + r.nutrition.fat, 0)
      },
      colorGradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      createdAt: new Date().toISOString()
    };
  }
}
