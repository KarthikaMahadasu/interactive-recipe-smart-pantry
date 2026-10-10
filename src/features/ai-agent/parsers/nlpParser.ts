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

export interface AgentConversationContext {
  lastRecipeName?: string;
  lastIngredientName?: string;
  lastMissingIngredients?: Array<{ name: string; amount: number; unit: string }>;
  lastIntent?: AgentIntent;
  lastTimestamp?: number;
}

export class NLPParser {
  static parse(command: string, memory?: AgentConversationContext): AgentAction {
    const rawCommand = command.trim();
    const normalizedCommand = this.normalizeText(rawCommand);

    let intent = this.detectIntent(normalizedCommand);
    
    // Follow-up context resolution for pronouns & omitted names
    if (memory && (Date.now() - (memory.lastTimestamp || 0) < 300000)) {
      if (/\b(them|those|all of them|all ingredients|they|it)\b/i.test(normalizedCommand)) {
        if (/\b(do we have|are available|have we got|in stock)\b/i.test(normalizedCommand) && memory.lastRecipeName) {
          intent = 'CHECK_RECIPE_AVAILABILITY';
        } else if (/\b(missing|needed|required)\b/i.test(normalizedCommand) && memory.lastRecipeName) {
          intent = 'GET_MISSING_INGREDIENTS';
        } else if (/\b(add|put|buy|grocery)\b/i.test(normalizedCommand) && memory.lastMissingIngredients && memory.lastMissingIngredients.length > 0) {
          intent = 'ADD_GROCERY_ITEM';
        }
      } else if (/^(what are we missing|what is missing|what's missing)\??$/i.test(normalizedCommand) && memory.lastRecipeName) {
        intent = 'GET_MISSING_INGREDIENTS';
      }
    }

    const parameters = this.extractEntities(normalizedCommand, intent, memory);
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
    if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/i.test(text)) {
      return 'GREETING';
    }
    if (/^(help|what can (you|i) (do|ask)|capabilities|commands|how to use|what can i do)\b/i.test(text)) {
      return 'HELP';
    }
    if (/\b(open camera|scan ingredient|scan item|camera scanner|scan barcode|take photo|scan this)\b/i.test(text)) {
      return 'OPEN_CAMERA';
    }
    if (/\b(who is (the )?manager|who is (the )?chef|who manages|manager of|staff role)\b/i.test(text)) {
      return 'GET_STAFF_ROLE';
    }
    if (/\b(who (is|are) (on )?staff|staff members|list staff|who works here|show staff|show employees)\b/i.test(text)) {
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
    if (/\b(pending grocery|pending groceries|needed groceries|grocery items pending|what is pending on grocery)\b/i.test(text)) {
      return 'GET_PENDING_GROCERIES';
    }
    if (/\b(purchased grocery|purchased groceries|bought groceries|what did we buy|what did we purchase)\b/i.test(text)) {
      return 'GET_PURCHASED_GROCERIES';
    }
    if (/\b(add .+ to (the )?grocery|add .+ to grocery list|put .+ on grocery list)\b/i.test(text)) {
      return 'ADD_GROCERY_ITEM';
    }
    if (/\b(update .+ on grocery|change grocery .+ quantity)\b/i.test(text)) {
      return 'UPDATE_GROCERY_ITEM';
    }
    if (/\b(create (a )?grocery list|generate grocery|what do we need to buy|grocery list for low|prepare grocery list|what should we buy)\b/i.test(text)) {
      return 'GENERATE_GROCERY_LIST';
    }
    if (/\b(show grocery|show high priority grocery|what is on (the )?grocery list|what groceries do we need|get grocery list|grocery history)\b/i.test(text)) {
      return 'GET_GROCERY_STATUS';
    }
    if (/\b(wasted|spoiled|discarded|thrown away|waste recorded|we wasted)\b/i.test(text)) {
      return 'RECORD_WASTE';
    }
    if (/\b(we used|kitchen used|used \d+|deduct \d+|\d+ .+ was used|i used)\b/i.test(text)) {
      return 'RECORD_USAGE';
    }
    if (/\b(correct .+ stock|adjust .+ stock|reconcile .+ stock|physical .+ stock|update .+ stock to)\b/i.test(text)) {
      return 'ADJUST_STOCK';
    }
    if (/\b(inventory changes|inventory history|audit log|what was used today|show today's inventory|what happened to inventory|show today's inventory activity|what did we use today)\b/i.test(text)) {
      return 'GET_INVENTORY_HISTORY';
    }
    if (/^(clear (my )?pantry|delete all pantry|empty (my )?pantry|reset pantry)\b/i.test(text)) {
      return 'CLEAR_PANTRY';
    }
    if (/\b(what is low stock|what ingredients are low|what is out of stock|low stock items|out of stock|running low)\b/i.test(text)) {
      return 'GET_LOW_STOCK_ITEMS';
    }
    if (/\b(expir(ing|e|es)|about to expire|use first|what should i use first|what to use first|freshness|spoiling|going bad|what expires soon)\b/i.test(text)) {
      return 'GET_EXPIRING_ITEMS';
    }
    if (/\b(show me (the )?ingredients|ingredients (of|for|in)|give me (the )?ingredients (for|of)|what are the ingredients|what ingredients are required for|recipe ingredients|what spices|spices (do we need|for|in))\b/i.test(text)) {
      return 'GET_RECIPE_INGREDIENTS';
    }
    if (
      /^(what can we (cook|make|prepare)|what can i (cook|make|prepare)|what can i (cook|make|prepare) with what (we|i) have|what can i (cook|make|prepare) with my (pantry|ingredients)|what recipes can i make|show recipes|show recipes i can make now|recipes i can make|what to cook|what to make|recommend recipes|suggest recipes)\??$/i.test(text)
    ) {
      return 'FIND_RECIPES';
    }
    if (/\b(can we (make|cook|prepare)|can i (make|cook|prepare)|can we prepare these dishes|do we have ingredients for|check recipe availability|do we have all of them|do we have everything needed for)\s+.*/i.test(text) || /can we prepare (these|the) dishes/i.test(text)) {
      return 'CHECK_RECIPE_AVAILABILITY';
    }
    if (
      /\b(which ingredients are missing|what am i missing|missing for|ingredients (needed|required) for|what (ingredients )?do i need for|what (ingredients )?do we need for|do i have everything for|do we have everything for|what do i need to (make|cook|prepare)|what are we missing)\b/i.test(text)
    ) {
      return 'GET_MISSING_INGREDIENTS';
    }
    if (/\b(how much oil|how much salt|how much oil and salt|how much .+ will we use|amount of .+ will we use)\b/i.test(text)) {
      return 'GET_RECIPE_INGREDIENTS';
    }
    if (/\b(instead of|substitute|substitution|can i replace|what can replace|replace\s+[a-z]+|alternative for)\b/i.test(text)) {
      return 'SUGGEST_SUBSTITUTION';
    }
    if (
      /\b(recipes (using|with|containing|made with)|find recipes (using|with|containing)|show (me )?recipes (with|using|containing)|give me recipes (containing|with|using)|what can i (make|cook|prepare) (with|using)|what can we (make|cook|prepare) (with|using))\b/i.test(text)
    ) {
      if (/\b(with|using)\s+(what i have|what we have|my pantry|our pantry|my ingredients|our ingredients|pantry|current stock|current ingredients|available ingredients)\b/i.test(text)) {
        return 'FIND_RECIPES';
      }
      return 'FIND_RECIPES_BY_INGREDIENT';
    }
    if (/\b(complete cooking|finish cooking|done cooking|end cooking)\b/i.test(text)) {
      return 'COMPLETE_COOKING';
    }
    if (/\b(cooking status|what is my cooking status|what is the cooking status|am i cooking|current cooking|continue cooking)\b/i.test(text)) {
      return 'GET_COOKING_STATUS';
    }
    if (
      /^(cook|prepare|make|start cooking)\s+/i.test(text) ||
      /\b(start cooking|cook recipe|prepare recipe|open (the )?cooking studio|let's cook|lets cook)\b/i.test(text)
    ) {
      return 'START_COOKING';
    }
    if (/\b(recipe details|how to make|instructions for|show recipe for)\b/i.test(text)) {
      return 'GET_RECIPE_DETAILS';
    }
    if (
      /^(what do we have|show (my|our) pantry|what ingredients (do i have|do we have|are available)|what is in (my|our) (kitchen|pantry)|what's in (my|our) (kitchen|pantry)|list (my|our) pantry|view pantry|show pantry|pantry stock|(my|our) ingredients|check inventory|get inventory|what is currently in our kitchen)\b/i.test(text) ||
      /^what (do i have|do we have|ingredients do i have|ingredients do we have)\??$/i.test(text)
    ) {
      return 'GET_PANTRY';
    }
    if (/\b(how much .+ (do we have|do i have|is left|are left|in my pantry|in our pantry|in inventory|in restaurant inventory|in kitchen)|what's our .+ stock|what is our .+ stock|check .+ inventory|amount of .+)\b/i.test(text)) {
      return 'GET_PANTRY_ITEM';
    }
    if (/\b(do i have|do we have|is there|are there|have i got|have we got|do i have enough|do we have enough|are we running low on)\b/i.test(text)) {
      return 'CHECK_AVAILABILITY';
    }
    if (
      /^(add|put|bought|buy|store|stock|i bought|i have \d+)\b/i.test(text) ||
      /\b(add|put|bought|buy|store|stock)\s+\d+/i.test(text)
    ) {
      return 'ADD_PANTRY_ITEM';
    }
    if (
      /^(remove|delete|use|used|i used|we used|subtract|take out)\b/i.test(text) ||
      /\btake\s+.+\s+out of (my|our) pantry/i.test(text)
    ) {
      return 'REMOVE_PANTRY_ITEM';
    }
    if (/\b(update|change|set)\s+.+\s+(quantity|amount|to)\b/i.test(text)) {
      return 'UPDATE_PANTRY_ITEM';
    }
    return 'UNKNOWN';
  }

  private static extractEntities(text: string, intent: AgentIntent, memory?: AgentConversationContext): ExtractedEntities {
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

    // Use context memory for omitted names or pronouns ("them", "those", "it")
    if (
      (intent === 'CHECK_RECIPE_AVAILABILITY' || intent === 'GET_MISSING_INGREDIENTS' || intent === 'GET_RECIPE_INGREDIENTS') &&
      (!text.includes('curry') && !text.includes('biryani') && !text.includes('bowl') && !text.includes('fry') && !text.includes('porridge') && !text.includes('pasta')) &&
      memory?.lastRecipeName
    ) {
      entities.name = memory.lastRecipeName;
      entities.recipeName = memory.lastRecipeName;
      entities.targetIngredient = memory.lastRecipeName;
      return entities;
    }

    if (
      (intent === 'RECORD_USAGE' || intent === 'RECORD_WASTE' || intent === 'REMOVE_PANTRY_ITEM' || intent === 'GET_PANTRY_ITEM') &&
      !entities.name &&
      memory?.lastIngredientName &&
      /\b(them|it|that|this)\b/i.test(text)
    ) {
      entities.name = memory.lastIngredientName;
      entities.recipeName = memory.lastIngredientName;
      entities.targetIngredient = memory.lastIngredientName;
    }

    if (
      intent !== 'GET_PANTRY' &&
      intent !== 'GET_LOW_STOCK_ITEMS' &&
      intent !== 'GET_EXPIRING_ITEMS' &&
      intent !== 'GET_COOKING_STATUS' &&
      intent !== 'COMPLETE_COOKING' &&
      intent !== 'CLEAR_PANTRY' &&
      intent !== 'HELP' &&
      intent !== 'GREETING' &&
      intent !== 'OPEN_CAMERA' &&
      intent !== 'GET_STAFF' &&
      intent !== 'GET_STAFF_ROLE' &&
      intent !== 'GET_INVENTORY_HISTORY' &&
      intent !== 'GENERATE_GROCERY_LIST' &&
      intent !== 'GET_GROCERY_STATUS' &&
      intent !== 'GET_PENDING_GROCERIES' &&
      intent !== 'GET_PURCHASED_GROCERIES' &&
      intent !== 'UNKNOWN'
    ) {
      if (intent === 'FIND_RECIPES' && !/\b(with|using)\b/i.test(text)) {
        return entities;
      }

      let extracted = text;

      // Remove numbers and units
      extracted = extracted.replace(/\b(\d+(\.\d+)?)\b/g, '');
      extracted = extracted.replace(unitPattern, '');

      // Prefixes to remove (longer/more specific first!)
      const prefixesToRemove = [
        /^(what are the|give me the|give me|what are|what's the) ingredients (for|of|in) /i,
        /^(what|what's|what is) (ingredients )?(do i|do we) (need|require) (for|to make|to cook)? /i,
        /^(what|what's|what is) (can i|can we|am i|are we|do i|do we) (missing|need|require|make|cook|prepare) (for|to make|to cook|with)? /i,
        /^what can (i|we)? (use|substitute)? (instead of|for) /i,
        /^what can (i|we)? (replace|substitute) /i,
        /^what am i missing for /i,
        /^what are we missing for /i,
        /^how (much|many) (of )?/i,
        /^check (if we have|if i have|our|my|the)? /i,
        /^amount of /i,
        /^quantity of /i,
        /^count of /i,
        /^do (i|we) have (everything|any|enough)? (for|to make)? /i,
        /^do (i|we) (need|have)? /i,
        /^(is|are) there (any)? /i,
        /^have (we|i) got (any)? /i,
        /^find recipes (using|with|containing) /i,
        /^show (me )?recipes (with|using|containing) /i,
        /^give me recipes (containing|with|using) /i,
        /^recipes (using|with|containing) /i,
        /^instead of /i,
        /^substitute for /i,
        /^can i substitute /i,
        /^alternative for /i,
        /^start cooking /i,
        /^start /i,
        /^cook /i,
        /^add /i,
        /^put /i,
        /^bought /i,
        /^buy /i,
        /^store /i,
        /^i bought /i,
        /^i have /i,
        /^remove /i,
        /^delete /i,
        /^use /i,
        /^used /i,
        /^we used /i,
        /^i used /i,
        /^kitchen used /i,
        /^deduct /i,
        /^take out /i,
        /^take /i,
        /^wasted /i,
        /^spoiled /i,
        /^discarded /i,
        /^correct /i,
        /^adjust /i,
        /^arrived /i,
        /^received /i,
        /^mark /i,
        /^as purchased /i,
        /^(what|what's|what is) (our|my|the) /i,
        /^(what|what's|what is) /i
      ];

      for (const prefix of prefixesToRemove) {
        extracted = extracted.replace(prefix, '');
      }

      // Suffixes & location indicators to remove
      const suffixesToRemove = [
        /\s+(do we have|do i have|have we|have i)\b.*/i,
        /\s+(is left|are left|left)\b.*/i,
        /\s+(in our restaurant inventory|in our restaurant|in the restaurant inventory|in the restaurant|in shared inventory|in inventory|in our kitchen inventory|in our kitchen|in my kitchen|in my pantry|in our pantry|in pantry|in stock|out of my pantry|out of pantry|out of stock)\b.*/i,
        /\s+(in our|in my|in the|on the|on grocery list|to grocery list|to grocery|on grocery)\b.*/i,
        /\s+(for grocery list|for grocery|from my pantry|from pantry|from stock)\b.*/i,
        /\s+(today|now)\b.*/i
      ];

      for (const suffix of suffixesToRemove) {
        extracted = extracted.replace(suffix, '');
      }

      // Clean out residual words and punctuation
      extracted = extracted
        .replace(/\b(to|from|in|out of|into|the|grocery|list|pantry|stock|inventory|recipe|ingredients|our|my|a|an|some|any|for|with|of|has|is|are|do|does|did|we|i|you|me|us|restaurant|kitchen|shared)\b/ig, ' ')
        .replace(/[?.,!]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      extracted = this.cleanIngredientName(extracted);
      if (extracted) {
        entities.name = extracted;
        entities.recipeName = extracted;
        entities.targetIngredient = extracted;
      }
    }

    return entities;
  }

  private static cleanIngredientName(name: string): string {
    let cleaned = name.trim().toLowerCase();
    cleaned = cleaned.replace(/\b(of|some|a|an|the|my|our)\b/g, '').replace(/\s+/g, ' ').trim();
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


