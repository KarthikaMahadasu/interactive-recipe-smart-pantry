import { NLPParser, type AgentConversationContext } from '../parsers/nlpParser';
import type { AgentAction, AgentResponse, AgentDebugInfo } from '../types/agentTypes';
import type { Ingredient, IngredientCategory, FreshnessLevel } from '../../../types/ingredient';
import type { Recipe } from '../../../types/recipe';
import type { User, Restaurant } from '../../../types/auth';
import type { InventoryTransaction } from '../../inventory/types/transactionTypes';
import type { SmartGroceryItem } from '../../grocery/types/groceryTypes';
import { GroceryService } from '../../grocery/services/groceryService';

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
  groceryList?: SmartGroceryItem[];
  transactions?: InventoryTransaction[];
  activeCookingRecipe?: Recipe | null;
  addIngredient: (ing: Ingredient) => void;
  updateIngredient: (ing: Ingredient) => void;
  removeIngredient: (id: string) => void;
  clearPantry: () => void;
  recordUsage?: (itemId: string, quantity: number, unit: string, reason: string) => void;
  recordWaste?: (itemId: string, quantity: number, unit: string, reason: string) => void;
  adjustStock?: (itemId: string, actualQuantity: number, reason: string) => void;
  addGroceryItem?: (item: SmartGroceryItem) => void;
  markGroceryPurchased?: (id: string) => void;
  receiveGroceryDelivery?: (groceryId: string, receivedQuantity: number) => void;
  setSelectedRecipe: (id: string | null) => void;
  startCooking?: (recipe: Recipe) => void;
  finishCookingDeduction?: (recipe: Recipe) => void;
  setAIState: (state: any) => void;
  user?: User | null;
  restaurant?: Restaurant | null;
}

export class AIAgentService {
  private static memory: AgentConversationContext = {};

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

    const action: AgentAction = NLPParser.parse(command, this.memory);
    const { pantry, groceryList = [] } = context;
    const params = action.parameters;

    // Requirement: Handle ambiguous commands cleanly
    if (
      action.intent === 'RECORD_USAGE' ||
      action.intent === 'RECORD_WASTE' ||
      action.intent === 'ADJUST_STOCK' ||
      action.intent === 'ADD_PANTRY_ITEM' ||
      action.intent === 'REMOVE_PANTRY_ITEM' ||
      action.intent === 'ADD_GROCERY_ITEM' ||
      action.intent === 'RECEIVE_GROCERY'
    ) {
      if (!params.name) {
        return {
          message: `Which item would you like to process? Please specify the ingredient name.`,
          intent: action.intent,
          status: 'warning',
          timestamp
        };
      }
      if (
        (action.intent === 'RECORD_USAGE' || action.intent === 'RECORD_WASTE' || action.intent === 'REMOVE_PANTRY_ITEM') &&
        (!params.quantity || params.quantity <= 0)
      ) {
        return {
          message: `How much ${params.name} would you like to process? Please specify quantity and unit.`,
          intent: action.intent,
          status: 'warning',
          timestamp
        };
      }
      if (action.intent === 'ADJUST_STOCK' && (params.quantity === undefined || params.quantity < 0)) {
        return {
          message: `Please specify the actual physical quantity for ${params.name} (e.g. "Physical rice stock is 18 kg").`,
          intent: action.intent,
          status: 'warning',
          timestamp
        };
      }
    }

    // Format real state confirmation prompts for significant actions
    let confirmationMsg = '';
    let needsConfirmation = false;

