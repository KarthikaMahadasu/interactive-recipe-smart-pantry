import { NLPParser } from '../src/features/ai-agent/parsers/nlpParser';
import { AIAgentService, AgentExecutionContext } from '../src/features/ai-agent/services/aiAgentService';

const testCommands = [
  'Add 2 kg rice',
  'Remove 500 g rice',
  'Remove 2 apples',
  'I used 200 g paneer',
  'Take 1 kg rice out of my pantry',
  'What do I have?',
  'Show my pantry',
  'What ingredients do I have?',
  'What is in my kitchen?',
  'How much rice do I have?',
  'Do I have paneer?',
  'Do I have 500 g paneer?',
  'What can I cook?',
  'What can I make?',
  'What can I cook with what I have?',
  'What recipes can I make?',
  'Show recipes I can make now',
  'Find recipes using paneer',
  'Show me recipes with rice',
  'What can I make with potatoes?',
  'Give me recipes containing tofu',
  'What am I missing for Paneer Curry?',
  'What ingredients do I need for Biryani?',
  'Do I have everything for Pasta?',
  'What do I need to make Vegetable Rice?',
  'What is expiring soon?',
  'Which ingredients expire soon?',
  'What should I use first?',
  'What can I use instead of milk?',
  'What can replace butter?',
  'Can I substitute paneer?',
  'Start cooking',
  'Start cooking Paneer Curry',
  'Help',
  'Tell me a joke',
  'Add 3 dragon fruits',
  'Add 2 avocados',
  'Add 500 g tofu',
  'Add 1 kg quinoa',
  'Add 5 mangoes'
];

console.log('================ NLP PARSER TEST SUITE ================');
let passed = 0;

const mockPantry: any[] = [
  { id: '1', name: 'Rice', quantity: 2, unit: 'kg', freshness: 'fresh' },
  { id: '2', name: 'Fresh Paneer', quantity: 250, unit: 'g', freshness: 'fresh' },
  { id: '3', name: 'Hass Avocado', quantity: 3, unit: 'pcs', freshness: 'expiring_soon' }
];

const mockRecipes: any[] = [
  {
    id: 'r1',
    title: 'Pan-Seared Paneer & Avocado Bowl',
    prepTime: 10, cookTime: 10, servings: 2,
    ingredients: [
      { name: 'Fresh Paneer', amount: 200, unit: 'g' },
      { name: 'Hass Avocado', amount: 1, unit: 'pcs' }
    ]
  }
];

const mockContext: AgentExecutionContext = {
  pantry: mockPantry,
  recipes: mockRecipes,
  addIngredient: (i) => console.log('  [Action] addIngredient:', i.name, i.quantity, i.unit),
  updateIngredient: (i) => console.log('  [Action] updateIngredient:', i.name, i.quantity, i.unit),
  removeIngredient: (id) => console.log('  [Action] removeIngredient:', id),
  clearPantry: () => console.log('  [Action] clearPantry'),
  setSelectedRecipe: (id) => console.log('  [Action] setSelectedRecipe:', id),
  setAIState: () => {}
};

testCommands.forEach((cmd, idx) => {
  const action = NLPParser.parse(cmd);
  const resp = AIAgentService.executeAction(action, mockContext);
  console.log(`\n[Test ${idx + 1}] "${cmd}"`);
  console.log(`  Intent: ${action.intent}`);
  console.log(`  Entities:`, JSON.stringify(action.parameters));
  console.log(`  Response:`, resp.message.split('\n')[0]);
  if (action.intent !== 'UNKNOWN' || cmd === 'Tell me a joke') {
    passed++;
  }
});

console.log(`\n================ RESULTS: ${passed}/${testCommands.length} TEST CASES PROCESSED ================`);
