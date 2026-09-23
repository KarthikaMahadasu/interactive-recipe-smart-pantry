import type { AIPromptContext } from '../../types/ai';

export interface PromptTemplate {
  systemPrompt: string;
  userMessage: string;
  temperature: number;
}

export class PromptBuilder {
  static createPantryAnalysisPrompt(ingredients: string[]): PromptTemplate {
    return {
      systemPrompt: `You are the Master Culinary AI of the Smart Kitchen World. Analyze the user's available pantry items, check freshness, and identify potential flavor synergy.`,
      userMessage: `Current Pantry Ingredients: [${ingredients.join(', ')}]. Identify top pairs and recipe suggestions.`,
      temperature: 0.7
    };
  }

  static createRecipeRecommendationPrompt(ingredients: string[], dietary: string[] = []): PromptTemplate {
    return {
      systemPrompt: `You are an expert executive chef AI. Recommend top 3 balanced recipes using available ingredients with minimal waste. Format as JSON array.`,
      userMessage: `Available Ingredients: ${ingredients.join(', ')}. Dietary Preferences: ${dietary.join(', ')}.`,
      temperature: 0.8
    };
  }

  static createSubstitutionPrompt(missingItem: string, availableItems: string[]): PromptTemplate {
    return {
      systemPrompt: `You are a culinary chemist AI specializing in ingredient substitutions based on texture, moisture, and flavor profile.`,
      userMessage: `Missing Ingredient: "${missingItem}". Available Pantry: [${availableItems.join(', ')}]. Suggest suitable substitutes.`,
      temperature: 0.6
    };
  }

  static createKitchenQueryPrompt(userQuery: string, context: AIPromptContext): PromptTemplate {
    return {
      systemPrompt: `You are the Central Kitchen AI Assistant operating inside a spatial digital kitchen environment.
System Context: ${context.pantryCount} items in pantry. Active Zone: ${context.activeZone || 'Overview'}.
Provide helpful, concise culinary guidance.`,
      userMessage: userQuery,
      temperature: 0.7
    };
  }
}
