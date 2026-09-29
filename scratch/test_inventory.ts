import { getInventoryStatus, sortInventory } from '../src/features/inventory/utils/inventoryUtils';
import { ImageDetectionService } from '../src/features/inventory/camera/services/imageDetectionService';
import { RecipeMatchingService } from '../src/services/recipes/recipeMatchingService';
import { AIAgentService, type AgentExecutionContext } from '../src/features/ai-agent/services/aiAgentService';
import type { Ingredient } from '../src/types/ingredient';
import type { Recipe } from '../src/types/recipe';

console.log('=== STARTING MODULE VERIFICATION TESTS ===');

// Test 1: Inventory Status & Sorting
const samplePantry: Ingredient[] = [
  { id: '1', name: 'Rice', quantity: 25, unit: 'kg', category: 'grain', freshness: 'pantry_stable', colorCode: '#fff', createdAt: new Date().toISOString() },
  { id: '2', name: 'Potato', quantity: 1, unit: 'kg', category: 'produce', freshness: 'expiring_soon', colorCode: '#fff', createdAt: new Date().toISOString() },
  { id: '3', name: 'Paneer', quantity: 0, unit: 'g', category: 'dairy', freshness: 'critical', colorCode: '#fff', createdAt: new Date().toISOString() }
];

console.log('Status Rice:', getInventoryStatus(samplePantry[0])); // expected in_stock
console.log('Status Potato:', getInventoryStatus(samplePantry[1])); // expected low_stock or expiring_soon
console.log('Status Paneer:', getInventoryStatus(samplePantry[2])); // expected out_of_stock

const sorted = sortInventory(samplePantry, 'qty_desc');
console.log('Sorted by Qty Desc top item:', sorted[0].name, sorted[0].quantity);

// Test 2: Camera Image Detection Service
ImageDetectionService.detectInventoryItemFromImage('data:image/jpeg;base64,sample_potato_data_for_vision_matching_potato')
  .then((detection) => {
    console.log('Detection Result:', detection);
  })
  .catch((err) => console.error('Detection Error:', err));

// Test 3: Recipe Matching with Shared Inventory
const sampleRecipe: Recipe = {
  id: 'r1',
  title: 'Potato Rice',
  description: 'Test recipe',
  prepTime: 10,
  cookTime: 10,
  servings: 2,
  difficulty: 'Easy',
  category: 'Lunch',
  cuisine: 'Indian',
  dietaryTags: ['Vegan'],
  colorGradient: '',
  createdAt: new Date().toISOString(),
  ingredients: [
    { name: 'Rice', amount: 1, unit: 'kg' },
    { name: 'Potato', amount: 2, unit: 'kg' }
  ],
  instructions: []
};

const match = RecipeMatchingService.matchRecipe(sampleRecipe, samplePantry);
console.log('Recipe Match Percentage:', match.matchPercentage, '%');
console.log('Available ingredients count:', match.availableIngredients.length);
console.log('Missing ingredients count:', match.missingIngredients.length);

// Test 4: AI Agent Query Execution
const mockContext: AgentExecutionContext = {
  pantry: samplePantry,
  recipes: [sampleRecipe],
  addIngredient: (ing) => console.log('[AI Add Ingedient Call]:', ing.name, ing.quantity, ing.unit),
  updateIngredient: (ing) => console.log('[AI Update Ingredient Call]:', ing.name, ing.quantity),
  removeIngredient: (id) => console.log('[AI Remove Ingredient Call]:', id),
  clearPantry: () => console.log('[AI Clear Pantry Call]'),
  setSelectedRecipe: (id) => console.log('[AI Set Selected Recipe]:', id),
  setAIState: () => {},
  user: { id: 'u1', restaurantId: 'rest_spice_garden', name: 'Chef Alex', phone: '1234567890', email: 'alex@spice.com', role: 'chef', status: 'active', createdAt: '', updatedAt: '' },
  restaurant: { id: 'rest_spice_garden', name: 'Spice Garden', phone: '', email: '', address: '', type: 'Restaurant', createdAt: '', updatedAt: '' }
};

AIAgentService.executeUserCommand('How much rice do we have?', mockContext).then((res) => {
  console.log('AI Response (Query Rice):', res.message);
});

AIAgentService.executeUserCommand('Add 5 kg potatoes', mockContext).then((res) => {
  console.log('AI Response (Add Potatoes):', res.message);
});

console.log('=== VERIFICATION TESTS SETUP DONE ===');
