import type { Recipe, RecipeIngredientItem, RecipeInstructionStep } from '../../types/recipe';
import { IngredientUtils } from '../../utils/ingredientUtils';

export interface RecipeResolutionResult {
  recipe: Recipe | null;
  matchedRecipes: Recipe[];
  isAmbiguous: boolean;
  ambiguousChoices?: Recipe[];
  clarificationMessage?: string;
}

export class RecipeResolverService {
  /**
   * Resolves a user's query string to one or more recipes.
   * Handles multi-dish queries like "egg curry with rice" or "rice, dal, and vegetable curry".
   * Cleans natural language intent prefixes ("can you cook", "i want to prepare", "let's make", etc.)
   * Generates a dynamic structured recipe if dish is not found in static database.
   */
  static resolveQuery(query: string, availableRecipes: Recipe[]): RecipeResolutionResult {
    let text = query.trim().toLowerCase();
    if (!text) {
      return {
        recipe: availableRecipes[0] || null,
        matchedRecipes: availableRecipes[0] ? [availableRecipes[0]] : [],
        isAmbiguous: false
      };
    }

    // Strip leading natural language intent prefixes
    text = text.replace(/^(can you|i want to|let's|lets|please|could you|can we|how to|show me how to|show me|what ingredients are needed for|what spices do we need for|ingredients for|recipe for)\s+/i, '').trim();
    text = text.replace(/^(cook|make|prepare|start cooking|start)\s+/i, '').trim();

    // Split query by multi-dish conjunctions: " and ", " with ", ",", "&"
    const dishTokens = text
      .split(/\b(and|with)\b|[,&]/i)
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && t !== 'and' && t !== 'with');

    const matchedRecipeList: Recipe[] = [];
    let isAmbiguous = false;
    let ambiguousChoices: Recipe[] = [];
    let clarificationMessage = '';

    for (const token of dishTokens) {
      const cleanToken = token.replace(/^(cook|make|prepare|start|show|ingredients for|recipe for|this|the)\s+/i, '').trim();
      if (!cleanToken) continue;

      // Find candidates matching this token
      const matches = availableRecipes.filter((r) => {
        const titleLower = r.title.toLowerCase();
        return (
          titleLower === cleanToken ||
          titleLower.includes(cleanToken) ||
          cleanToken.includes(titleLower) ||
          IngredientUtils.areIngredientsMatching(r.title, cleanToken) ||
          r.ingredients.some((ing) => IngredientUtils.areIngredientsMatching(ing.name, cleanToken))
        );
      });

      if (matches.length === 1) {
        if (!matchedRecipeList.some((m) => m.id === matches[0].id)) {
          matchedRecipeList.push(matches[0]);
        }
      } else if (matches.length > 1) {
        // Check if one match is an exact or best title match
        const exactMatch = matches.find(
          (m) => m.title.toLowerCase() === cleanToken || m.title.toLowerCase().replace(/^(crispy|homestyle|restaurant style|spiced|aromatic|steamed)\s+/i, '') === cleanToken
        );

        if (exactMatch) {
          if (!matchedRecipeList.some((m) => m.id === exactMatch.id)) {
            matchedRecipeList.push(exactMatch);
          }
        } else {
          // If cleanToken specifies a specific main item (e.g. "potato curry" vs "chicken curry"), pick specific
          const specificMatch = matches.find((m) => {
            const t = m.title.toLowerCase();
            return cleanToken.split(/\s+/).every((word) => t.includes(word));
          });

          if (specificMatch) {
            if (!matchedRecipeList.some((m) => m.id === specificMatch.id)) {
              matchedRecipeList.push(specificMatch);
            }
          } else {
            // Ambiguous match (e.g., "curry" alone matches multiple curries)
            isAmbiguous = true;
            ambiguousChoices = matches;
            const titles = matches.map((m) => `"${m.title}"`).join(', ');
            clarificationMessage = `Multiple recipes matched "${cleanToken}": ${titles}. Which specific recipe would you like to prepare?`;
            break;
          }
        }
      } else {
        // No static match for this token: generate a realistic dynamic recipe on-the-fly!
        const dynamicRecipe = this.generateDynamicRecipe(cleanToken);
        matchedRecipeList.push(dynamicRecipe);
      }
    }

    if (isAmbiguous) {
      return {
        recipe: null,
        matchedRecipes: [],
        isAmbiguous: true,
        ambiguousChoices,
        clarificationMessage
      };
    }

    if (matchedRecipeList.length === 0) {
      const dynamic = this.generateDynamicRecipe(text);
      return {
        recipe: dynamic,
        matchedRecipes: [dynamic],
        isAmbiguous: false
      };
    }

    if (matchedRecipeList.length === 1) {
      return {
        recipe: matchedRecipeList[0],
        matchedRecipes: matchedRecipeList,
        isAmbiguous: false
      };
    }

    // Combine multiple distinct recipes into a composite menu recipe
    const combinedRecipe = this.combineRecipes(matchedRecipeList);
    return {
      recipe: combinedRecipe,
      matchedRecipes: matchedRecipeList,
      isAmbiguous: false
    };
  }

  /**
   * Generates a structured realistic recipe dynamically for unlisted custom dishes
   */
  static generateDynamicRecipe(dishName: string): Recipe {
    const formattedTitle = dishName
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    const mainIngredient = formattedTitle.replace(/\b(Curry|Masala|Fry|Dal|Soup|Gravy|Bake|Roast|Rice|Bowl)\b/gi, '').trim() || 'Vegetable';
    const mainKey = IngredientUtils.normalizeName(mainIngredient);

    const ingredients: RecipeIngredientItem[] = [
      { name: mainIngredient, amount: 500, unit: mainKey.includes('rice') ? 'g' : 'g', note: 'Cleaned and prepped' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'For cooking and tempering' },
      { name: 'Onion', amount: 150, unit: 'g', note: 'Finely sliced' },
      { name: 'Tomato', amount: 150, unit: 'g', note: 'Chopped' },
      { name: 'Ginger Garlic Paste', amount: 20, unit: 'g', note: 'Freshly ground' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit chillies' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'Seasoning to taste' },
      { name: 'Red Chilli Powder', amount: 6, unit: 'g', note: 'For warm spice' },
      { name: 'Turmeric Powder', amount: 4, unit: 'g', note: 'Golden spice' },
      { name: 'Cumin Seeds', amount: 3, unit: 'g', note: 'For aroma' },
      { name: 'Mustard Seeds', amount: 3, unit: 'g', note: 'For tempering' },
      { name: 'Curry Leaves', amount: 5, unit: 'g', note: 'Fresh leaves' },
      { name: 'Garam Masala', amount: 4, unit: 'g', note: 'Finishing spice' },
      { name: 'Water', amount: 300, unit: 'ml', note: 'For gravy simmer' }
    ];

    const instructions: RecipeInstructionStep[] = [
      { step: 1, text: `Prepare and cut 500 g ${mainIngredient} into uniform pieces.`, durationMinutes: 8, ingredientsUsed: [mainIngredient] },
      { step: 2, text: 'Heat 30 ml Cooking Oil in a wide pan. Add 3 g Mustard Seeds, 3 g Cumin Seeds, and 5 g Curry Leaves until they splutter.', durationMinutes: 3, ingredientsUsed: ['Cooking Oil', 'Mustard Seeds', 'Cumin Seeds', 'Curry Leaves'] },
      { step: 3, text: 'Add 150 g Onion, 10 g Green Chillies, and 20 g Ginger Garlic Paste; sauté until golden brown.', durationMinutes: 5, ingredientsUsed: ['Onion', 'Green Chillies', 'Ginger Garlic Paste'] },
      { step: 4, text: 'Add 150 g Tomato, 10 g Salt, 6 g Red Chilli Powder, and 4 g Turmeric Powder; cook until oil separates.', durationMinutes: 5, ingredientsUsed: ['Tomato', 'Salt', 'Red Chilli Powder', 'Turmeric Powder'] },
      { step: 5, text: `Add prepped ${mainIngredient} and 300 ml Water; cover and simmer on medium flame for 12 minutes.`, durationMinutes: 12, ingredientsUsed: [mainIngredient, 'Water'] },
      { step: 6, text: 'Stir in 4 g Garam Masala, simmer for 2 minutes, check seasoning, and serve hot.', durationMinutes: 2, ingredientsUsed: ['Garam Masala'] }
    ];

    return {
      id: `rec_dyn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: formattedTitle,
      description: `Chef-crafted authentic recipe for ${formattedTitle} featuring rich aromatics, balanced spices, and complete step-by-step instructions.`,
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      difficulty: 'Medium',
      category: 'Dinner',
      cuisine: 'Indian',
      dietaryTags: ['Gluten-Free', 'High-Flavor'],
      ingredients,
      instructions,
      nutrition: { calories: 380, protein: 18, carbs: 40, fat: 16 },
      colorGradient: 'linear-gradient(135deg, #ea580c 0%, #d97706 100%)',
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Combines multiple distinct recipes into a single structured composite recipe
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
          tip: inst.tip
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
      cuisine: 'Indian',
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
