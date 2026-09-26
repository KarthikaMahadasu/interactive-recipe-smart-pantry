import { NLPParser } from '../parsers/nlpParser';
import type { AgentAction, AgentResponse, AgentDebugInfo } from '../types/agentTypes';
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

const EXTENDED_SUBSTITUTIONS: Record<string, string[]> = {
  milk: ['Soy milk', 'Almond milk', 'Oat milk', 'Coconut milk', 'Greek yogurt'],
  butter: ['Ghee', 'Olive oil', 'Coconut oil', 'Avocado oil'],
  paneer: ['Tofu', 'Ricotta cheese', 'Halloumi'],
  tofu: ['Paneer', 'Tempeh', 'Seitan'],
  rice: ['Quinoa', 'Millet', 'Cauliflower rice'],
  chicken: ['Tofu', 'Paneer', 'Mushrooms', 'Seitan'],
  'olive oil': ['Vegetable oil', 'Coconut oil', 'Butter', 'Ghee'],
  sugar: ['Honey', 'Maple syrup', 'Jaggery', 'Stevia'],
  egg: ['Flax egg', 'Chia egg', 'Applesauce', 'Silken tofu'],
  tomato: ['Tomato paste', 'Canned tomatoes', 'Red bell pepper'],
  tomatoes: ['Tomato paste', 'Canned tomatoes', 'Red bell pepper'],
  cream: ['Coconut cream', 'Cashew cream', 'Greek yogurt'],
  flour: ['Almond flour', 'Oat flour', 'Rice flour', 'Ragi flour'],
  potato: ['Sweet potato', 'Cauliflower', 'Yam'],
  potatoes: ['Sweet potato', 'Cauliflower', 'Yam'],
  avocado: ['Guacamole', 'Greek yogurt', 'Hummus'],
  cashew: ['Almond', 'Walnut', 'Sunflower seeds'],
  cashews: ['Almond', 'Walnut', 'Sunflower seeds']
};

export interface AgentExecutionContext {
  pantry: Ingredient[];
  recipes: Recipe[];
  activeCookingRecipe?: Recipe | null;
  addIngredient: (ing: Ingredient) => void;
  updateIngredient: (ing: Ingredient) => void;
  removeIngredient: (id: string) => void;
  clearPantry: () => void;
  setSelectedRecipe: (id: string | null) => void;
  startCooking?: (recipe: Recipe) => void;
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
      const debugInfo: AgentDebugInfo = {
        userInput: command,
        intent: action.intent,
        entities: action.parameters,
        validation: {
          passed: false,
          reason: action.confirmationMessage
        },
        action: action.intent,
        resultStatus: 'confirmation_required',
        resultMessage: action.confirmationMessage || 'Confirmation required'
      };

