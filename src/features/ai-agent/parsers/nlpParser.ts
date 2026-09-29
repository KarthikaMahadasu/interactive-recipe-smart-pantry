import type { AgentAction, AgentIntent, ExtractedEntities } from '../types/agentTypes';

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
  static parse(command: string): AgentAction {
    const rawCommand = command.trim();
    const normalizedCommand = this.normalizeText(rawCommand);

    const intent = this.detectIntent(normalizedCommand);
    const parameters = this.extractEntities(normalizedCommand, intent);
    const validationResult = this.validateAction(intent);

    let confidence = 0.5;
    if (intent !== 'UNKNOWN') {
      confidence = 0.85;
      if (parameters.name || parameters.recipeName || intent === 'GET_PANTRY' || intent === 'FIND_RECIPES' || intent === 'GENERATE_GROCERY_LIST') {
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

  static normalizeText(text: string): string {
    let normalized = text.trim().toLowerCase();
    normalized = normalized.replace(/\s+/g, ' ');
    return normalized;
  }

  private static detectIntent(text: string): AgentIntent {
    if (/^(help|what can (you|i) (do|ask)|capabilities|commands|how to use|what can i do)\b/i.test(text)) {
      return 'HELP';
    }
    if (/\b(who (is|are) (on )?staff|staff members|list staff|who works here|show staff)\b/i.test(text)) {
      return 'GET_STAFF';
    }
    if (/\b(who (added|received|recorded|updated|deleted|wasted))\b/i.test(text)) {
      return 'GET_INVENTORY_HISTORY';
    }
    if (/\b(arrived|received delivery|delivery arrived|received \d+|delivery of)\b/i.test(text)) {
      return 'RECEIVE_GROCERY';
    }
    if (/\b(mark .+ as purchased|purchased .+|bought .+ for grocery)\b/i.test(text)) {
      return 'MARK_GROCERY_PURCHASED';
    }
    if (/\b(add .+ to (the )?grocery|add .+ to grocery list|put .+ on grocery list)\b/i.test(text)) {
      return 'ADD_GROCERY_ITEM';
    }
    if (/\b(update .+ on grocery|change grocery .+ quantity)\b/i.test(text)) {
      return 'UPDATE_GROCERY_ITEM';
    }
    if (/\b(create (a )?grocery list|generate grocery|what do we need to buy|grocery list for low|prepare grocery list)\b/i.test(text)) {
      return 'GENERATE_GROCERY_LIST';
    }
    if (/\b(show grocery|show high priority grocery|what is on (the )?grocery list|what groceries do we need|get grocery list|grocery history)\b/i.test(text)) {
      return 'GET_GROCERY_STATUS';
    }
    if (/\b(wasted|spoiled|discarded|thrown away|waste recorded|we wasted)\b/i.test(text)) {
      return 'RECORD_WASTE';
    }
    if (/\b(we used|kitchen used|used \d+|deduct \d+|\d+ .+ was used)\b/i.test(text)) {
      return 'RECORD_USAGE';
    }
    if (/\b(correct .+ stock|adjust .+ stock|reconcile .+ stock|physical .+ stock)\b/i.test(text)) {
      return 'ADJUST_STOCK';
    }
    if (/\b(inventory changes|inventory history|audit log|what was used today|show today's inventory|what happened to inventory)\b/i.test(text)) {
      return 'GET_INVENTORY_HISTORY';
    }
    if (/^(clear (my )?pantry|delete all pantry|empty (my )?pantry|reset pantry)\b/i.test(text)) {
      return 'CLEAR_PANTRY';
    }
    if (/\b(what is low stock|what ingredients are low|what is out of stock|low stock items|out of stock)\b/i.test(text)) {
      return 'GET_LOW_STOCK_ITEMS';
    }
    if (/\b(expir(ing|e|es)|about to expire|use first|what should i use first|what to use first|freshness|spoiling|going bad|what expires soon)\b/i.test(text)) {
      return 'GET_EXPIRING_ITEMS';
    }
    if (/\b(can we (make|cook|prepare)|can i make|can we prepare|do we have ingredients for|check recipe availability)\b/i.test(text)) {
      return 'CHECK_RECIPE_AVAILABILITY';
    }
    if (
      /\b(what am i missing|missing for|ingredients (needed|required) for|what (ingredients )?do i need for|do i have everything for|what do i need to (make|cook|prepare))\b/i.test(text)
    ) {
      return 'GET_MISSING_INGREDIENTS';
    }
    if (/\b(instead of|substitute|substitution|can i replace|what can replace|replace\s+[a-z]+|alternative for)\b/i.test(text)) {
      return 'SUGGEST_SUBSTITUTION';
    }
    if (
      /\b(recipes (using|with|containing|made with)|find recipes (using|with|containing)|show (me )?recipes (with|using|containing)|what can i (make|cook|prepare) (with|using)|give me recipes containing)\b/i.test(text)
    ) {
      if (/\b(with|using)\s+(what i have|my pantry|my ingredients|pantry|current stock|current ingredients|available ingredients)\b/i.test(text)) {
        return 'FIND_RECIPES';
      }
      return 'FIND_RECIPES_BY_INGREDIENT';
    }
    if (
      /\b(what can we (cook|make|prepare)|what can i (cook|make|prepare) with what we have|what can i (cook|make|prepare) with my (pantry|ingredients)|what can i (cook|make|prepare)$|what recipes can i make|show recipes|recipes i can make|what to cook|what to make|recommend recipes|suggest recipes|what can i cook|what can i make)\b/i.test(text)
    ) {
      return 'FIND_RECIPES';
    }
    if (/\b(complete cooking|finish cooking|done cooking|end cooking)\b/i.test(text)) {
      return 'COMPLETE_COOKING';
    }
    if (/\b(cooking status|what is my cooking status|what is the cooking status|am i cooking|current cooking|continue cooking)\b/i.test(text)) {
      return 'GET_COOKING_STATUS';
    }
    if (/\b(start cooking|cook recipe|prepare recipe|open (the )?cooking studio|let's cook|lets cook|start \w+)\b/i.test(text)) {
      return 'START_COOKING';
    }
    if (/\b(recipe details|how to make|instructions for|show recipe for)\b/i.test(text)) {
      return 'GET_RECIPE_DETAILS';
    }
    if (
      /^(what do we have|show (my )?pantry|what ingredients (do i have|are available)|what is in my (kitchen|pantry)|what's in my (kitchen|pantry)|list (my )?pantry|view pantry|show pantry|pantry stock|my ingredients|check inventory|get inventory)\b/i.test(text) ||
      /^what (do i have|ingredients do i have)\??$/i.test(text)
    ) {
      return 'GET_PANTRY';
    }
    if (/\b(how much .+ (do we have|do i have|is left|in my pantry)|what's our .+ stock|check .+ inventory|amount of .+)\b/i.test(text)) {
      return 'GET_PANTRY_ITEM';
    }
    if (/\b(do i have|do we have|is there|have i got|do i have enough)\b/i.test(text)) {
      return 'CHECK_AVAILABILITY';
    }
    if (
      /^(add|put|bought|buy|store|stock|i bought|i have \d+)\b/i.test(text) ||
      /\b(add|put|bought|buy|store|stock)\s+\d+/i.test(text)
    ) {
      return 'ADD_PANTRY_ITEM';
    }
    if (
      /^(remove|delete|use|used|i used|subtract|take out)\b/i.test(text) ||
      /\btake\s+.+\s+out of (my )?pantry/i.test(text)
    ) {
      return 'REMOVE_PANTRY_ITEM';
    }
    if (/\b(update|change|set)\s+.+\s+(quantity|amount|to)\b/i.test(text)) {
      return 'UPDATE_PANTRY_ITEM';
    }
    return 'UNKNOWN';
  }

  private static extractEntities(text: string, intent: AgentIntent): ExtractedEntities {
    const entities: ExtractedEntities = {};

    const qtyMatch = text.match(/\b(\d+(\.\d+)?)\b/);
    if (qtyMatch) {
      entities.quantity = parseFloat(qtyMatch[1]);
    }

    const unitPattern = /\b(kg|kgs|kilogram|kilograms|kilo|kilos|g|gm|gms|gram|grams|mg|mgs|l|ltr|ltrs|liter|liters|litre|litres|ml|mls|milliliter|milliliters|pcs|pc|piece|pieces|pack|packs|packet|packets|bottle|bottles|cup|cups|tbsp|tablespoon|tablespoons|tsp|teaspoon|teaspoons)\b/i;
    const unitMatch = text.match(unitPattern);
    if (unitMatch) {
      const rawUnit = unitMatch[1].toLowerCase();
      entities.unit = UNIT_MAP[rawUnit] || 'pcs';
    } else if (entities.quantity) {
      entities.unit = 'pcs';
    }

    if (
      intent === 'ADD_PANTRY_ITEM' ||
      intent === 'REMOVE_PANTRY_ITEM' ||
      intent === 'RECORD_USAGE' ||
      intent === 'RECORD_WASTE' ||
      intent === 'ADJUST_STOCK' ||
      intent === 'ADD_GROCERY_ITEM' ||
      intent === 'MARK_GROCERY_PURCHASED' ||
      intent === 'RECEIVE_GROCERY' ||
      intent === 'GET_PANTRY_ITEM' ||
      intent === 'CHECK_AVAILABILITY' ||
      intent === 'START_COOKING' ||
      intent === 'CHECK_RECIPE_AVAILABILITY' ||
      intent === 'GET_MISSING_INGREDIENTS' ||
      intent === 'FIND_RECIPES_BY_INGREDIENT' ||
      intent === 'SUGGEST_SUBSTITUTION'
    ) {
      let extractedName = text
        .replace(/^(add|put|bought|buy|store|stock|i bought|i have|remove|delete|use|used|we used|wasted|spoiled|discarded|correct|adjust|arrived|received|mark|as purchased|start cooking|start|cook|find recipes using|find recipes with|recipes using|recipes with|can we make|can we cook|instead of|substitute for|alternative for)\b/ig, '')
        .replace(/\b(to|from|in|out of|into|the|grocery|list|pantry|stock|inventory|recipe|ingredients)\b/ig, '')
        .replace(/\b(\d+(\.\d+)?)\b/g, '')
        .replace(unitPattern, '')
        .replace(/\b(of|some|a|an|my|today|has|for|with)\b/ig, '')
        .replace(/[?.,!]/g, '')
        .trim();

      extractedName = this.cleanIngredientName(extractedName);
      if (extractedName) {
        entities.name = extractedName;
        entities.recipeName = extractedName;
        entities.targetIngredient = extractedName;
      }
    }

    return entities;
  }

  private static cleanIngredientName(name: string): string {
    let cleaned = name.trim().toLowerCase();
    cleaned = cleaned.replace(/\b(of|some|a|an|the|my)\b/g, '').trim();
    if (!cleaned) return '';

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

  private static validateAction(intent: AgentIntent): { passed: boolean; reason?: string } {
    if (intent === 'CLEAR_PANTRY') {
      return {
        passed: false,
        reason: 'Are you sure you want to clear all items from your Smart Pantry?'
      };
    }
    return { passed: true };
  }
}
