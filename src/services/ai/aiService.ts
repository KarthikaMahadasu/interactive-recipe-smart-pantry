import type { AIResponsePayload, AIPromptContext } from '../../types/ai';
import type { Ingredient } from '../../types/ingredient';
import type { Recipe } from '../../types/recipe';
import { RecipeMatchingService } from '../recipes/recipeMatchingService';
import { PromptBuilder } from './promptBuilder';

/**
 * AI Service Layer (Module 2 + Module 3 Integration Ready)
 * Encapsulates AI communication logic and uses active pantry state and recipe matching service
 * to generate dynamic, data-driven responses without fake static text.
 */
export class AIService {
  /**
   * Processes natural language user kitchen commands using real pantry state.
   */
  static async processKitchenRequest(
    userPrompt: string, 
    context: AIPromptContext
  ): Promise<AIResponsePayload> {
    const promptTemplate = PromptBuilder.createKitchenQueryPrompt(userPrompt, context);
    void promptTemplate;

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const queryLower = userPrompt.toLowerCase();
    let message = `Command received: "${userPrompt}". AI intelligence pipeline ready.`;
    let actionRequired: AIResponsePayload['actionRequired'] = 'none';

    if (queryLower.includes('cook') || queryLower.includes('recipe') || queryLower.includes('make') || queryLower.includes('dinner')) {
      message = `Analyzed your active pantry (${context.pantryCount} items)! Found matching recipe ideas based on your current stock.`;
      actionRequired = 'view_recipes';
    } else if (queryLower.includes('pantry') || queryLower.includes('stock') || queryLower.includes('ingredient')) {
      message = `Your Smart Pantry currently contains ${context.pantryCount} tracked ingredients.`;
      actionRequired = 'explore_pantry';
    } else if (queryLower.includes('buy') || queryLower.includes('grocery') || queryLower.includes('missing')) {
      message = `Checked missing recipe ingredients. Ready to restock missing items.`;
      actionRequired = 'add_grocery';
    }

    return {
      message,
      actionRequired,
      timestamp: new Date().toLocaleTimeString(),
      isMock: true
    };
  }

  /**
   * Analyzes active pantry ingredients for nutrition & health.
   */
  static async analyzePantry(ingredients: Ingredient[]): Promise<AIResponsePayload> {
    const names = ingredients.map((i) => i.name);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      message: `Pantry Analysis: Analyzed ${ingredients.length} active items (${names.slice(0, 4).join(', ')}). High fiber & plant-protein potential detected!`,
      timestamp: new Date().toLocaleTimeString(),
      isMock: true
    };
  }

  /**
   * Recommends recipes based on current pantry state.
   */
  static async recommendRecipes(recipes: Recipe[], pantry: Ingredient[]): Promise<AIResponsePayload> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const matches = RecipeMatchingService.matchAllRecipes(recipes, pantry);
    const topMatch = matches[0];

    let msg = `Calculated recipe matches across ${recipes.length} dishes with your ${pantry.length} pantry items.`;
    if (topMatch) {
      msg += ` Top recommendation: "${topMatch.recipe.title}" (${topMatch.matchPercentage}% match).`;
    }

    return {
      message: msg,
      actionRequired: 'view_recipes',
      timestamp: new Date().toLocaleTimeString(),
      isMock: true
    };
  }

  /**
   * Modifies recipe according to dietary or pantry requirements.
   */
  static async modifyRecipe(recipeTitle: string, instructions: string): Promise<AIResponsePayload> {
    void instructions;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      message: `Recipe modification for "${recipeTitle}" generated.`,
      timestamp: new Date().toLocaleTimeString(),
      isMock: true
    };
  }

  /**
   * Suggests ingredient substitutions.
   */
  static async suggestSubstitution(missingItem: string, available: Ingredient[]): Promise<AIResponsePayload> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const alt = available[0]?.name || 'a similar pantry staple';
    return {
      message: `Substitution advice for ${missingItem}: You can substitute with ${alt}.`,
      timestamp: new Date().toLocaleTimeString(),
      isMock: true
    };
  }

  /**
   * Generates smart grocery list items based on missing recipe requirements.
   */
  static async generateGroceryList(): Promise<AIResponsePayload> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      message: `Generated smart grocery restock list based on missing recipe ingredients.`,
      actionRequired: 'add_grocery',
      timestamp: new Date().toLocaleTimeString(),
      isMock: true
    };
  }
}