      return {
        message: action.confirmationMessage || `Are you sure you want to execute "${action.rawCommand}"?`,
        intent: action.intent,
        status: 'confirmation_required',
        pendingAction: action,
        debugInfo,
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
    const {
      pantry,
      recipes,
      activeCookingRecipe,
      addIngredient,
      removeIngredient,
      clearPantry,
      updateIngredient,
      setSelectedRecipe,
      startCooking
    } = context;
    const params = action.parameters;

    let responseMessage = '';
    let responseStatus: AgentResponse['status'] = 'info';
    let actionRequired: AgentResponse['actionRequired'] = 'none';
    let responseData: Record<string, unknown> | undefined = undefined;

    switch (action.intent) {
      case 'ADD_PANTRY_ITEM': {
        if (!params.name) {
          responseMessage = 'Which ingredient would you like to add to your Smart Pantry?';
          responseStatus = 'warning';
          break;
        }

        const qty = params.quantity && params.quantity > 0 ? params.quantity : 1;
        const unit = params.unit || 'pcs';
        const itemName = this.formatIngredientName(params.name);
        const category = this.inferCategory(itemName);

        // Check if item already exists in pantry (case-insensitive)
        const existing = pantry.find(
          (p) => p.name.toLowerCase() === itemName.toLowerCase() || p.name.toLowerCase().includes(params.name!.toLowerCase())
        );

        if (existing) {
          // Convert units if necessary for addition
          const convertedAddQty = this.convertQuantity(qty, unit, existing.unit);
          const updatedQty = Math.round((existing.quantity + convertedAddQty) * 100) / 100;

          updateIngredient({
            ...existing,
            quantity: updatedQty,
            freshness: 'fresh'
          });

          responseMessage = `Updated stock: Added ${qty} ${unit} to existing ${existing.name}. New total quantity: ${updatedQty} ${existing.unit}.`;
          responseStatus = 'success';
          actionRequired = 'explore_pantry';
        } else {
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

          responseMessage = `Added ${qty} ${unit} of ${itemName} to your Smart Pantry!`;
          responseStatus = 'success';
          actionRequired = 'explore_pantry';
        }
        break;
      }

      case 'REMOVE_PANTRY_ITEM': {
        if (!params.name) {
          responseMessage = 'Which ingredient would you like to remove from your Smart Pantry?';
          responseStatus = 'warning';
          break;
        }

        const targetName = params.name.toLowerCase().trim();
        const existing = pantry.find(
          (p) => p.name.toLowerCase() === targetName || p.name.toLowerCase().includes(targetName) || targetName.includes(p.name.toLowerCase())
        );

        if (!existing) {
          responseMessage = `Could not find "${params.name}" in your Smart Pantry.`;
          responseStatus = 'error';
          break;
        }

        if (params.quantity && params.quantity > 0) {
          const requestedUnit = params.unit || existing.unit;
          const convertedRemoveQty = this.convertQuantity(params.quantity, requestedUnit, existing.unit);

          if (convertedRemoveQty > existing.quantity) {
            responseMessage = `You have only ${existing.quantity} ${existing.unit} of ${existing.name}, but you requested to remove ${params.quantity} ${requestedUnit}. I cannot remove ${params.quantity} ${requestedUnit}.`;
            responseStatus = 'warning';
            break;
          }

          const newQty = Math.round((existing.quantity - convertedRemoveQty) * 100) / 100;
          if (newQty <= 0) {
            removeIngredient(existing.id);
            responseMessage = `Used all remaining ${existing.quantity} ${existing.unit} of ${existing.name}. Removed item from active pantry.`;
          } else {
            updateIngredient({ ...existing, quantity: newQty });
            responseMessage = `Removed ${params.quantity} ${requestedUnit} of ${existing.name}. Remaining stock: ${newQty} ${existing.unit}.`;
          }
          responseStatus = 'success';
          actionRequired = 'explore_pantry';
        } else {
          removeIngredient(existing.id);
          responseMessage = `Removed ${existing.name} from your Smart Pantry.`;
          responseStatus = 'success';
          actionRequired = 'explore_pantry';
        }
        break;
      }

      case 'UPDATE_PANTRY_ITEM': {
        if (!params.name) {
          responseMessage = 'Which ingredient would you like to update?';
          responseStatus = 'warning';
          break;
        }
        const targetName = params.name.toLowerCase().trim();
        const existing = pantry.find(
          (p) => p.name.toLowerCase() === targetName || p.name.toLowerCase().includes(targetName)
        );

        if (!existing) {
          responseMessage = `Could not find "${params.name}" in your Smart Pantry to update.`;
          responseStatus = 'error';
          break;
        }

        const newQty = params.quantity !== undefined ? params.quantity : existing.quantity;
        const newUnit = params.unit || existing.unit;
        updateIngredient({ ...existing, quantity: newQty, unit: newUnit });

        responseMessage = `Updated ${existing.name} stock to ${newQty} ${newUnit}.`;
        responseStatus = 'success';
        actionRequired = 'explore_pantry';
        break;
      }

      case 'CLEAR_PANTRY': {
        clearPantry();
        responseMessage = 'Smart Pantry vault cleared completely.';
        responseStatus = 'success';
        actionRequired = 'explore_pantry';
        break;
      }

      case 'GET_PANTRY': {
        if (pantry.length === 0) {
          responseMessage = 'Your Smart Pantry is currently empty. Add ingredients by typing commands like "Add 2 kg rice" or "Add 500 g paneer".';
          responseStatus = 'info';
          actionRequired = 'explore_pantry';
          break;
        }

        const itemsList = pantry.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ');
        responseMessage = `Your Smart Pantry currently contains ${pantry.length} ingredient(s): ${itemsList}.`;
        responseStatus = 'info';
        actionRequired = 'explore_pantry';
        responseData = { items: pantry };
        break;
      }

      case 'GET_PANTRY_ITEM': {
        if (!params.name) {
          responseMessage = 'Which ingredient would you like to check? (e.g. "How much rice do I have?")';
          responseStatus = 'warning';
          break;
        }

        const targetName = params.name.toLowerCase().trim();
        const existing = pantry.find(
          (p) => p.name.toLowerCase() === targetName || p.name.toLowerCase().includes(targetName) || targetName.includes(p.name.toLowerCase())
        );

        if (existing && existing.quantity > 0) {
          responseMessage = `You currently have ${existing.quantity} ${existing.unit} of ${existing.name} in your Smart Pantry.`;
          responseStatus = 'info';
        } else {
          responseMessage = `You don't currently have any ${params.name} in your Smart Pantry.`;
          responseStatus = 'warning';
        }
        break;
      }

      case 'CHECK_AVAILABILITY': {
        if (!params.name) {
          responseMessage = 'Which ingredient would you like to verify in your pantry?';
          responseStatus = 'warning';
          break;
        }

        const targetName = params.name.toLowerCase().trim();
        const item = pantry.find(
          (p) => p.name.toLowerCase() === targetName || p.name.toLowerCase().includes(targetName) || targetName.includes(p.name.toLowerCase())
        );

        if (item && item.quantity > 0) {
          if (params.quantity && params.quantity > 0) {
            const reqUnit = params.unit || item.unit;
            const convertedReqQty = this.convertQuantity(params.quantity, reqUnit, item.unit);

            if (item.quantity >= convertedReqQty) {
              responseMessage = `Yes! You have ${item.quantity} ${item.unit} of ${item.name} in your pantry, which is enough for your requested ${params.quantity} ${reqUnit}.`;
              responseStatus = 'success';
            } else {
              const diff = Math.round((convertedReqQty - item.quantity) * 100) / 100;
              responseMessage = `You have only ${item.quantity} ${item.unit} of ${item.name} in your pantry, but requested ${params.quantity} ${reqUnit}. You are short by ${diff} ${item.unit}.`;
              responseStatus = 'warning';
            }
          } else {
            responseMessage = `Yes! You have ${item.quantity} ${item.unit} of ${item.name} available in your Smart Pantry.`;
            responseStatus = 'success';
          }
        } else {
          responseMessage = `No, "${params.name}" is not currently in your Smart Pantry.`;
          responseStatus = 'warning';
        }
        break;
      }

      case 'FIND_RECIPES': {
        if (pantry.length === 0) {
          responseMessage = 'Your pantry is empty! Add ingredients first to discover matched recipes.';
          responseStatus = 'warning';
          actionRequired = 'explore_pantry';
          break;
        }

        const matches = RecipeMatchingService.matchAllRecipes(recipes, pantry);
        const cookable = matches.filter((m) => m.matchPercentage > 0);

        if (cookable.length > 0) {
          const recipeList = cookable
            .slice(0, 4)
            .map((m, i) => `${i + 1}. ${m.recipe.title} (${m.matchPercentage}% match — ${m.availableIngredients.length}/${m.recipe.ingredients.length} available)`)
            .join('\n');

          responseMessage = `Based on your current pantry, you can make:\n\n${recipeList}`;
          responseStatus = 'success';
          actionRequired = 'view_recipes';
        } else {
          responseMessage = 'No recipes matched your current pantry stock. Try adding more ingredients to your pantry.';
          responseStatus = 'info';
          actionRequired = 'view_recipes';
        }
        break;
      }

      case 'FIND_RECIPES_BY_INGREDIENT': {
        if (!params.name) {
          responseMessage = 'Which ingredient would you like to search recipes for? (e.g. "Find recipes using paneer")';
          responseStatus = 'warning';
          break;
        }

        const targetIng = params.name.toLowerCase().trim();
        const matchingRecipes = recipes.filter((r) =>
          r.ingredients.some((ing) => ing.name.toLowerCase().includes(targetIng) || targetIng.includes(ing.name.toLowerCase()))
        );

        if (matchingRecipes.length > 0) {
          const matches = RecipeMatchingService.matchAllRecipes(matchingRecipes, pantry);
          const list = matches
            .map((m, i) => `${i + 1}. ${m.recipe.title} (${m.matchPercentage}% pantry match)`)
            .join('\n');

          responseMessage = `Found ${matchingRecipes.length} recipe(s) containing "${params.name}":\n\n${list}`;
          responseStatus = 'success';
          actionRequired = 'view_recipes';
        } else {
          responseMessage = `No recipes in our catalog contain "${params.name}". Catalog contains: ${recipes.map((r) => `"${r.title}"`).join(', ')}.`;
          responseStatus = 'info';
          actionRequired = 'view_recipes';
        }
        break;
      }

      case 'GET_MISSING_INGREDIENTS': {
        const rQuery = params.recipeName ? params.recipeName.toLowerCase().trim() : '';
        let targetRecipe: Recipe | undefined = undefined;

        if (rQuery) {
          targetRecipe = recipes.find((r) => r.title.toLowerCase().includes(rQuery));
          if (!targetRecipe) {
            const keywords = rQuery.split(/\s+/).filter((k) => k.length > 2);
            targetRecipe = recipes.find((r) => {
              const titleLower = r.title.toLowerCase();
              return keywords.some((kw) => titleLower.includes(kw));
            });
          }
        } else {
          targetRecipe = recipes[0];
        }

        if (!targetRecipe) {
          const availableTitles = recipes.map((r) => `"${r.title}"`).join(', ');
          responseMessage = `Could not find recipe matching "${params.recipeName || 'query'}". Catalog contains: ${availableTitles}.`;
          responseStatus = 'warning';
          break;
        }

        const match = RecipeMatchingService.matchRecipe(targetRecipe, pantry);
        if (match.missingIngredients.length === 0) {
          responseMessage = `You have 100% of required ingredients to prepare "${targetRecipe.title}"!`;
          responseStatus = 'success';
        } else {
          const missingItemsText = match.missingIngredients
            .map((m) => `${m.recipeIngredient.name} (${m.recipeIngredient.amount} ${m.recipeIngredient.unit})`)
            .join(', ');

          responseMessage = `For "${targetRecipe.title}", you are missing: ${missingItemsText}.`;
          responseStatus = 'info';
          actionRequired = 'add_grocery';
        }
        break;
      }

      case 'GET_EXPIRING_ITEMS': {
        const expiring = pantry.filter(
          (i) => i.freshness === 'expiring_soon' || i.freshness === 'critical'
        );

        if (expiring.length === 0) {
          responseMessage = 'All your pantry ingredients are fresh! None are expiring soon.';
          responseStatus = 'info';
          actionRequired = 'explore_pantry';
        } else {
          const list = expiring.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ');
          responseMessage = `Found ${expiring.length} item(s) expiring soon: ${list}.`;
          responseStatus = 'warning';
          actionRequired = 'explore_pantry';
        }
        break;
      }

      case 'SUGGEST_SUBSTITUTION': {
        const targetName = params.name ? params.name.toLowerCase().trim() : '';

        if (!targetName) {
          responseMessage = 'Which ingredient would you like a substitution for? (e.g. "What can I use instead of milk?")';
          responseStatus = 'warning';
          break;
        }

        const subs = EXTENDED_SUBSTITUTIONS[targetName];
        if (subs && subs.length > 0) {
          // Check if any substitute is available in user's active pantry
          const inPantrySub = pantry.find((p) =>
            subs.some((s) => p.name.toLowerCase().includes(s.toLowerCase()))
          );

          if (inPantrySub) {
            responseMessage = `Substitution advice for ${this.formatIngredientName(targetName)}: You can substitute with ${subs.join(', ')}. (Tip: You already have ${inPantrySub.name} in your Smart Pantry!)`;
          } else {
            responseMessage = `Substitution advice for ${this.formatIngredientName(targetName)}: You can substitute with ${subs.join(', ')}.`;
          }
          responseStatus = 'info';
        } else {
          responseMessage = `I don't currently have a suitable substitution for "${targetName}" in my culinary dataset. Try using a similar staple in the same food category.`;
          responseStatus = 'info';
        }
        break;
      }

      case 'START_COOKING': {
        const rQuery = params.recipeName ? params.recipeName.toLowerCase().trim() : '';
        let targetRecipe: Recipe | undefined = undefined;

        if (rQuery) {
          targetRecipe = recipes.find((r) => r.title.toLowerCase().includes(rQuery));
          if (!targetRecipe) {
            const keywords = rQuery.split(/\s+/).filter((k) => k.length > 2);
            targetRecipe = recipes.find((r) => {
              const titleLower = r.title.toLowerCase();
              return keywords.some((kw) => titleLower.includes(kw));
            });
          }
        }

        if (!targetRecipe && recipes.length > 0) {
          targetRecipe = recipes[0];
        }

        if (targetRecipe) {
          setSelectedRecipe(targetRecipe.id);
          if (startCooking) {
            startCooking(targetRecipe);
          }
          responseMessage = `Selected "${targetRecipe.title}" for guided cooking! Opening Cooking Studio...`;
          responseStatus = 'success';
          actionRequired = 'start_cooking';
        } else {
          responseMessage = 'No recipes available to cook. Add recipes first!';
          responseStatus = 'warning';
        }
        break;
      }

      case 'GET_COOKING_STATUS': {
        if (activeCookingRecipe) {
          responseMessage = `Currently cooking "${activeCookingRecipe.title}".`;
          responseStatus = 'info';
          actionRequired = 'start_cooking';
        } else {
          responseMessage = 'No active cooking session right now. Say "Start cooking" or select a recipe to begin.';
          responseStatus = 'info';
        }
        break;
      }

      case 'GET_RECIPE_DETAILS': {
        const rQuery = params.recipeName ? params.recipeName.toLowerCase().trim() : '';
        let targetRecipe = recipes.find((r) => r.title.toLowerCase().includes(rQuery));

        if (!targetRecipe && recipes.length > 0) {
          targetRecipe = recipes[0];
        }

        if (targetRecipe) {
          responseMessage = `Recipe: "${targetRecipe.title}" | Prep: ${targetRecipe.prepTime}m | Cook: ${targetRecipe.cookTime}m | Servings: ${targetRecipe.servings} | Ingredients: ${targetRecipe.ingredients.length} items.`;
          responseStatus = 'info';
          actionRequired = 'view_recipes';
        } else {
          responseMessage = `Could not find details for recipe "${params.recipeName || 'query'}".`;
          responseStatus = 'warning';
        }
        break;
      }

      case 'HELP': {
        responseMessage = `I can help you with:\n\n• Add or remove pantry ingredients (e.g. "Add 2 kg rice", "Remove 500 g paneer")\n• Check pantry quantities (e.g. "How much rice do I have?", "Do I have paneer?")\n• Find recipes (e.g. "What can I cook?", "Find recipes using paneer")\n• Check missing ingredients (e.g. "What am I missing for Paneer Curry?")\n• Expiry scan (e.g. "What is expiring soon?")\n• Suggest substitutions (e.g. "What can I use instead of milk?")\n• Guided cooking (e.g. "Start cooking Paneer Curry")`;
        responseStatus = 'info';
        break;
      }

      default: {
        responseMessage = `I am your Kitchen AI Assistant. I can help you with pantry management, recipe discovery, ingredients, cooking, and substitutions.`;
        responseStatus = 'info';
        break;
      }
    }

    const debugInfo: AgentDebugInfo = {
      userInput: action.rawCommand,
      intent: action.intent,
      entities: params,
      validation: {
        passed: true
      },
      action: action.intent,
      resultStatus: responseStatus,
      resultMessage: responseMessage
    };

    return {
      message: responseMessage,
      intent: action.intent,
      status: responseStatus,
      data: responseData,
      actionRequired,
      debugInfo,
      timestamp
    };
  }

