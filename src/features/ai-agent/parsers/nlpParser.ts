import type { AgentAction, AgentIntent, ExtractedEntities } from '../types/agentTypes';

// Unit Normalization Dictionary
const UNIT_MAP: Record<string, string> = {
  kg: 'kg',
  kgs: 'kg',
  kilogram: 'kg',
  kilograms: 'kg',
  kilo: 'kg',
  kilos: 'kg',
  g: 'g',
  gm: 'g',
  gms: 'g',
  gram: 'g',
  grams: 'g',
  mg: 'mg',
  mgs: 'mg',
  l: 'L',
  ltr: 'L',
  ltrs: 'L',
  liter: 'L',
  liters: 'L',
  litre: 'L',
  litres: 'L',
  ml: 'ml',
  mls: 'ml',
  milliliter: 'ml',
  milliliters: 'ml',
  pcs: 'pcs',
  pc: 'pcs',
  piece: 'pcs',
  pieces: 'pcs',
  pack: 'pack',
  packs: 'pack',
  packet: 'pack',
  packets: 'pack',
  bottle: 'bottle',
  bottles: 'bottle',
  cup: 'cup',
  cups: 'cup',
  tbsp: 'tbsp',
  tablespoon: 'tbsp',
  tablespoons: 'tbsp',
  tsp: 'tsp',
  teaspoon: 'tsp',
  teaspoons: 'tsp'
};

export class NLPParser {
  /**
   * Main parsing entry point: converts natural language input into a structured AgentAction.
   */
  static parse(command: string): AgentAction {
    const rawCommand = command.trim();
    const normalizedCommand = this.normalizeText(rawCommand);

    // 1. Layer 1 — Intent Detection Router
    const intent = this.detectIntent(normalizedCommand, rawCommand);

    // 2. Layer 2 & 3 — Entity Extraction & Unit Normalization
    const parameters = this.extractEntities(normalizedCommand, rawCommand, intent);

    // 3. Layer 4 — Validation & Confirmation Check
    const validationResult = this.validateAction(intent, parameters, normalizedCommand);

    // Calculate confidence based on intent detection and parameters
    let confidence = 0.5;
    if (intent !== 'UNKNOWN') {
      confidence = 0.85;
      if (parameters.name || parameters.recipeName || intent === 'GET_PANTRY' || intent === 'FIND_RECIPES') {
        confidence = 0.95;
      }
    }

    return {
      intent,
      parameters,
      rawCommand,
      normalizedCommand,
      confidence,
      requiresConfirmation: !validationResult.passed,
      confirmationMessage: validationResult.reason,
      validationResult
    };
  }

  /**
   * Layer 0: Normalizes user command (trim, lowercase, collapse whitespace).
   */
  static normalizeText(text: string): string {
    let normalized = text.trim().toLowerCase();
    normalized = normalized.replace(/\s+/g, ' ');
    return normalized;
  }