    if (action.intent === 'RECORD_USAGE' && params.name && params.quantity) {
      const target = pantry.find((p) => p.name.toLowerCase().includes(params.name!.toLowerCase()));
      if (target) {
        const qty = params.quantity;
        const reqUnit = params.unit || target.unit;
        const converted = this.convertQuantity(qty, reqUnit, target.unit);
        const newQty = Math.max(0, target.quantity - converted);
        confirmationMsg = `CONFIRM INVENTORY UPDATE\n\n${target.name}\nCurrent: ${target.quantity} ${target.unit}\nUsage: ${qty} ${reqUnit}\nNew quantity: ${newQty} ${target.unit}`;
        needsConfirmation = true;
      }
    } else if (action.intent === 'RECORD_WASTE' && params.name && params.quantity) {
      const target = pantry.find((p) => p.name.toLowerCase().includes(params.name!.toLowerCase()));
      if (target) {
        const qty = params.quantity;
        const reqUnit = params.unit || target.unit;
        const converted = this.convertQuantity(qty, reqUnit, target.unit);
        const newQty = Math.max(0, target.quantity - converted);
        confirmationMsg = `CONFIRM INVENTORY WASTE\n\n${target.name}\nCurrent: ${target.quantity} ${target.unit}\nWaste: ${qty} ${reqUnit}\nNew quantity: ${newQty} ${target.unit}`;
        needsConfirmation = true;
      }
    } else if (action.intent === 'ADJUST_STOCK' && params.name && params.quantity !== undefined) {
      const target = pantry.find((p) => p.name.toLowerCase().includes(params.name!.toLowerCase()));
      if (target) {
        const diff = params.quantity - target.quantity;
        confirmationMsg = `CONFIRM STOCK ADJUSTMENT\n\n${target.name}\nSystem quantity: ${target.quantity} ${target.unit}\nPhysical quantity: ${params.quantity} ${target.unit}\nDifference: ${diff >= 0 ? '+' : ''}${diff} ${target.unit}`;
        needsConfirmation = true;
      }
    } else if (action.intent === 'RECEIVE_GROCERY' && params.name) {
      const targetG = groceryList.find((g) => g.name.toLowerCase().includes(params.name!.toLowerCase()));
      const targetP = pantry.find((p) => p.name.toLowerCase().includes(params.name!.toLowerCase()));
      const prevQty = targetP ? targetP.quantity : 0;
      const unit = params.unit || targetG?.unit || targetP?.unit || 'pcs';
      const qty = params.quantity || targetG?.quantity || 1;
      const newQty = prevQty + qty;
      confirmationMsg = `CONFIRM DELIVERY RECEIPT\n\n${params.name}\nCurrent stock: ${prevQty} ${unit}\nReceiving: ${qty} ${unit}\nNew total stock: ${newQty} ${unit}`;
      needsConfirmation = true;
    } else if (action.intent === 'CLEAR_PANTRY') {
      confirmationMsg = `Are you sure you want to clear all ${pantry.length} items from shared restaurant inventory?`;
      needsConfirmation = true;
    }

    if (needsConfirmation) {
      action.requiresConfirmation = true;
      action.confirmationMessage = confirmationMsg;

      const debugInfo: AgentDebugInfo = {
        userInput: command,
        intent: action.intent,
        entities: action.parameters,
        validation: {
          passed: false,
          reason: confirmationMsg
        },
        action: action.intent,
        resultStatus: 'confirmation_required',
        resultMessage: confirmationMsg
      };

      return {
        message: confirmationMsg,
        intent: action.intent,
        status: 'confirmation_required',
        pendingAction: action,
        debugInfo,
        timestamp
      };
    }

