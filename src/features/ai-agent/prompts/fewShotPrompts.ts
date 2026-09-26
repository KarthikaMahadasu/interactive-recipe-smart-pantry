/**
 * Prompt Architecture & Few-Shot Examples for Future LLM Pipeline Integration (Requirement 31 & 32)
 * Structured system role definitions, application context formatters, and few-shot examples
 * that can be directly passed to external LLM backends (Gemini / OpenAI) in future server modules.
 */

export const SYSTEM_ROLE_PROMPT = `
You are the Pantry AI Agent for the Interactive Recipe & Smart Pantry Manager.
Your role is to understand natural language kitchen commands and extract validated structured JSON actions.

RULES:
1. Always output strictly validated JSON matching the AgentAction schema.
2. Never invent fake quantities or assume pantry items that do not exist.
3. Normalize units to standard metric/imperial units (kg, g, mg, L, ml, pcs, cup, tbsp, tsp).
4. If quantity is missing for addition commands (e.g. "Add some rice"), return status "error" asking for quantity clarification.
5. If user intent is destructive, set "requiresConfirmation": true.
`;

export interface FewShotExample {
  userCommand: string;
  expectedJson: {
    intent: string;
    parameters: Record<string, unknown>;
    confidence: number;
    requiresConfirmation: boolean;
  };
}

export const FEW_SHOT_EXAMPLES: FewShotExample[] = [
  {
    userCommand: 'Add 2 kg rice to my pantry',
    expectedJson: {
      intent: 'ADD_PANTRY_ITEM',
      parameters: { name: 'rice', quantity: 2, unit: 'kg', category: 'grain' },
      confidence: 0.98,
      requiresConfirmation: false
    }
  },
  {
    userCommand: 'Remove 500 grams of rice',
    expectedJson: {
      intent: 'REMOVE_PANTRY_ITEM',
      parameters: { name: 'rice', quantity: 500, unit: 'g' },
      confidence: 0.95,
      requiresConfirmation: false
    }
  },
  {
    userCommand: 'What can I cook with what I have?',
    expectedJson: {
      intent: 'FIND_RECIPES',
      parameters: { mode: 'available_now' },
      confidence: 0.98,
      requiresConfirmation: false
    }
  },
  {
    userCommand: 'What am I missing for paneer curry?',
    expectedJson: {
      intent: 'GET_MISSING_INGREDIENTS',
      parameters: { recipeName: 'paneer curry' },
      confidence: 0.96,
      requiresConfirmation: false
    }
  },
  {
    userCommand: 'Do I have enough rice for biryani?',
    expectedJson: {
      intent: 'CHECK_AVAILABILITY',
      parameters: { name: 'rice', recipeName: 'biryani' },
      confidence: 0.95,
      requiresConfirmation: false
    }
  },
  {
    userCommand: 'What is expiring soon?',
    expectedJson: {
      intent: 'GET_EXPIRING_ITEMS',
      parameters: { queryType: 'expiring' },
      confidence: 0.97,
      requiresConfirmation: false
    }
  },
  {
    userCommand: 'What can I use instead of milk?',
    expectedJson: {
      intent: 'SUGGEST_SUBSTITUTION',
      parameters: { name: 'milk' },
      confidence: 0.96,
      requiresConfirmation: false
    }
  },
  {
    userCommand: 'Clear my pantry',
    expectedJson: {
      intent: 'CLEAR_PANTRY',
      parameters: {},
      confidence: 0.99,
      requiresConfirmation: true
    }
  }
];