  /**
   * Layer 1: Central Intent Router.
   * Matches intent using pattern rules in priority order.
   */
  private static detectIntent(text: string, rawText: string): AgentIntent {
    void rawText;

    // 1. HELP & CAPABILITIES
    if (/^(help|what can (you|i) (do|ask)|capabilities|commands|how to use|what can i do)\b/i.test(text)) {
      return 'HELP';
    }

    // 2. CLEAR PANTRY
    if (/^(clear (my )?pantry|delete all pantry|empty (my )?pantry|reset pantry)\b/i.test(text)) {
      return 'CLEAR_PANTRY';
    }

    // 3. EXPIRY QUESTIONS
    if (/\b(expir(ing|e|es)|about to expire|use first|what should i use first|what to use first|freshness|spoiling|going bad)\b/i.test(text)) {
      return 'GET_EXPIRING_ITEMS';
    }

    // 4. MISSING INGREDIENTS QUESTIONS
    if (
      /\b(what am i missing|missing for|ingredients (needed|required) for|what (ingredients )?do i need for|do i have everything for|what do i need to (make|cook|prepare))\b/i.test(text)
    ) {
      return 'GET_MISSING_INGREDIENTS';
    }

    // 5. SUBSTITUTION QUESTIONS
    if (/\b(instead of|substitute|substitution|can i replace|what can replace|replace\s+[a-z]+|alternative for)\b/i.test(text)) {
      return 'SUGGEST_SUBSTITUTION';
    }

    // 6. RECIPE SEARCH BY SPECIFIC INGREDIENT (Check before general recipe question to catch "what can I make with potatoes")
    if (
      /\b(recipes (using|with|containing|made with)|find recipes (using|with|containing)|show (me )?recipes (with|using|containing)|what can i (make|cook|prepare) (with|using)|give me recipes containing)\b/i.test(text)
    ) {
      // If the query specifically ends with generic pantry references, route to general FIND_RECIPES
      if (/\b(with|using)\s+(what i have|my pantry|my ingredients|pantry|current stock|current ingredients|available ingredients)\b/i.test(text)) {
        return 'FIND_RECIPES';
      }
      return 'FIND_RECIPES_BY_INGREDIENT';
    }

    // 7. GENERAL RECIPE QUESTIONS
    if (
      /\b(what can i (cook|make|prepare) with what i have|what can i (cook|make|prepare) with my (pantry|ingredients)|what can i (cook|make|prepare)$|what recipes can i make|show recipes|recipes i can make|what to cook|what to make|recommend recipes|suggest recipes|what can i cook|what can i make)\b/i.test(text)
    ) {
      return 'FIND_RECIPES';
    }

    // 8. COOKING STATUS
    if (/\b(cooking status|what is my cooking status|am i cooking|current cooking|continue cooking)\b/i.test(text)) {
      return 'GET_COOKING_STATUS';
    }

    // 9. START COOKING COMMAND
    if (/\b(start cooking|cook recipe|prepare recipe|open (the )?cooking studio|let's cook|lets cook)\b/i.test(text)) {
      return 'START_COOKING';
    }

    // 10. RECIPE DETAILS
    if (/\b(recipe details|how to make|instructions for|show recipe for)\b/i.test(text)) {
      return 'GET_RECIPE_DETAILS';
    }

    // 11. GENERAL PANTRY QUESTIONS (Must be checked BEFORE specific quantity/availability to catch "what ingredients do I have?")
    if (
      /^(what do i have|show (my )?pantry|what ingredients (do i have|are available)|what is in my (kitchen|pantry)|what's in my (kitchen|pantry)|list (my )?pantry|view pantry|show pantry|pantry stock|my ingredients)\b/i.test(text) ||
      /^what (do i have|ingredients do i have)\??$/i.test(text)
    ) {
      return 'GET_PANTRY';
    }

    // 12. SPECIFIC PANTRY ITEM QUANTITY QUERY
    if (/\b(how (much|many) .+ (do i have|is left|in my pantry|do we have)|amount of .+)\b/i.test(text)) {
      return 'GET_PANTRY_ITEM';
    }

    // 13. CHECK AVAILABILITY QUERY
    if (/\b(do i have|do we have|is there|have i got|do i have enough)\b/i.test(text)) {
      return 'CHECK_AVAILABILITY';
    }

    // 14. ADD PANTRY ITEM
    if (
      /^(add|put|bought|buy|store|stock|i bought|i have \d+)\b/i.test(text) ||
      /\b(add|put|bought|buy|store|stock)\s+\d+/i.test(text)
    ) {
      return 'ADD_PANTRY_ITEM';
    }

    // 15. REMOVE PANTRY ITEM
    if (
      /^(remove|delete|use|used|i used|subtract|take out)\b/i.test(text) ||
      /\btake\s+.+\s+out of (my )?pantry/i.test(text)
    ) {
      return 'REMOVE_PANTRY_ITEM';
    }

    // 16. UPDATE PANTRY ITEM
    if (/\b(update|change|set)\s+.+\s+(quantity|amount|to)\b/i.test(text)) {
      return 'UPDATE_PANTRY_ITEM';
    }

    return 'UNKNOWN';
  }

  /**
   * Layer 2 & 3: Dynamically extracts entities (name, quantity, unit, recipeName).
   */
  private static extractEntities(text: string, rawText: string, intent: AgentIntent): ExtractedEntities {
    const entities: ExtractedEntities = {};

    // 1. Extract numerical quantity
    const qtyMatch = text.match(/\b(\d+(\.\d+)?)\b/);
    if (qtyMatch) {
      entities.quantity = parseFloat(qtyMatch[1]);
    }

    // 2. Extract unit
    const unitPattern = /\b(kg|kgs|kilogram|kilograms|kilo|kilos|g|gm|gms|gram|grams|mg|mgs|l|ltr|ltrs|liter|liters|litre|litres|ml|mls|milliliter|milliliters|pcs|pc|piece|pieces|pack|packs|packet|packets|bottle|bottles|cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons)\b/i;
    const unitMatch = text.match(unitPattern);
    if (unitMatch) {
      const rawUnit = unitMatch[1].toLowerCase();
      entities.unit = UNIT_MAP[rawUnit] || 'pcs';
    } else if (entities.quantity) {
      entities.unit = 'pcs';
    }

    // 3. Extract Recipe Name for missing ingredients / cooking / recipe details
    if (intent === 'GET_MISSING_INGREDIENTS' || intent === 'START_COOKING' || intent === 'GET_RECIPE_DETAILS') {
      const recipeMatch = rawText.match(/(?:for|make|cook|prepare|recipe)\s+([a-zA-Z0-9\s]+?)(?:\?|$)/i);
      if (recipeMatch) {
        entities.recipeName = recipeMatch[1].trim();
      }
    }

    // 4. Extract Substitution Target Name
    if (intent === 'SUGGEST_SUBSTITUTION') {
      const subMatch = rawText.match(/(?:instead of|substitute for|substitute|for|replace|alternative for)\s+([a-zA-Z0-9\s]+?)(?:\?|$)/i);
      if (subMatch) {
        entities.name = this.cleanIngredientName(subMatch[1]);
      } else {
        const replaceMatch = rawText.match(/replace\s+([a-zA-Z0-9\s]+?)(?:\?|$)/i);
        if (replaceMatch) {
          entities.name = this.cleanIngredientName(replaceMatch[1]);
        }
      }
    }

    // 5. Extract Recipe Search Ingredient
    if (intent === 'FIND_RECIPES_BY_INGREDIENT') {
      const match = rawText.match(/(?:using|with|containing|made with)\s+([a-zA-Z0-9\s]+?)(?:\?|$)/i);
      if (match) {
        entities.name = this.cleanIngredientName(match[1]);
      }
    }

    // 6. Extract Ingredient Name for ADD, REMOVE, GET_PANTRY_ITEM, CHECK_AVAILABILITY
    if (
      intent === 'ADD_PANTRY_ITEM' ||
      intent === 'REMOVE_PANTRY_ITEM' ||
      intent === 'GET_PANTRY_ITEM' ||
      intent === 'CHECK_AVAILABILITY'
    ) {
      let extractedName = '';

      if (intent === 'GET_PANTRY_ITEM') {
        const itemMatch = text.match(/how (?:much|many)\s+([a-zA-Z0-9\s]+?)\s+(?:do i have|is left|in my pantry|do we have)/i);
        if (itemMatch) {
          extractedName = itemMatch[1];
        }
      }

      if (!extractedName && intent === 'CHECK_AVAILABILITY') {
        const checkMatch = text.match(/(?:do i have|do we have|is there|have i got|do i have enough)\s+(?:(\d+(\.\d+)?)\s*(?:[a-zA-Z]+)\s+)?([a-zA-Z0-9\s]+?)(?:\?|$)/i);
        if (checkMatch && checkMatch[3]) {
          extractedName = checkMatch[3];
        }
      }

      if (!extractedName) {
        // Dynamic string reduction: remove action words, numbers, units, locations, connectors
        extractedName = text
          .replace(/^(add|put|bought|buy|store|stock|i bought|i have|remove|delete|use|used|i used|subtract|take out|take)\b/ig, '')
          .replace(/\b(to|from|in|out of|into)\s+(my\s+)?pantry\b/ig, '')
          .replace(/\b(\d+(\.\d+)?)\b/g, '')
          .replace(unitPattern, '')
          .replace(/\b(of|some|a|an|the|my|out)\b/ig, '')
          .replace(/[?.,!]/g, '')
          .trim();
      }

      extractedName = this.cleanIngredientName(extractedName);
      if (extractedName) {
        entities.name = extractedName;
      }
    }

    return entities;
  }

  /**
   * Helper to clean dynamic ingredient names.
   * Strips noise words while preserving food terms.
   */
  private static cleanIngredientName(name: string): string {
    let cleaned = name.trim().toLowerCase();
    cleaned = cleaned.replace(/\b(of|some|a|an|the|my)\b/g, '').trim();

    if (!cleaned) return '';

    // Handle common plurals dynamically without destroying non-plural words like rice/couscous
    if (cleaned.endsWith('es') && (cleaned.endsWith('potatoes') || cleaned.endsWith('tomatoes') || cleaned.endsWith('mangoes'))) {
      cleaned = cleaned.slice(0, -2);
    } else if (cleaned.endsWith('s') && !cleaned.endsWith('ss') && cleaned.length > 3) {
      const nonPluralEnds = ['rice', 'cashews', 'couscous', 'hummus', 'grass'];
      if (!nonPluralEnds.some((e) => cleaned.endsWith(e))) {
        cleaned = cleaned.slice(0, -1);
      }
    }

    return cleaned;
  }

  /**
   * Layer 4: Validates parameters and checks for destructive confirmation requirements.
   * Read-only commands DO NOT require confirmation.
   */
  private static validateAction(
    intent: AgentIntent,
    entities: ExtractedEntities,
    rawText: string
  ): { passed: boolean; reason?: string } {
    if (intent === 'CLEAR_PANTRY') {
      return {
        passed: false,
        reason: 'Are you sure you want to clear all items from your Smart Pantry?'
      };
    }

    if (intent === 'REMOVE_PANTRY_ITEM') {
      if (entities.quantity && entities.quantity >= 20) {
        return {
          passed: false,
          reason: `Confirm removing a large quantity (${entities.quantity} ${entities.unit || ''} of ${entities.name || 'item'})?`
        };
      } else if (/delete all|clear all/i.test(rawText)) {
        return {
          passed: false,
          reason: `Confirm deleting "${entities.name || 'item'}" from your pantry?`
        };
      }
    }

    return { passed: true };
  }
}