    return this.executeAction(action, context);
  }

  static executeAction(action: AgentAction, context: AgentExecutionContext): AgentResponse {
    const timestamp = new Date().toLocaleTimeString();
    const {
      pantry,
      recipes = [],
      groceryList = [],
      transactions = [],
      addIngredient,
      removeIngredient,
      updateIngredient,
      recordUsage,
      recordWaste,
      adjustStock,
      addGroceryItem,
      markGroceryPurchased,
      receiveGroceryDelivery,
      restaurant,
      user
    } = context;
    const params = action.parameters;

    const restName = restaurant?.name || 'Spice Garden';

    let responseMessage = '';
    let responseStatus: AgentResponse['status'] = 'info';
    let actionRequired: AgentResponse['actionRequired'] = 'none';
    let responseData: Record<string, unknown> | undefined = undefined;

    // Track memory for context
    if (params.name) {
      this.memory.lastIngredientName = params.name;
    }
    if (params.recipeName) {
      this.memory.lastRecipeName = params.recipeName;
    }
    this.memory.lastIntent = action.intent;
    this.memory.lastTimestamp = Date.now();

    switch (action.intent) {
      case 'GREETING': {
        responseMessage = `Hello! I am your AI Kitchen Assistant for ${restName}. Ready to assist with inventory, recipes, cooking, waste logging, camera scanning, and grocery management!`;
        responseStatus = 'info';
        break;
      }

      case 'OPEN_CAMERA':
      case 'CAPTURE_ITEM':
      case 'ANALYZE_ITEM':
      case 'CONFIRM_DETECTED_ITEM':
      case 'UPDATE_INVENTORY_FROM_CAMERA': {
        responseMessage = `Opening Camera Inventory Scanner for ${restName}. Position an ingredient item in the camera frame to scan and auto-detect stock!`;
        responseStatus = 'info';
        actionRequired = 'open_camera';
        break;
      }

      case 'GET_RECIPE_INGREDIENTS': {
        const queryName = params.name || params.recipeName || this.memory.lastRecipeName || 'Chicken Curry';
        const targetRecipe = recipes.find((r: Recipe) => r.title.toLowerCase().includes(queryName.toLowerCase()));

        if (!targetRecipe) {
          responseMessage = `Could not find recipe "${queryName}" in ${restName}'s database.`;
          responseStatus = 'warning';
          break;
        }

        this.memory.lastRecipeName = targetRecipe.title;

        const ingList = targetRecipe.ingredients
          .map((i) => `• ${i.name} — ${i.amount} ${i.unit}`)
          .join('\n');

        responseMessage = `${targetRecipe.title} ingredients:\n\n${ingList}`;
        responseStatus = 'info';
        actionRequired = 'view_recipes';
        break;
      }

      case 'GET_PENDING_GROCERIES': {
        const pending = groceryList.filter((g) => g.status === 'NEEDED' || g.status === 'ORDERED');
        if (pending.length === 0) {
          responseMessage = `No pending grocery items for ${restName}.`;
          responseStatus = 'info';
        } else {
          const list = pending.map((g) => `• [${g.priority}] ${g.name}: ${g.quantity} ${g.unit}`).join('\n');
          responseMessage = `${restName} has ${pending.length} pending grocery item(s):\n\n${list}`;
          responseStatus = 'info';
        }
        actionRequired = 'add_grocery';
        break;
      }

      case 'GET_PURCHASED_GROCERIES': {
        const purchased = groceryList.filter((g) => g.status === 'PURCHASED');
        if (purchased.length === 0) {
          responseMessage = `No items currently marked as PURCHASED on ${restName}'s grocery list. (Note: Items update inventory once RECEIVED).`;
          responseStatus = 'info';
        } else {
          const list = purchased.map((g) => `• ${g.name}: ${g.quantity} ${g.unit} (Awaiting Delivery)`).join('\n');
          responseMessage = `Purchased grocery items for ${restName} awaiting delivery receipt:\n\n${list}`;
          responseStatus = 'info';
        }
        actionRequired = 'add_grocery';
        break;
      }

      case 'GET_STAFF_ROLE': {
        responseMessage = `Role information for ${restName}:\n\n• Manager: ${user?.name || 'Admin Chef'} (${user?.role.toUpperCase() || 'MANAGER'})\n• Kitchen Staff: Executive Chef, Sous Chef, Station Line Cooks.`;
        responseStatus = 'info';
        break;
      }

      case 'RECORD_USAGE': {
        if (!params.name) {
          responseMessage = 'Which ingredient usage would you like to record?';
          responseStatus = 'warning';
          break;
        }

        const target = pantry.find((p) => p.name.toLowerCase().includes(params.name!.toLowerCase()));
        if (!target) {
          responseMessage = `Could not find "${params.name}" in ${restName}'s shared inventory.`;
          responseStatus = 'error';
          break;
        }

        const qty = params.quantity && params.quantity > 0 ? params.quantity : 1;
        if (recordUsage) {
          recordUsage(target.id, qty, target.unit, 'Kitchen Usage via AI Command');
        }

        const remaining = Math.max(0, target.quantity - qty);
        responseMessage = `Recorded usage for ${restName}: Used ${qty} ${target.unit} of ${target.name}. Remaining stock: ${remaining} ${target.unit}.`;
        responseStatus = 'success';
        actionRequired = 'explore_pantry';
        break;
      }

      case 'RECORD_WASTE': {
        if (!params.name) {
          responseMessage = 'Which ingredient waste record would you like to log?';
          responseStatus = 'warning';
          break;
        }

        const target = pantry.find((p) => p.name.toLowerCase().includes(params.name!.toLowerCase()));
        if (!target) {
          responseMessage = `Could not find "${params.name}" in ${restName}'s shared inventory.`;
          responseStatus = 'error';
          break;
        }

        const qty = params.quantity && params.quantity > 0 ? params.quantity : 1;
        if (recordWaste) {
          recordWaste(target.id, qty, target.unit, 'Spoiled/Damaged Waste via AI Command');
        }

        const remaining = Math.max(0, target.quantity - qty);
        responseMessage = `Logged waste record for ${restName}: Wasted ${qty} ${target.unit} of ${target.name}. Updated stock: ${remaining} ${target.unit}.`;
        responseStatus = 'warning';
        actionRequired = 'explore_pantry';
        break;
      }

      case 'ADJUST_STOCK': {
        if (!params.name || params.quantity === undefined) {
          responseMessage = 'Please specify item name and actual physical count to adjust stock (e.g. "Correct rice stock to 20 kg").';
          responseStatus = 'warning';
          break;
        }

        const target = pantry.find((p) => p.name.toLowerCase().includes(params.name!.toLowerCase()));
        if (!target) {
          responseMessage = `Could not find "${params.name}" in ${restName}'s shared inventory.`;
          responseStatus = 'error';
          break;
        }

        if (adjustStock) {
          adjustStock(target.id, params.quantity, 'Stock Reconciliation via AI Command');
        }

        responseMessage = `Adjusted ${restName} stock for ${target.name} from ${target.quantity} ${target.unit} to actual count ${params.quantity} ${target.unit}.`;
        responseStatus = 'success';
        actionRequired = 'explore_pantry';
        break;
      }

      case 'GET_INVENTORY_HISTORY': {
        if (transactions.length === 0) {
          responseMessage = `No inventory activity history logged for ${restName} yet.`;
          responseStatus = 'info';
          actionRequired = 'explore_pantry';
          break;
        }

        const recent = transactions.slice(0, 5).map((t) => `• ${t.itemName}: ${t.type} (${t.quantity} ${t.unit}) by ${t.createdBy}`).join('\n');
        responseMessage = `Recent inventory changes for ${restName}:\n\n${recent}`;
        responseStatus = 'info';
        actionRequired = 'explore_pantry';
        break;
      }

      case 'GENERATE_GROCERY_LIST': {
        const autoItems = GroceryService.generateFromInventory(pantry, groceryList, restaurant?.id);
        if (autoItems.length > 0 && addGroceryItem) {
          autoItems.forEach((item) => addGroceryItem(item));
          responseMessage = `Generated ${autoItems.length} restock item(s) on ${restName}'s grocery list based on low/out-of-stock thresholds!`;
        } else {
          responseMessage = `All stock items in ${restName} are currently healthy or already listed on the grocery list!`;
        }
        responseStatus = 'success';
        actionRequired = 'add_grocery';
        break;
      }

      case 'ADD_GROCERY_ITEM': {
        let itemsToAdd: Array<{ name: string; quantity: number; unit: string }> = [];

        if (params.name) {
          itemsToAdd.push({ name: params.name, quantity: params.quantity && params.quantity > 0 ? params.quantity : 1, unit: params.unit || 'pcs' });
        } else if (this.memory.lastMissingIngredients && this.memory.lastMissingIngredients.length > 0) {
          itemsToAdd = this.memory.lastMissingIngredients.map((item) => ({ name: item.name, quantity: item.amount, unit: item.unit }));
        }

        if (itemsToAdd.length === 0) {
          responseMessage = 'Which item would you like to add to the grocery list?';
          responseStatus = 'warning';
          break;
        }

        if (addGroceryItem) {
          itemsToAdd.forEach((item) => {
            addGroceryItem({
              id: `g_ai_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
              restaurantId: restaurant?.id,
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
              reason: 'Added via AI Command',
              priority: 'HIGH',
              source: 'MANUAL',
              status: 'NEEDED',
              createdAt: new Date().toISOString()
            });
          });
        }

        const itemNames = itemsToAdd.map((i) => `${i.quantity} ${i.unit} of ${i.name}`).join(', ');
        responseMessage = `Added ${itemNames} to ${restName}'s smart grocery list.`;
        responseStatus = 'success';
        actionRequired = 'add_grocery';
        break;
      }

      case 'MARK_GROCERY_PURCHASED': {
        if (!params.name) {
          responseMessage = 'Which grocery item would you like to mark as purchased?';
          responseStatus = 'warning';
          break;
        }

        const target = groceryList.find((g) => g.name.toLowerCase().includes(params.name!.toLowerCase()));
        if (!target) {
          responseMessage = `Could not find "${params.name}" in ${restName}'s active grocery list.`;
          responseStatus = 'warning';
          break;
        }

        if (markGroceryPurchased) {
          markGroceryPurchased(target.id);
        }

        responseMessage = `Marked "${target.name}" as PURCHASED on ${restName}'s grocery list! (Note: Stock will be updated once delivery is RECEIVED).`;
        responseStatus = 'success';
        actionRequired = 'add_grocery';
        break;
      }

      case 'RECEIVE_GROCERY': {
        if (!params.name) {
          responseMessage = 'Which grocery item delivery arrived? (e.g. "Rice has arrived, received 10 kg")';
          responseStatus = 'warning';
          break;
        }

        const target = groceryList.find((g) => g.name.toLowerCase().includes(params.name!.toLowerCase()));
        const qty = params.quantity && params.quantity > 0 ? params.quantity : target ? target.quantity : 1;

        if (target && receiveGroceryDelivery) {
          receiveGroceryDelivery(target.id, qty);
          responseMessage = `Grocery delivery received for ${restName}! Added ${qty} ${target.unit} of ${target.name} directly into shared restaurant inventory.`;
          responseStatus = 'success';
          actionRequired = 'explore_pantry';
        } else {
          // If not in grocery list, add directly to pantry
          const newIng: Ingredient = {
            id: `ing_deliv_ai_${Date.now()}`,
            restaurantId: restaurant?.id,
            name: params.name,
            quantity: qty,
            unit: params.unit || 'pcs',
            category: 'produce',
            freshness: 'fresh',
            colorCode: '#10b981',
            createdAt: new Date().toISOString(),
            createdBy: user?.name || 'Staff'
          };
          addIngredient(newIng);
          responseMessage = `Received delivery of ${qty} ${params.unit || 'pcs'} of ${params.name}! Added into ${restName}'s shared inventory.`;
          responseStatus = 'success';
          actionRequired = 'explore_pantry';
        }
        break;
      }

      case 'GET_GROCERY_STATUS': {
        if (groceryList.length === 0) {
          responseMessage = `${restName}'s smart grocery list is currently empty.`;
          responseStatus = 'info';
          actionRequired = 'add_grocery';
          break;
        }

        const needed = groceryList.filter((g) => g.status === 'NEEDED');
        const listStr = needed.map((g) => `• [${g.priority}] ${g.name}: ${g.quantity} ${g.unit}`).join('\n');
        responseMessage = `${restName} currently needs ${needed.length} grocery item(s):\n\n${listStr}`;
        responseStatus = 'info';
        actionRequired = 'add_grocery';
        break;
      }

      case 'ADD_PANTRY_ITEM': {
        if (!params.name) {
          responseMessage = `Which ingredient would you like to add to ${restName}'s inventory?`;
          responseStatus = 'warning';
          break;
        }

        const qty = params.quantity && params.quantity > 0 ? params.quantity : 1;
        const unit = params.unit || 'pcs';
        const itemName = this.formatIngredientName(params.name);
        const category = this.inferCategory(itemName);

        const existing = pantry.find(
          (p) => p.name.toLowerCase() === itemName.toLowerCase() || p.name.toLowerCase().includes(params.name!.toLowerCase())
        );

        if (existing) {
          const convertedAddQty = this.convertQuantity(qty, unit, existing.unit);
          const updatedQty = Math.round((existing.quantity + convertedAddQty) * 100) / 100;

          updateIngredient({
            ...existing,
            quantity: updatedQty,
            freshness: 'fresh',
            updatedBy: user?.name
          });

          responseMessage = `Updated ${restName} stock: Added ${qty} ${unit} to existing ${existing.name}. New total quantity: ${updatedQty} ${existing.unit}.`;
          responseStatus = 'success';
          actionRequired = 'explore_pantry';
        } else {
          const newIng: Ingredient = {
            id: `ing_agent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            restaurantId: restaurant?.id,
            name: itemName,
            quantity: qty,
            unit,
            category,
            freshness: 'fresh' as FreshnessLevel,
            colorCode: CATEGORY_COLORS[category] || '#06b6d4',
            createdAt: new Date().toISOString(),
            createdBy: user?.name || 'Staff'
          };

          addIngredient(newIng);

          responseMessage = `Added ${qty} ${unit} of ${itemName} to ${restName}'s shared inventory!`;
          responseStatus = 'success';
          actionRequired = 'explore_pantry';
        }
        break;
      }

      case 'REMOVE_PANTRY_ITEM': {
        if (!params.name) {
          responseMessage = `Which ingredient would you like to remove from ${restName}'s inventory?`;
          responseStatus = 'warning';
          break;
        }

        const targetName = params.name.toLowerCase().trim();
        const existing = pantry.find(
          (p) => p.name.toLowerCase() === targetName || p.name.toLowerCase().includes(targetName)
        );

        if (!existing) {
          responseMessage = `Could not find "${params.name}" in ${restName}'s shared inventory.`;
          responseStatus = 'error';
          break;
        }

        if (params.quantity && params.quantity > 0) {
          const requestedUnit = params.unit || existing.unit;
          const convertedRemoveQty = this.convertQuantity(params.quantity, requestedUnit, existing.unit);

          if (convertedRemoveQty > existing.quantity) {
            responseMessage = `${restName} has only ${existing.quantity} ${existing.unit} of ${existing.name}, but you requested to remove ${params.quantity} ${requestedUnit}.`;
            responseStatus = 'warning';
            break;
          }

          const newQty = Math.round((existing.quantity - convertedRemoveQty) * 100) / 100;
          if (newQty <= 0) {
            removeIngredient(existing.id);
            responseMessage = `Used all remaining ${existing.quantity} ${existing.unit} of ${existing.name}. Removed item from ${restName}'s active stock.`;
          } else {
            updateIngredient({ ...existing, quantity: newQty, updatedBy: user?.name });
            responseMessage = `Removed ${params.quantity} ${requestedUnit} of ${existing.name} from ${restName}'s stock. Remaining stock: ${newQty} ${existing.unit}.`;
          }
          responseStatus = 'success';
          actionRequired = 'explore_pantry';
        } else {
          removeIngredient(existing.id);
          responseMessage = `Removed ${existing.name} from ${restName}'s inventory.`;
          responseStatus = 'success';
          actionRequired = 'explore_pantry';
        }
        break;
      }

      case 'GET_PANTRY': {
        if (pantry.length === 0) {
          responseMessage = `${restName}'s shared inventory is currently empty.`;
          responseStatus = 'info';
          actionRequired = 'explore_pantry';
          break;
        }

        const itemsList = pantry.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ');
        responseMessage = `${restName}'s shared inventory currently contains ${pantry.length} ingredient(s): ${itemsList}.`;
        responseStatus = 'info';
        actionRequired = 'explore_pantry';
        break;
      }

      case 'CHECK_AVAILABILITY':
      case 'GET_PANTRY_ITEM': {
        const queryName = params.name || this.memory.lastIngredientName;
        if (!queryName) {
          responseMessage = 'Which ingredient would you like to check?';
          responseStatus = 'warning';
          break;
        }

        const targetName = queryName.toLowerCase().trim();
        const existing = pantry.find(
          (p) => p.name.toLowerCase() === targetName || p.name.toLowerCase().includes(targetName) || targetName.includes(p.name.toLowerCase())
        );

        if (existing && existing.quantity > 0) {
          this.memory.lastIngredientName = existing.name;
          if (params.quantity && params.quantity > 0) {
            const reqUnit = params.unit || existing.unit;
            const converted = this.convertQuantity(params.quantity, reqUnit, existing.unit);
            if (existing.quantity >= converted) {
              responseMessage = `Yes! ${restName} has ${existing.quantity} ${existing.unit} of ${existing.name} in shared inventory (you requested ${params.quantity} ${reqUnit}).`;
              responseStatus = 'success';
            } else {
              responseMessage = `${restName} only has ${existing.quantity} ${existing.unit} of ${existing.name} (short by ${converted - existing.quantity} ${existing.unit}).`;
              responseStatus = 'warning';
            }
          } else {
            responseMessage = `${restName} currently has ${existing.quantity} ${existing.unit} of ${existing.name} in shared inventory.`;
            responseStatus = 'success';
          }
        } else {
          responseMessage = `${restName} does not currently have any ${queryName} in shared inventory.`;
          responseStatus = 'warning';
        }
        break;
      }

      case 'GET_LOW_STOCK_ITEMS': {
        const lowStock = pantry.filter((p) => p.quantity <= 3 || p.freshness === 'critical' || p.freshness === 'expiring_soon');
        if (lowStock.length === 0) {
          responseMessage = `All inventory items in ${restName} currently have healthy stock levels!`;
          responseStatus = 'info';
        } else {
          const list = lowStock.map((i) => `• ${i.name}: ${i.quantity} ${i.unit} (${i.freshness.replace('_', ' ')})`).join('\n');
          responseMessage = `Low / critical stock items in ${restName}:\n\n${list}`;
          responseStatus = 'warning';
        }
        actionRequired = 'explore_pantry';
        break;
      }

      case 'GET_EXPIRING_ITEMS': {
        const expiring = pantry.filter((p) => p.freshness === 'expiring_soon' || p.freshness === 'critical');
        if (expiring.length === 0) {
          responseMessage = `No items in ${restName}'s inventory are expiring soon.`;
          responseStatus = 'info';
        } else {
          const list = expiring.map((i) => `• ${i.name}: ${i.quantity} ${i.unit}`).join('\n');
          responseMessage = `Expiring stock items to use first in ${restName}:\n\n${list}`;
          responseStatus = 'warning';
        }
        actionRequired = 'explore_pantry';
        break;
      }

      case 'FIND_RECIPES_BY_INGREDIENT': {
        if (!params.name) {
          responseMessage = 'Which ingredient would you like recipes for?';
          responseStatus = 'warning';
          break;
        }
        const targetIng = params.name.toLowerCase().trim();
        const matchingRecipes = recipes.filter(
          (r: Recipe) =>
            r.title.toLowerCase().includes(targetIng) ||
            r.ingredients.some((ing) => ing.name.toLowerCase().includes(targetIng))
        );

        if (matchingRecipes.length === 0) {
          responseMessage = `No recipes found matching ingredient "${params.name}" in restaurant database.`;
          responseStatus = 'warning';
        } else {
          const list = matchingRecipes
            .map((r: Recipe) => `• ${r.title} (${r.prepTime + r.cookTime} mins)`)
            .join('\n');
          responseMessage = `Found ${matchingRecipes.length} recipe(s) matching "${params.name}":\n\n${list}`;
          responseStatus = 'success';
        }
        actionRequired = 'view_recipes';
        break;
      }

      case 'FIND_RECIPES': {
        const cookable = recipes.filter((r: Recipe) => {
          return r.ingredients.every((req: { name: string; amount: number; unit: string }) => {
            const match = pantry.find((p) => p.name.toLowerCase() === req.name.toLowerCase());
            return match && match.quantity >= req.amount;
          });
        });

        if (cookable.length === 0) {
          responseMessage = `No recipes can be 100% prepared with ${restName}'s current inventory. Check missing ingredients to restock.`;
          responseStatus = 'warning';
        } else {
          const list = cookable.map((r: Recipe) => `• ${r.title} (${r.prepTime + r.cookTime} mins, ${r.difficulty})`).join('\n');
          responseMessage = `Recipes currently possible with ${restName}'s available inventory:\n\n${list}`;
          responseStatus = 'success';
        }
        actionRequired = 'view_recipes';
        break;
      }

      case 'CHECK_RECIPE_AVAILABILITY':
      case 'GET_MISSING_INGREDIENTS': {
        const queryName = params.name || params.recipeName || this.memory.lastRecipeName || 'Chicken Curry';
        const targetRecipe = recipes.find((r: Recipe) => r.title.toLowerCase().includes(queryName.toLowerCase()));

        if (!targetRecipe) {
          responseMessage = queryName
            ? `Could not find recipe "${queryName}" in restaurant database.`
            : `Please specify a recipe name to check ingredients.`;
          responseStatus = 'warning';
          break;
        }

        this.memory.lastRecipeName = targetRecipe.title;

        const missing: Array<{ name: string; amount: number; unit: string }> = [];
        const available: Array<{ name: string; available: number; required: number; unit: string }> = [];

        targetRecipe.ingredients.forEach((req: { name: string; amount: number; unit: string }) => {
          const matched = pantry.find((p) => p.name.toLowerCase() === req.name.toLowerCase());
          if (!matched || matched.quantity < req.amount) {
            missing.push({
              name: req.name,
              amount: req.amount - (matched ? matched.quantity : 0),
              unit: req.unit
            });
          } else {
            available.push({
              name: req.name,
              available: matched.quantity,
              required: req.amount,
              unit: req.unit
            });
          }
        });

        this.memory.lastMissingIngredients = missing;

        if (missing.length === 0) {
          responseMessage = `"${targetRecipe.title}" can be prepared! All required ingredients are available in ${restName}'s inventory.`;
          responseStatus = 'success';
        } else {
          const missingStr = missing.map((m: { name: string; amount: number; unit: string }) => `• ${m.name} — ${m.amount} ${m.unit}`).join('\n');
          responseMessage = `"${targetRecipe.title}" cannot currently be prepared.\n\nMissing ingredients:\n${missingStr}`;
          responseStatus = 'warning';

          // Automatically add missing ingredients to grocery if requested
          if (addGroceryItem) {
            missing.forEach((m: { name: string; amount: number; unit: string }) => {
              addGroceryItem({
                id: `g_miss_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                restaurantId: restaurant?.id,
                name: m.name,
                quantity: m.amount,
                unit: m.unit,
                reason: `Missing ingredient for recipe "${targetRecipe.title}"`,
                priority: 'HIGH',
                source: 'RECIPE_MISSING',
                status: 'NEEDED',
                createdAt: new Date().toISOString()
              });
            });
            responseMessage += `\n\nAdded missing items directly to ${restName}'s grocery list!`;
          }
        }
        actionRequired = 'view_recipes';
        break;
      }

      case 'SUGGEST_SUBSTITUTION': {
        const target = params.name || params.targetIngredient || 'milk';
        const t = target.toLowerCase();
        let subStr = '';

        if (t.includes('milk')) {
          subStr = 'Almond milk, Oat milk, Coconut milk, or Soy milk';
        } else if (t.includes('paneer')) {
          subStr = 'Firm Organic Tofu or Extra Firm Cottage Cheese';
        } else if (t.includes('butter')) {
          subStr = 'Coconut oil, Extra Virgin Olive oil, or Ghee';
        } else if (t.includes('sugar')) {
          subStr = 'Honey, Maple syrup, Jaggery, or Stevia';
        } else {
          subStr = 'similar plant-based or dairy alternatives depending on recipe flavor profile';
        }

        responseMessage = `Culinary Substitutions for "${target}": You can use ${subStr}.`;
        responseStatus = 'info';
        break;
      }

      case 'START_COOKING': {
        const queryName = params.name || params.recipeName || '';
        const targetRecipe = recipes.find((r: Recipe) => r.title.toLowerCase().includes(queryName.toLowerCase())) || recipes[0];

        if (!targetRecipe) {
          responseMessage = 'Could not find requested recipe to start cooking.';
          responseStatus = 'warning';
          break;
        }

        // Verify ingredient availability first (MUST NOT deduct inventory on start)
        const missing = targetRecipe.ingredients.filter((req: { name: string; amount: number; unit: string }) => {
          const match = pantry.find((p) => p.name.toLowerCase() === req.name.toLowerCase());
          return !match || match.quantity < req.amount;
        });

        if (missing.length > 0) {
          const missingNames = missing.map((m: { name: string; amount: number; unit: string }) => `• ${m.name} (${m.amount} ${m.unit})`).join('\n');
          responseMessage = `Cannot start cooking "${targetRecipe.title}". Missing ingredients:\n${missingNames}`;
          responseStatus = 'warning';
        } else {
          if (context.startCooking) {
            context.startCooking(targetRecipe);
          }
          if (context.setSelectedRecipe) {
            context.setSelectedRecipe(targetRecipe.id);
          }
          responseMessage = `Started cooking session for "${targetRecipe.title}"! All required ingredients are verified in stock.\n\nNote: Inventory will be deducted upon recipe completion.`;
          responseStatus = 'success';
          actionRequired = 'start_cooking';
        }
        break;
      }

      case 'GET_COOKING_STATUS': {
        if (context.activeCookingRecipe) {
          responseMessage = `Currently cooking: "${context.activeCookingRecipe.title}". Ingredients are prepped in cooking workspace.`;
          responseStatus = 'info';
          actionRequired = 'start_cooking';
        } else {
          responseMessage = `No active cooking session currently in progress for ${restName}.`;
          responseStatus = 'info';
        }
        break;
      }

      case 'COMPLETE_COOKING': {
        if (!context.activeCookingRecipe) {
          responseMessage = `No active cooking session to complete for ${restName}.`;
          responseStatus = 'warning';
          break;
        }

        const recipeToFinish = context.activeCookingRecipe;
        if (context.finishCookingDeduction) {
          context.finishCookingDeduction(recipeToFinish);
        }

        responseMessage = `Completed cooking "${recipeToFinish.title}"! Deducted required recipe ingredients from ${restName}'s shared inventory and logged transaction.`;
        responseStatus = 'success';
        actionRequired = 'explore_pantry';
        break;
      }

      case 'GET_STAFF': {
        responseMessage = `Staff Members for ${restName}:\n\n• ${user?.name || 'Current User'} (${user?.role.toUpperCase() || 'CHEF'})\n• Shared workspace active personnel count: 3 active kitchen staff.`;
        responseStatus = 'info';
        break;
      }

      case 'HELP': {
        responseMessage = `I am your ${restName} AI Kitchen Assistant. Commands include:\n\n• Record Usage: "We used 5 kg rice today"\n• Record Waste: "1 kg tomatoes were wasted"\n• Stock Correction: "Correct rice stock to 20 kg"\n• Inventory History: "Show today's inventory changes"\n• Smart Grocery: "What should we buy?", "Add 10 kg rice to grocery list"\n• Camera Scan: "Scan ingredient", "Open camera"\n• Deliveries: "Rice has arrived, received 10 kg"\n• Recipe Matching & Guided Cooking: "What can we cook?", "Start cooking Chicken Curry", "Complete cooking"`;
        responseStatus = 'info';
        break;
      }

      default: {
        responseMessage = `I am ${restName}'s AI Kitchen Assistant. Ready to help with stock, recipes, cooking, waste, camera scanning, and grocery management.`;
        responseStatus = 'info';
        break;
      }
    }

    const debugInfo: AgentDebugInfo = {
      userInput: action.rawCommand,
      intent: action.intent,
      entities: params,
      validation: { passed: true },
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

  private static formatIngredientName(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

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
    return 'produce';
  }

  private static convertQuantity(amount: number, fromUnit: string, toUnit: string): number {
    const from = fromUnit.toLowerCase();
    const to = toUnit.toLowerCase();
    if (from === to) return amount;
    if (from === 'kg' && to === 'g') return amount * 1000;
    if (from === 'g' && to === 'kg') return amount / 1000;
    if ((from === 'l' || from === 'litre' || from === 'liter') && to === 'ml') return amount * 1000;
    if (from === 'ml' && (to === 'l' || to === 'litre' || to === 'liter')) return amount / 1000;
    return amount;
  }
}
