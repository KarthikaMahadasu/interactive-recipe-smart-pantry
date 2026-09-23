import type { AIResponsePayload, AIPromptContext } from '../../types/ai';
import type { Ingredient } from '../../types/ingredient';
import { PromptBuilder } from './promptBuilder';

/**
 * AI Service Layer
 * Encapsulates AI communication logic. In Module 1, methods simulate asynchronous AI processing 
 * while emitting structured prompt payloads ready for future backend/LLM integrations.
 */
export class AIService {
  /**
   * Processes natural language user kitchen commands.
   */
  static async processKitchenRequest(
    userPrompt: string, 
    context: AIPromptContext
  ): Promise<AIResponsePayload> {
    const promptTemplate = PromptBuilder.createKitchenQueryPrompt(userPrompt, context);
    void promptTemplate;

    // Simulate async network latency for realistic AI feel
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const queryLower = userPrompt.toLowerCase();
    let message = `I received your command: "${userPrompt}". [Module 1 Dev Preview: Real LLM model pipeline will process this in future modules]`;
    let actionRequired: AIResponsePayload['actionRequired'] = 'none';

    if (queryLower.includes('cook') || queryLower.includes('recipe')) {
      message = `Analyzed ${context.pantryCount} ingredients! Based on your current pantry items (like Dragon Fruit, Paneer, Hass Avocado), I recommend trying a Fresh Protein Power Bowl or Cashew Porridge!`;
      actionRequired = 'view_recipes';
    } else if (queryLower.includes('pantry') || queryLower.includes('stock')) {
      message = `Your pantry is looking fresh with ${context.pantryCount} active dynamic ingredients. Would you like to log new stock or check expiring items?`;
      actionRequired = 'explore_pantry';
    } else if (queryLower.includes('buy') || queryLower.includes('grocery') || queryLower.includes('missing')) {
      message = `I can help populate your smart grocery list based on missing recipe items.`;
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
   * Analyzes active pantry ingredients for nutrition & flavor pairings.
   */
  static async analyzePantry(ingredients: Ingredient[]): Promise<AIResponsePayload> {
    const names = ingredients.map((i) => i.name);
    const prompt = PromptBuilder.createPantryAnalysisPrompt(names);
    void prompt;

    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      message: `Pantry Analysis Complete: Found high fiber & plant-protein potential across ${ingredients.length} items (${names.slice(0, 3).join(', ')}).`,
      timestamp: new Date().toLocaleTimeString(),
      isMock: true
    };
  }

  /**
   * Recommends recipes based on current ingredients.
   */
  static async recommendRecipes(ingredients: Ingredient[]): Promise<AIResponsePayload> {
    void ingredients;
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      message: `Recipe Engine Generated 3 optimized dishes matching your ingredients with 0% food waste potential.`,
      actionRequired: 'view_recipes',
      timestamp: new Date().toLocaleTimeString(),
      isMock: true
    };
  }

  /**
   * Suggests ingredient substitutions.
   */
  static async suggestSubstitution(missingItem: string, available: Ingredient[]): Promise<AIResponsePayload> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      message: `Substitution advice for ${missingItem}: You can substitute with ${available[0]?.name || 'a similar pantry staple'}.`,
      timestamp: new Date().toLocaleTimeString(),
      isMock: true
    };
  }

  /**
   * Generates smart grocery list items.
   */
  static async generateGroceryList(): Promise<AIResponsePayload> {
    await new Promise((resolve) => setTimeout(resolve, 1100));
    return {
      message: `Generated smart grocery restock list based on low inventory thresholds.`,
      actionRequired: 'add_grocery',
      timestamp: new Date().toLocaleTimeString(),
      isMock: true
    };
  }
}