  /**
   * Helper to format ingredient names neatly (e.g. "dragon fruit" -> "Dragon Fruit").
   */
  private static formatIngredientName(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Helper to infer ingredient category dynamically from name.
   */
  private static inferCategory(name: string): IngredientCategory {
    const n = name.toLowerCase();
    if (/fruit|apple|banana|mango|avocado|dragon|berry|tomato|potato|onion|garlic|lemon|orange|spinach|carrot|lettuce|cucumber|pepper/i.test(n)) {
      return 'produce';
    }
    if (/milk|paneer|curd|yogurt|cheese|butter|cream|tofu/i.test(n)) {
      return 'dairy';
    }
    if (/rice|wheat|ragi|millet|quinoa|flour|oats|grain|noodle|pasta|bread/i.test(n)) {
      return 'grain';
    }
    if (/chicken|mutton|beef|pork|turkey|meat|sausage|bacon/i.test(n)) {
      return 'meat';
    }
    if (/fish|shrimp|salmon|prawn|tuna|seafood/i.test(n)) {
      return 'seafood';
    }
    if (/salt|spices|spice|turmeric|cumin|pepper|chili|cardamom|clove|sugar|jaggery/i.test(n)) {
      return 'spice';
    }
    if (/oil|vinegar|sauce|juice|water/i.test(n)) {
      return 'liquid';
    }
    if (/cashew|almond|walnut|nut|peanut/i.test(n)) {
      return 'other';
    }
    return 'produce';
  }

  /**
   * Converts quantity between common metric units.
   */
  private static convertQuantity(amount: number, fromUnit: string, toUnit: string): number {
    const from = fromUnit.toLowerCase();
    const to = toUnit.toLowerCase();

    if (from === to) return amount;

    // Weight conversions: kg <-> g
    if (from === 'kg' && to === 'g') return amount * 1000;
    if (from === 'g' && to === 'kg') return amount / 1000;

    // Volume conversions: L <-> ml
    if ((from === 'l' || from === 'litre' || from === 'liter') && to === 'ml') return amount * 1000;
    if (from === 'ml' && (to === 'l' || to === 'litre' || to === 'liter')) return amount / 1000;

    return amount;
  }
}
