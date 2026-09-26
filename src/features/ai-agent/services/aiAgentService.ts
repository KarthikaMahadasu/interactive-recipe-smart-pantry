import { NLPParser } from '../parsers/nlpParser';
import type { AgentAction, AgentResponse } from '../types/agentTypes';
import type { Ingredient, IngredientCategory, FreshnessLevel } from '../../../types/ingredient';
import type { Recipe } from '../../../types/recipe';
import { RecipeMatchingService } from '../../../services/recipes/recipeMatchingService';

const CATEGORY_COLORS: Record<string, string> = {
  produce: '#10b981',
  dairy: '#38bdf8',
  meat: '#f43f5e',
  seafood: '#06b6d4',
  grain: '#a16207',
  spice: '#f59e0b',
  liquid: '#8b5cf6',
  canned: '#64748b',
  bakery: '#d97706',
  other: '#ec4899'
};

export interface AgentExecutionContext {
  pantry: Ingredient[];
  recipes: Recipe[];
  addIngredient: (ing: Ingredient) => void;
  updateIngredient: (ing: Ingredient) => void;
  removeIngredient: (id: string) => void;
  clearPantry: () => void;
  setSelectedRecipe: (id: string | null) => void;
  setAIState: (state: any) => void;
}

export class AIAgentService {
  /**
   * Main entry point: Parses user command and executes validated structured agent action.
   */
  static async executeUserCommand(
    command: string,
    context: AgentExecutionContext
  ): Promise<AgentResponse> {
    const timestamp = new Date().toLocaleTimeString();

    if (!command || !command.trim()) {
      return {
        message: 'Please type or speak a kitchen command.',
        intent: 'UNKNOWN',
        status: 'warning',
        timestamp
      };
    }

    // 1. NLP Parser Pipeline (Layers 1-4)
    const action: AgentAction = NLPParser.parse(command);

    // 2. Check for confirmation requirement
    if (action.requiresConfirmation) {
      return {
        message: action.confirmationMessage || `Are you sure you want to execute "${action.rawCommand}"?`,
        intent: action.intent,
        status: 'confirmation_required',
        pendingAction: action,
        timestamp
      };
    }

    // 3. Action Execution (Layer 5)
    return this.executeAction(action, context);
  }

