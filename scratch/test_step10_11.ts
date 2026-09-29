import { InventoryTransactionService } from '../src/features/inventory/services/inventoryTransactionService';
import { GroceryService } from '../src/features/grocery/services/groceryService';
import { AIAgentService, type AgentExecutionContext } from '../src/features/ai-agent/services/aiAgentService';
import type { Ingredient } from '../src/types/ingredient';
import type { Recipe } from '../src/types/recipe';
import type { SmartGroceryItem } from '../src/features/grocery/types/groceryTypes';

console.log('=== STARTING STEP 10 + STEP 11 VERIFICATION TESTS ===');

// 1. Setup sample pantry & recipes
const samplePantry: Ingredient[] = [
  { id: '1', name: 'Rice', quantity: 25, unit: 'kg', category: 'grain', freshness: 'pantry_stable', colorCode: '#fff', createdAt: new Date().toISOString() },
  { id: '2', name: 'Potato', quantity: 2, unit: 'kg', category: 'produce', freshness: 'expiring_soon', colorCode: '#fff', createdAt: new Date().toISOString() },
  { id: '3', name: 'Paneer', quantity: 0, unit: 'g', category: 'dairy', freshness: 'critical', colorCode: '#fff', createdAt: new Date().toISOString() }
];

const sampleRecipes: Recipe[] = [
  {
    id: 'r1',
    title: 'Paneer Biryani',
    description: 'Test Biryani',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    difficulty: 'Medium',
    category: 'Dinner',
    cuisine: 'Indian',
    dietaryTags: ['Vegetarian'],
    colorGradient: '',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Rice', amount: 2, unit: 'kg' },
      { name: 'Paneer', amount: 500, unit: 'g' }
    ],
    instructions: []
  },
  {
    id: 'r2',
    title: 'Potato Fry',
    description: 'Test Potato',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    difficulty: 'Easy',
    category: 'Lunch',
    cuisine: 'Indian',
    dietaryTags: ['Vegan'],
    colorGradient: '',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Potato', amount: 5, unit: 'kg' }
    ],
    instructions: []
  }
];

// 2. Test Transaction Creation
const tx = InventoryTransactionService.createTransaction({
  restaurantId: 'rest_spice_garden',
  inventoryItemId: '1',
  itemName: 'Rice',
  type: 'USED_IN_COOKING',
  quantity: 2,
  unit: 'kg',
  previousQuantity: 25,
  newQuantity: 23,
  reason: 'Used in cooking Biryani',
  createdBy: 'Chef Rahul'
});

console.log('Test Transaction:', tx.type, tx.itemName, tx.previousQuantity, '->', tx.newQuantity);

// 3. Test Smart Grocery Generation from Low/Out of Stock Inventory
const currentGrocery: SmartGroceryItem[] = [];
const autoInventoryGrocery = GroceryService.generateFromInventory(samplePantry, currentGrocery, 'rest_spice_garden');
console.log('Auto Grocery from Inventory:', autoInventoryGrocery.map((g) => `${g.name} (${g.priority} - ${g.quantity} ${g.unit})`));

// 4. Test Smart Grocery Generation from Multiple Recipes Combined
const multiRecipeGrocery = GroceryService.generateFromMultipleRecipes(sampleRecipes, samplePantry, currentGrocery, 'rest_spice_garden');
console.log('Auto Grocery from Multiple Recipes:', multiRecipeGrocery.map((g) => `${g.name}: ${g.quantity} ${g.unit} (${g.reason})`));

// 5. Test AI Agent Intent Execution for Usage, Waste, Grocery, Delivery
const mockContext: AgentExecutionContext = {
  pantry: samplePantry,
  recipes: sampleRecipes,
  groceryList: autoInventoryGrocery,
  transactions: [tx],
  addIngredient: (ing) => console.log('[AI Add Ingedient]:', ing.name, ing.quantity, ing.unit),
  updateIngredient: (ing) => console.log('[AI Update Ingredient]:', ing.name, ing.quantity),
  removeIngredient: (id) => console.log('[AI Remove Ingredient]:', id),
  clearPantry: () => {},
  recordUsage: (itemId, qty, unit, reason) => console.log('[AI Record Usage]:', itemId, qty, unit, reason),
  recordWaste: (itemId, qty, unit, reason) => console.log('[AI Record Waste]:', itemId, qty, unit, reason),
  adjustStock: (itemId, actualQty, reason) => console.log('[AI Adjust Stock]:', itemId, actualQty, reason),
  addGroceryItem: (item) => console.log('[AI Add Grocery]:', item.name, item.quantity, item.unit),
  markGroceryPurchased: (id) => console.log('[AI Mark Grocery Purchased]:', id),
  receiveGroceryDelivery: (id, qty) => console.log('[AI Receive Delivery]:', id, qty),
  setSelectedRecipe: () => {},
  setAIState: () => {},
  user: { id: 'u1', restaurantId: 'rest_spice_garden', name: 'Chef Rahul', phone: '', email: '', role: 'chef', status: 'active', createdAt: '', updatedAt: '' },
  restaurant: { id: 'rest_spice_garden', name: 'Spice Garden', phone: '', email: '', address: '', type: 'Restaurant', createdAt: '', updatedAt: '' }
};

AIAgentService.executeUserCommand('We used 3 kg rice today', mockContext).then((res) => console.log('AI Response Usage:', res.message));
AIAgentService.executeUserCommand('1 kg potatoes were wasted', mockContext).then((res) => console.log('AI Response Waste:', res.message));
AIAgentService.executeUserCommand('Create a grocery list for low-stock items', mockContext).then((res) => console.log('AI Response Auto Grocery:', res.message));
AIAgentService.executeUserCommand('Rice has arrived, received 10 kg', mockContext).then((res) => console.log('AI Response Delivery:', res.message));

console.log('=== STEP 10 + STEP 11 VERIFICATION TESTS COMPLETE ===');