  /**
   * Layer 5: Executes confirmed or validated AgentAction against real application state.
   */
  static executeAction(action: AgentAction, context: AgentExecutionContext): AgentResponse {
    const timestamp = new Date().toLocaleTimeString();
    const { pantry, recipes, addIngredient, removeIngredient, clearPantry, updateIngredient, setSelectedRecipe } = context;
    const params = action.parameters;

    switch (action.intent) {
      case 'ADD_PANTRY_ITEM': {
        if (!params.name) {
          return {
            message: 'Which ingredient would you like to add to your Smart Pantry?',
            intent: action.intent,
            status: 'warning',
            timestamp
          };
        }

        if (!params.quantity || isNaN(params.quantity) || params.quantity <= 0) {
          return {
            message: `How much ${params.name} would you like to add? Please specify quantity and unit (e.g. "Add 2 kg ${params.name}").`,
            intent: action.intent,
            status: 'warning',
            timestamp
          };
        }

        const itemName = params.name.charAt(0).toUpperCase() + params.name.slice(1);
        const qty = params.quantity;
        const unit = params.unit || 'pcs';
        const category = (params.category as IngredientCategory) || 'produce';

        // Check if item already exists in pantry
        const existing = pantry.find((p) => p.name.toLowerCase() === itemName.toLowerCase());
        if (existing) {
          const updatedQty = existing.quantity + qty;
          updateIngredient({
            ...existing,
            quantity: updatedQty,
            freshness: updatedQty > 0 ? 'fresh' : existing.freshness
          });

          return {
            message: `Updated stock: Added ${qty} ${unit} to existing ${existing.name}. New total quantity: ${updatedQty} ${existing.unit}.`,
            intent: action.intent,
            status: 'success',
            actionRequired: 'explore_pantry',
            timestamp
          };
        }

        const newIng: Ingredient = {
          id: `ing_agent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name: itemName,
          quantity: qty,
          unit,
          category,
          freshness: 'fresh' as FreshnessLevel,
          colorCode: CATEGORY_COLORS[category] || '#06b6d4',
          createdAt: new Date().toISOString()
        };

        addIngredient(newIng);

        return {
          message: `Added ${qty} ${unit} of ${itemName} to your Smart Pantry!`,
          intent: action.intent,
          status: 'success',
          actionRequired: 'explore_pantry',
          timestamp
        };
      }

      case 'REMOVE_PANTRY_ITEM': {
        if (!params.name) {
          return {
            message: 'Which ingredient would you like to remove from your Smart Pantry?',
            intent: action.intent,
            status: 'warning',
            timestamp
          };
        }

        const targetName = params.name.toLowerCase().trim();
        const existing = pantry.find((p) => p.name.toLowerCase().includes(targetName));

        if (!existing) {
          return {
            message: `Could not find "${params.name}" in your Smart Pantry.`,
            intent: action.intent,
            status: 'error',
            timestamp
          };
        }

        if (params.quantity && params.quantity > 0) {
          const newQty = Math.max(0, existing.quantity - params.quantity);
          if (newQty === 0) {
            removeIngredient(existing.id);
            return {
              message: `Used all remaining ${existing.quantity} ${existing.unit} of ${existing.name}. Removed item from active pantry.`,
              intent: action.intent,
              status: 'success',
              actionRequired: 'explore_pantry',
              timestamp
            };
          } else {
            updateIngredient({ ...existing, quantity: newQty });
            return {
              message: `Subtracted ${params.quantity} ${params.unit || existing.unit} of ${existing.name}. Remaining stock: ${newQty} ${existing.unit}.`,
              intent: action.intent,
              status: 'success',
              actionRequired: 'explore_pantry',
              timestamp
            };
          }
        }

        // Complete removal if no specific quantity mentioned
        removeIngredient(existing.id);
        return {
          message: `Removed ${existing.name} from your Smart Pantry.`,
          intent: action.intent,
          status: 'success',
          actionRequired: 'explore_pantry',
          timestamp
        };
      }

      case 'CLEAR_PANTRY': {
        clearPantry();
        return {
          message: 'Smart Pantry vault cleared completely.',
          intent: action.intent,
          status: 'success',
          actionRequired: 'explore_pantry',
          timestamp
        };
      }

      case 'GET_PANTRY': {
        if (pantry.length === 0) {
          return {
            message: 'Your Smart Pantry is currently empty. Add ingredients by typing commands like "Add 2 kg rice".',
            intent: action.intent,
            status: 'info',
            actionRequired: 'explore_pantry',
            timestamp
          };
        }

        const names = pantry.map((i) => `${i.name} (${i.quantity} ${i.unit})`).slice(0, 6);
        return {
          message: `Your Smart Pantry contains ${pantry.length} items: ${names.join(', ')}${pantry.length > 6 ? ' and more...' : '.'}`,
          intent: action.intent,
          status: 'info',
          actionRequired: 'explore_pantry',
          timestamp
        };
      }

      case 'CHECK_AVAILABILITY': {
        if (params.name) {
          const targetName = params.name.toLowerCase().trim();
          const item = pantry.find((p) => p.name.toLowerCase().includes(targetName));

          if (item && item.quantity > 0) {
            return {
              message: `Yes! You have ${item.quantity} ${item.unit} of ${item.name} available in your Smart Pantry.`,
              intent: action.intent,
              status: 'info',
              timestamp
            };
          } else {
            return {
              message: `No, "${params.name}" is currently out of stock or not in your pantry.`,
              intent: action.intent,
              status: 'warning',
              timestamp
            };
          }
        }

        return {
          message: `Check availability query received for active pantry stock.`,
          intent: action.intent,
          status: 'info',
          timestamp
        };
      }

      case 'FIND_RECIPES': {
        if (pantry.length === 0) {
          return {
            message: 'Your pantry is empty! Add ingredients first to discover matched recipes.',
            intent: action.intent,
            status: 'warning',
            actionRequired: 'explore_pantry',
            timestamp
          };
        }

        const matches = RecipeMatchingService.matchAllRecipes(recipes, pantry);
        const topMatch = matches[0];

        if (topMatch && topMatch.matchPercentage > 0) {
          return {
            message: `Found ${matches.length} recipes matched against your pantry stock! Top match: "${topMatch.recipe.title}" (${topMatch.matchPercentage}% match — ${topMatch.availableIngredients.length}/${topMatch.recipe.ingredients.length} available).`,
            intent: action.intent,
            status: 'success',
            actionRequired: 'view_recipes',
            timestamp
          };
        }

        return {
          message: 'No recipes matched your exact pantry items. Try adding ingredients or expanding your search.',
          intent: action.intent,
          status: 'info',
          actionRequired: 'view_recipes',
          timestamp
        };
      }

      case 'GET_MISSING_INGREDIENTS': {
        const rName = params.recipeName ? params.recipeName.toLowerCase().trim() : '';
        let recipe: Recipe | undefined = undefined;

        if (rName) {
          // 1. Try exact substring match on title
          recipe = recipes.find((r) => r.title.toLowerCase().includes(rName));

          // 2. Try keyword token match (e.g. "paneer", "curry")
          if (!recipe) {
            const keywords = rName.split(/\s+/).filter((k) => k.length > 2);
            recipe = recipes.find((r) => {
              const titleLower = r.title.toLowerCase();
              return keywords.some((kw) => titleLower.includes(kw));
            });
          }
        } else {
          // If no recipe name provided in prompt, default to first available
          recipe = recipes[0];
        }

        if (!recipe) {
          const available = recipes.map((r) => `"${r.title}"`).join(', ');
          return {
            message: `Could not find recipe matching "${params.recipeName || 'query'}". Catalog contains: ${available}.`,
            intent: action.intent,
            status: 'warning',
            timestamp
          };
        }

        const match = RecipeMatchingService.matchRecipe(recipe, pantry);
        if (match.missingIngredients.length === 0) {
          return {
            message: `You have 100% of required ingredients to prepare "${recipe.title}"!`,
            intent: action.intent,
            status: 'success',
            timestamp
          };
        }

        const missingText = match.missingIngredients
          .map((m) => `${m.recipeIngredient.name} (${m.recipeIngredient.amount} ${m.recipeIngredient.unit})`)
          .join(', ');

        return {
          message: `For "${recipe.title}", you are missing: ${missingText}.`,
          intent: action.intent,
          status: 'info',
          actionRequired: 'add_grocery',
          timestamp
        };
      }

      case 'GET_EXPIRING_ITEMS': {
        const expiring = pantry.filter(
          (i) => i.freshness === 'expiring_soon' || i.freshness === 'critical'
        );

        if (expiring.length === 0) {
          return {
            message: 'Good news! None of your active pantry items are expiring soon.',
            intent: action.intent,
            status: 'info',
            timestamp
          };
        }

        const list = expiring.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ');
        return {
          message: `Found ${expiring.length} item(s) expiring soon or critical: ${list}.`,
          intent: action.intent,
          status: 'warning',
          actionRequired: 'explore_pantry',
          timestamp
        };
      }

      case 'SUGGEST_SUBSTITUTION': {
        const target = params.name ? params.name.toLowerCase() : 'milk';

        if (target.includes('milk')) {
          return {
            message: 'Substitution advice for Milk: You can substitute with Soy milk, Almond milk, or Oat milk.',
            intent: action.intent,
            status: 'info',
            timestamp
          };
        } else if (target.includes('butter')) {
          return {
            message: 'Substitution advice for Butter: You can substitute with Olive oil, Ghee, or Coconut oil.',
            intent: action.intent,
            status: 'info',
            timestamp
          };
        } else if (target.includes('paneer') || target.includes('tofu')) {
          return {
            message: 'Substitution advice for Paneer / Tofu: They can substitute for each other 1-to-1 in curries and bowls.',
            intent: action.intent,
            status: 'info',
            timestamp
          };
        }

        return {
          message: `Substitution advice for "${target}": You can use a similar pantry staple from the same category.`,
          intent: action.intent,
          status: 'info',
          timestamp
        };
      }

      case 'START_COOKING': {
        const rName = params.recipeName ? params.recipeName.toLowerCase().trim() : '';
        let recipe: Recipe | undefined = undefined;

        if (rName) {
          recipe = recipes.find((r) => r.title.toLowerCase().includes(rName));
          if (!recipe) {
            const keywords = rName.split(/\s+/).filter((k) => k.length > 2);
            recipe = recipes.find((r) => {
              const titleLower = r.title.toLowerCase();
              return keywords.some((kw) => titleLower.includes(kw));
            });
          }
        }

        if (recipe) {
          setSelectedRecipe(recipe.id);
          return {
            message: `Selected "${recipe.title}" for guided cooking!`,
            intent: action.intent,
            status: 'success',
            actionRequired: 'start_cooking',
            timestamp
          };
        }

        const available = recipes.map((r) => `"${r.title}"`).join(', ');
        return {
          message: `Could not find recipe matching "${params.recipeName || 'query'}". Available recipes: ${available}. Please select one from Recipe Discovery to start cooking.`,
          intent: action.intent,
          status: 'warning',
          actionRequired: 'view_recipes',
          timestamp
        };
      }

      case 'HELP': {
        return {
          message: 'Supported AI Agent commands: "Add 2 kg rice", "Remove 500 g rice", "What can I cook?", "What am I missing for paneer curry?", "Do I have enough rice?", "What is expiring soon?", "What can I substitute for milk?".',
          intent: action.intent,
          status: 'info',
          timestamp
        };
      }

      default: {
        return {
          message: `Command parsed as intent "${action.intent}". You can ask me to add/remove ingredients, find recipes, or check pantry stock!`,
          intent: action.intent,
          status: 'info',
          timestamp
        };
      }
    }
  }
}
