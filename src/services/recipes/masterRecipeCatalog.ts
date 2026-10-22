import type { Recipe } from '../../types/recipe';

export const MASTER_RECIPE_CATALOG: Recipe[] = [
  // ==========================================
  // 1. CAKES & CUPCAKES
  // ==========================================
  {
    id: 'rec_chocolate_cake',
    title: 'Decadent Moist Chocolate Cake',
    description: 'Rich, tender chocolate sponge layered with cocoa aroma, baked to perfection with a glossy chocolate finish. Can be made with or without eggs.',
    prepTime: 20,
    cookTime: 35,
    servings: 6,
    difficulty: 'Medium',
    category: 'Cakes & Baking',
    cookingCategory: 'cake',
    cuisine: 'Bakery',
    dietaryTags: ['Vegetarian', 'Eggless-Adaptable', 'Bake-Favorite'],
    equipment: ['9-inch Round Cake Tin', 'Oven or Stovetop Cooker', 'Whisk', 'Mixing Bowls', 'Sifter', 'Toothpick / Cake Tester', 'Parchment Paper'],
    temperature: '175°C (350°F)',
    storageGuidance: 'Store in an airtight container at room temperature for up to 3 days or refrigerated for 6 days.',
    safetyNotes: 'Use oven mitts when removing hot cake pans from the oven. Ensure oven preheats safely before placing batter.',
    ingredients: [
      { name: 'All-Purpose Flour', amount: 250, unit: 'g', note: 'Sifted fine cake/all-purpose flour', preparationNote: 'Sifted with cocoa' },
      { name: 'Sugar', amount: 200, unit: 'g', note: 'Fine granulated white or castor sugar' },
      { name: 'Cocoa Powder', amount: 60, unit: 'g', note: 'Unsweetened Dutch-processed or natural cocoa powder' },
      { name: 'Baking Powder', amount: 8, unit: 'g', note: 'Leavening agent (approx 2 tsp)' },
      { name: 'Baking Soda', amount: 4, unit: 'g', note: 'For rise and deep crumb color (approx 1 tsp)' },
      { name: 'Salt', amount: 3, unit: 'g', note: 'Balances chocolate intensity' },
      { name: 'Milk', amount: 240, unit: 'ml', note: 'Warm whole milk or plant milk (almond/soy)' },
      { name: 'Cooking Oil', amount: 100, unit: 'ml', note: 'Neutral vegetable or sunflower oil for lasting moisture' },
      { name: 'Vanilla Extract', amount: 5, unit: 'ml', note: 'Pure vanilla extract' },
      { name: 'Eggs', amount: 2, unit: 'pcs', optional: true, note: 'For classic bake (replace with 120g yogurt/buttermilk for eggless)' },
      { name: 'Hot Water', amount: 120, unit: 'ml', note: 'Blooms the cocoa powder into intense chocolate flavor' }
    ],
    instructions: [
      {
        step: 1,
        text: 'Preheat oven to 175°C (350°F). Grease a 9-inch round cake pan with butter/oil and line the base with parchment paper.',
        durationMinutes: 5,
        ingredientsUsed: ['Cooking Oil'],
        temperature: '175°C (350°F)',
        equipmentRequired: ['9-inch Round Cake Tin', 'Parchment Paper', 'Oven or Stovetop Cooker'],
        tip: 'Preheating guarantees an even rise and prevents cake sagging.'
      },
      {
        step: 2,
        text: 'In a large bowl, sift together 250 g All-Purpose Flour, 60 g Cocoa Powder, 8 g Baking Powder, 4 g Baking Soda, and 3 g Salt. Whisk in 200 g Sugar.',
        durationMinutes: 5,
        ingredientsUsed: ['All-Purpose Flour', 'Cocoa Powder', 'Baking Powder', 'Baking Soda', 'Salt', 'Sugar'],
        equipmentRequired: ['Sifter', 'Mixing Bowls', 'Whisk'],
        tip: 'Sifting breaks lumps in cocoa powder for a silky batter.'
      },
      {
        step: 3,
        text: 'In a separate bowl, whisk together 240 ml Milk, 100 ml Cooking Oil, 5 ml Vanilla Extract, and 2 Eggs (or 120 g yogurt for eggless variation) until emulsified.',
        durationMinutes: 4,
        ingredientsUsed: ['Milk', 'Cooking Oil', 'Vanilla Extract', 'Eggs'],
        equipmentRequired: ['Mixing Bowls', 'Whisk'],
        tip: 'Room-temperature liquids blend much more smoothly.'
      },
      {
        step: 4,
        text: 'Pour the wet ingredients into the dry bowl and mix gently until combined. Pour in 120 ml Hot Water and stir until smooth (batter will be delightfully thin).',
        durationMinutes: 3,
        ingredientsUsed: ['Hot Water'],
        equipmentRequired: ['Whisk'],
        tip: 'Hot water blooms the cocoa, intensifying the chocolate depth.'
      },
      {
        step: 5,
        text: 'Pour the batter into the prepared pan. Bake at 175°C for 30-35 minutes until a toothpick inserted into the center comes out clean or with a few moist crumbs.',
        durationMinutes: 35,
        ingredientsUsed: [],
        temperature: '175°C (350°F)',
        equipmentRequired: ['Oven or Stovetop Cooker', 'Toothpick / Cake Tester'],
        tip: 'Do not open the oven door during the first 20 minutes to prevent sinking.'
      },
      {
        step: 6,
        text: 'Cool in the pan for 10 minutes on a wire rack, then invert onto a serving plate. Let cool completely before slicing or frosting.',
        durationMinutes: 10,
        ingredientsUsed: [],
        tip: 'Never frost a warm cake; heat melts frosting instantly.'
      }
    ],
    nutrition: { calories: 340, protein: 6, carbs: 48, fat: 14 }
  },

  {
    id: 'rec_vanilla_cupcakes',
    title: 'Fluffy Golden Vanilla Cupcakes',
    description: 'Classic bakery-style golden cupcakes with a tender crumb, buttery sweetness, and delicate vanilla aroma.',
    prepTime: 15,
    cookTime: 20,
    servings: 6,
    difficulty: 'Easy',
    category: 'Cakes & Baking',
    cookingCategory: 'cupcake',
    cuisine: 'Bakery',
    dietaryTags: ['Vegetarian', 'Party-Favorite'],
    equipment: ['6-Cup Muffin / Cupcake Tray', 'Paper Cupcake Liners', 'Electric Hand Mixer or Whisk', 'Mixing Bowls', 'Oven'],
    temperature: '180°C (350°F)',
    storageGuidance: 'Store covered at room temperature for up to 4 days.',
    safetyNotes: 'Allow cupcake tray to cool before touching with bare hands.',
    ingredients: [
      { name: 'All-Purpose Flour', amount: 180, unit: 'g', note: 'Fine all-purpose flour' },
      { name: 'Sugar', amount: 150, unit: 'g', note: 'Granulated white sugar' },
      { name: 'Butter', amount: 100, unit: 'g', note: 'Unsalted butter softened at room temperature' },
      { name: 'Eggs', amount: 2, unit: 'pcs', note: 'Large room-temperature eggs' },
      { name: 'Milk', amount: 100, unit: 'ml', note: 'Whole milk' },
      { name: 'Baking Powder', amount: 6, unit: 'g', note: 'Leavening agent' },
      { name: 'Vanilla Extract', amount: 6, unit: 'ml', note: 'Pure vanilla extract' },
      { name: 'Salt', amount: 2, unit: 'g', note: 'Fine salt' }
    ],
    instructions: [
      {
        step: 1,
        text: 'Preheat oven to 180°C (350°F) and line a 6-muffin cupcake tin with paper liners.',
        durationMinutes: 5,
        ingredientsUsed: [],
        temperature: '180°C (350°F)',
        equipmentRequired: ['6-Cup Muffin / Cupcake Tray', 'Paper Cupcake Liners', 'Oven']
      },
      {
        step: 2,
        text: 'Beat 100 g softened Butter and 150 g Sugar together in a bowl until pale, fluffy, and creamy (approx 3 minutes).',
        durationMinutes: 4,
        ingredientsUsed: ['Butter', 'Sugar'],
        equipmentRequired: ['Mixing Bowls', 'Electric Hand Mixer or Whisk'],
        tip: 'Creaming incorporates air pockets for a light and tender cupcake.'
      },
      {
        step: 3,
        text: 'Add 2 Eggs one at a time, beating well after each addition. Stir in 6 ml Vanilla Extract.',
        durationMinutes: 3,
        ingredientsUsed: ['Eggs', 'Vanilla Extract'],
        equipmentRequired: ['Whisk']
      },
      {
        step: 4,
        text: 'Combine 180 g Flour, 6 g Baking Powder, and 2 g Salt. Alternate folding dry ingredients and 100 ml Milk into the creamed mixture until smooth.',
        durationMinutes: 4,
        ingredientsUsed: ['All-Purpose Flour', 'Baking Powder', 'Salt', 'Milk'],
        equipmentRequired: ['Mixing Bowls'],
        tip: 'Do not overmix once flour is added to maintain a soft crumb.'
      },
      {
        step: 5,
        text: 'Divide the batter evenly into the 6 cupcake liners, filling each 2/3 full.',
        durationMinutes: 2,
        ingredientsUsed: [],
        equipmentRequired: ['6-Cup Muffin / Cupcake Tray']
      },
      {
        step: 6,
        text: 'Bake at 180°C for 18-20 minutes until cupcake tops spring back when gently pressed. Cool completely before decorating.',
        durationMinutes: 20,
        ingredientsUsed: [],
        temperature: '180°C (350°F)',
        equipmentRequired: ['Oven']
      }
    ],
    nutrition: { calories: 290, protein: 4, carbs: 40, fat: 13 }
  },

  // ==========================================
  // 2. COOKIES & BROWNIES (OVEN & NO-OVEN)
  // ==========================================
  {
    id: 'rec_stovetop_brownies',
    title: 'Fudgy Chocolate Brownies (No-Oven / Stovetop & Oven)',
    description: 'Super fudgy, dense chocolate brownies featuring crinkly tops and molten centers. Easily prepared on a gas stovetop using a heavy pot or in a conventional oven.',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    difficulty: 'Easy',
    category: 'Cookies & Brownies',
    cookingCategory: 'brownie',
    cuisine: 'American Bakery',
    dietaryTags: ['Vegetarian', 'No-Oven-Friendly', 'Comfort-Dessert'],
    equipment: ['Heavy-Bottom Pot / Cooker with Lid (for no-oven) or 8-inch Square Pan', 'Trivet / Stand', 'Heatproof Mixing Bowl', 'Whisk', 'Spatula'],
    temperature: 'Stovetop Low Flame or 170°C (340°F) Oven',
    storageGuidance: 'Keep in an airtight box for 5 days. Warm slightly before serving with ice cream.',
    safetyNotes: 'Heavy bottom pot will be extremely hot. Handle trivet and baking tin with silicone tongs or heatproof gloves.',
    ingredients: [
      { name: 'Dark Chocolate', amount: 150, unit: 'g', note: 'Roughly chopped dark chocolate (55-70% cocoa)' },
      { name: 'Butter', amount: 90, unit: 'g', note: 'Unsalted butter' },
      { name: 'Sugar', amount: 140, unit: 'g', note: 'Granulated sugar' },
      { name: 'Eggs', amount: 2, unit: 'pcs', note: 'Room temperature eggs (or 80g sweetened condensed milk / curd for eggless)' },
      { name: 'All-Purpose Flour', amount: 75, unit: 'g', note: 'All-purpose flour for dense fudge structure' },
      { name: 'Cocoa Powder', amount: 25, unit: 'g', note: 'Unsweetened cocoa powder' },
      { name: 'Salt', amount: 2, unit: 'g', note: 'Balances richness' },
      { name: 'Vanilla Extract', amount: 4, unit: 'ml', note: 'Vanilla extract' },
      { name: 'Raw Cashews', amount: 40, unit: 'g', optional: true, note: 'Or walnuts, roughly chopped for crunch' }
    ],
    instructions: [
      {
        step: 1,
        text: '[Stovetop Prep]: Place a wire trivet or small ring inside a heavy-bottom pot or pressure cooker. Cover with lid (remove cooker rubber gasket & whistle) and preheat on medium flame for 10 minutes. [Oven Prep]: Preheat oven to 170°C.',
        durationMinutes: 10,
        ingredientsUsed: [],
        temperature: 'Medium flame preheat / 170°C',
        equipmentRequired: ['Heavy-Bottom Pot / Cooker with Lid (for no-oven) or 8-inch Square Pan', 'Trivet / Stand'],
        tip: 'Preheating the pot creates an even convection heat chamber identical to an oven.'
      },
      {
        step: 2,
        text: 'Melt 150 g Dark Chocolate and 90 g Butter together over a heatproof bowl set above simmering water (double boiler) or in short microwave bursts. Stir until silky smooth and glossy.',
        durationMinutes: 5,
        ingredientsUsed: ['Dark Chocolate', 'Butter'],
        equipmentRequired: ['Heatproof Mixing Bowl', 'Spatula'],
        tip: 'Never let water touch the chocolate to prevent seizing.'
      },
      {
        step: 3,
        text: 'In another bowl, whisk 2 Eggs and 140 g Sugar vigorously for 2 minutes until frothy. Stir in 4 ml Vanilla Extract.',
        durationMinutes: 3,
        ingredientsUsed: ['Eggs', 'Sugar', 'Vanilla Extract'],
        equipmentRequired: ['Whisk'],
        tip: 'Whisking eggs with sugar creates that iconic glossy, crinkly brownie top crust.'
      },
      {
        step: 4,
        text: 'Pour the warm melted chocolate-butter mixture into the egg mixture. Fold gently to combine.',
        durationMinutes: 2,
        ingredientsUsed: [],
        equipmentRequired: ['Spatula']
      },
      {
        step: 5,
        text: 'Sift in 75 g All-Purpose Flour, 25 g Cocoa Powder, and 2 g Salt. Fold gently until just combined. Stir in chopped Cashews if desired.',
        durationMinutes: 3,
        ingredientsUsed: ['All-Purpose Flour', 'Cocoa Powder', 'Salt', 'Raw Cashews'],
        equipmentRequired: ['Spatula'],
        tip: 'Do not overmix or your brownies will become bready instead of fudgy.'
      },
      {
        step: 6,
        text: 'Pour batter into a greased and lined 7-inch square or round baking tin. Place the tin on the trivet inside the hot preheated pot. Cover tightly and bake on low flame for 25-30 minutes (or in oven at 170°C for 22-25 mins).',
        durationMinutes: 30,
        ingredientsUsed: [],
        temperature: 'Low flame / 170°C',
        equipmentRequired: ['Heavy-Bottom Pot / Cooker with Lid (for no-oven) or 8-inch Square Pan'],
        tip: 'A toothpick in the center should come out with moist sticky fudge crumbs, NOT dry.'
      },
      {
        step: 7,
        text: 'Carefully remove the tin. Let brownies cool completely in the tin for 30 minutes to set before cutting into neat squares.',
        durationMinutes: 30,
        ingredientsUsed: [],
        tip: 'Warm brownies fall apart; cooling allows the fudge center to firm up beautifully.'
      }
    ],
    nutrition: { calories: 380, protein: 5, carbs: 42, fat: 22 }
  },

  // ==========================================
  // 3. PASTRIES & FLAKY DOUGH
  // ==========================================
  {
    id: 'rec_flaky_pastry',
    title: 'French Flaky Butter Pastries from Scratch',
    description: 'Authentic layered laminated puff pastry crafted from scratch with crisp golden layers, delicate butter lamination, and tender interior.',
    prepTime: 45,
    cookTime: 25,
    servings: 6,
    difficulty: 'Hard',
    category: 'Pastries',
    cookingCategory: 'pastry',
    cuisine: 'French Patisserie',
    dietaryTags: ['Vegetarian', 'Artisan-Baking'],
    equipment: ['Rolling Pin', 'Baking Sheet', 'Parchment Paper', 'Pastry Brush', 'Chef Knife', 'Refrigerator', 'Oven'],
    temperature: '200°C (400°F)',
    storageGuidance: 'Best enjoyed fresh. Baked pastries can be crisped in a warm oven for 5 minutes.',
    safetyNotes: 'Use sharp knife carefully when cutting dough laminations to preserve clean layers.',
    ingredients: [
      { name: 'All-Purpose Flour', amount: 300, unit: 'g', note: 'Fine all-purpose or pastry flour' },
      { name: 'Butter', amount: 200, unit: 'g', note: 'Cold unsalted butter, divided (50g for dough, 150g for butter block)' },
      { name: 'Salt', amount: 5, unit: 'g', note: 'Fine sea salt' },
      { name: 'Cold Water', amount: 150, unit: 'ml', note: 'Ice-cold filtered water' },
      { name: 'Sugar', amount: 15, unit: 'g', note: 'For subtle sweet balance and browning' },
      { name: 'Milk', amount: 20, unit: 'ml', optional: true, note: 'For golden pastry wash before baking' }
    ],
    instructions: [
      {
        step: 1,
        text: 'In a chilled bowl, mix 300 g Flour, 5 g Salt, and 15 g Sugar. Rub in 50 g cold cubed Butter until crumbly. Gradually add 150 ml Cold Water until a rough dough forms.',
        durationMinutes: 10,
        ingredientsUsed: ['All-Purpose Flour', 'Salt', 'Sugar', 'Butter', 'Cold Water'],
        equipmentRequired: ['Mixing Bowls'],
        tip: 'Everything must remain cold to prevent the butter from melting into the dough.'
      },
      {
        step: 2,
        text: 'Shape dough into a square, wrap in cling wrap, and chill in refrigerator for 25 minutes. Meanwhile, flatten remaining 150 g cold Butter between parchment sheets into a 5-inch butter square.',
        durationMinutes: 25,
        ingredientsUsed: ['Butter'],
        equipmentRequired: ['Rolling Pin', 'Parchment Paper', 'Refrigerator'],
        tip: 'The butter block and dough should have identical malleable consistency.'
      },
      {
        step: 3,
        text: 'Roll dough out twice as large as the butter block. Place butter in center, fold edges of dough over butter like an envelope, and seal all edges tightly.',
        durationMinutes: 5,
        ingredientsUsed: [],
        equipmentRequired: ['Rolling Pin']
      },
      {
        step: 4,
        text: 'Roll into a long rectangle. Fold bottom third up, then top third down (letter fold - Turn 1). Rotate 90 degrees and repeat fold (Turn 2). Chill for 20 minutes.',
        durationMinutes: 25,
        ingredientsUsed: [],
        equipmentRequired: ['Rolling Pin', 'Refrigerator'],
        tip: 'Laminating creates hundreds of alternating paper-thin butter and dough layers.'
      },
      {
        step: 5,
        text: 'Repeat two more turns (Turns 3 and 4). Chill dough for a final 20 minutes.',
        durationMinutes: 20,
        ingredientsUsed: [],
        equipmentRequired: ['Rolling Pin', 'Refrigerator']
      },
      {
        step: 6,
        text: 'Roll dough to 4 mm thickness. Cut into desired pastry rectangles or triangles using a sharp chef knife without dragging.',
        durationMinutes: 8,
        ingredientsUsed: [],
        equipmentRequired: ['Chef Knife', 'Rolling Pin', 'Baking Sheet', 'Parchment Paper']
      },
      {
        step: 7,
        text: 'Brush tops lightly with 20 ml Milk for golden sheen. Bake on parchment-lined baking sheet at 200°C (400°F) for 20-25 minutes until deeply golden and flaky.',
        durationMinutes: 25,
        ingredientsUsed: ['Milk'],
        temperature: '200°C (400°F)',
        equipmentRequired: ['Pastry Brush', 'Baking Sheet', 'Oven'],
        tip: 'High heat instantly vaporizes butter water, puffing the dough layers apart.'
      }
    ],
    nutrition: { calories: 390, protein: 5, carbs: 36, fat: 26 }
  },

  // ==========================================
  // 4. CHOCOLATE & CONFECTIONERY
  // ==========================================
  {
    id: 'rec_homemade_chocolate',
    title: 'Artisan Homemade Dark Chocolate',
    description: 'Pure, silky homemade dark chocolate made from real cocoa butter or virgin coconut oil and fine cocoa powder. Tempered for snap and glossy finish.',
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    difficulty: 'Medium',
    category: 'Chocolate & Confectionery',
    cookingCategory: 'chocolate',
    cuisine: 'Confectionery',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Dairy-Free', 'No-Bake'],
    equipment: ['Double Boiler / Glass Bowl over Saucepan', 'Silicone Chocolate Moulds', 'Silicone Spatula', 'Digital Thermometer / Spoon', 'Refrigerator'],
    temperature: 'Double Boiler Gentle Heat (< 48°C / 118°F)',
    storageGuidance: 'Store in an airtight container in a cool, dark pantry or refrigerator for up to 3 months.',
    safetyNotes: 'Steam from double boiler can burn. Keep water gently simmering, not boiling aggressively.',
    ingredients: [
      { name: 'Cocoa Butter', amount: 100, unit: 'g', note: 'Food-grade cocoa butter (or virgin unrefined coconut oil as alternative)' },
      { name: 'Cocoa Powder', amount: 70, unit: 'g', note: 'Fine Dutch-processed or raw unsweetened cocoa powder' },
      { name: 'Powdered Sugar', amount: 60, unit: 'g', note: 'Finely sifted powdered icing sugar or maple syrup' },
      { name: 'Vanilla Extract', amount: 4, unit: 'ml', note: 'Pure vanilla extract' },
      { name: 'Salt', amount: 1, unit: 'g', note: 'Pinch of sea salt to enhance chocolate notes' },
      { name: 'Raw Cashews', amount: 30, unit: 'g', optional: true, note: 'Toasted chopped cashews or sea salt flakes for topping' }
    ],
    instructions: [
      {
        step: 1,
        text: 'Set up a double boiler by placing a dry heatproof glass or stainless steel bowl over a small pot containing 1 inch of gently simmering water. Ensure the bottom of the bowl does not touch the water.',
        durationMinutes: 5,
        ingredientsUsed: [],
        temperature: 'Low simmer steam (< 48°C)',
        equipmentRequired: ['Double Boiler / Glass Bowl over Saucepan'],
        tip: 'Absolute dryness is critical: even a single drop of water will cause chocolate to seize into a grainy paste.'
      },
      {
        step: 2,
        text: 'Add 100 g Cocoa Butter (or virgin coconut oil) to the bowl. Stir slowly with a silicone spatula until completely melted and clear.',
        durationMinutes: 4,
        ingredientsUsed: ['Cocoa Butter'],
        equipmentRequired: ['Silicone Spatula']
      },
      {
        step: 3,
        text: 'Sift in 70 g Cocoa Powder and 60 g Powdered Sugar gradually, whisking continuously until the mixture is completely dissolved, silky, and glossy.',
        durationMinutes: 4,
        ingredientsUsed: ['Cocoa Powder', 'Powdered Sugar'],
        equipmentRequired: ['Silicone Spatula'],
        tip: 'Using powdered sweetener prevents any gritty crystal texture in the set chocolate.'
      },
      {
        step: 4,
        text: 'Stir in 4 ml Vanilla Extract and 1 g fine Salt. Remove the bowl from the steam heat.',
        durationMinutes: 2,
        ingredientsUsed: ['Vanilla Extract', 'Salt'],
        equipmentRequired: ['Silicone Spatula']
      },
      {
        step: 5,
        text: '[Tempering & Cooling]: Stir the liquid chocolate off the heat for 3-4 minutes until it cools slightly to around 29-31°C (84-88°F) and begins to thicken slightly.',
        durationMinutes: 4,
        ingredientsUsed: [],
        temperature: 'Cooling to 29-31°C (84-88°F)',
        tip: 'Gentle cooling and continuous agitation encourages stable crystal formation for a crisp snap.'
      },
      {
        step: 6,
        text: 'Pour the tempered chocolate into silicone chocolate bar or praline moulds. Tap moulds gently on the counter to release air bubbles. Garnish with chopped Cashews or sea salt if desired.',
        durationMinutes: 3,
        ingredientsUsed: ['Raw Cashews'],
        equipmentRequired: ['Silicone Chocolate Moulds']
      },
      {
        step: 7,
        text: 'Place moulds in the refrigerator for 30 minutes (or freezer for 15 minutes) until solid. Pop chocolate bars out cleanly from moulds.',
        durationMinutes: 30,
        ingredientsUsed: [],
        equipmentRequired: ['Refrigerator'],
        tip: 'Set chocolate will shrink by a fraction of a millimeter and release effortlessly.'
      }
    ],
    nutrition: { calories: 310, protein: 3, carbs: 19, fat: 26 }
  },

  {
    id: 'rec_chocolate_mousse',
    title: 'Velvety Chilled Chocolate Mousse',
    description: 'Airy, luxurious French dessert mousse with deep chocolate flavor, whipped cloud texture, and zero baking required.',
    prepTime: 20,
    cookTime: 5,
    servings: 4,
    difficulty: 'Medium',
    category: 'Puddings & Chilled Desserts',
    cookingCategory: 'chilled_dessert',
    cuisine: 'French',
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'No-Bake', 'Chilled-Dessert'],
    equipment: ['Double Boiler', 'Electric Hand Whisk / Beater', 'Dessert Glasses', 'Spatula', 'Refrigerator'],
    temperature: 'Chill at 4°C in Refrigerator',
    storageGuidance: 'Keep chilled in refrigerator covered with plastic wrap for up to 3 days.',
    safetyNotes: 'Chill thoroughly before serving.',
    ingredients: [
      { name: 'Dark Chocolate', amount: 150, unit: 'g', note: 'Good quality bittersweet or semi-sweet chocolate' },
      { name: 'Heavy Cream', amount: 200, unit: 'ml', note: 'Chilled whipping cream (or whipped aquafaba for vegan version)' },
      { name: 'Butter', amount: 20, unit: 'g', note: 'Unsalted butter for silkiness' },
      { name: 'Sugar', amount: 30, unit: 'g', note: 'Castor sugar' },
      { name: 'Vanilla Extract', amount: 4, unit: 'ml', note: 'Pure vanilla' },
      { name: 'Eggs', amount: 2, unit: 'pcs', optional: true, note: 'Separated (or omit eggs and increase whipping cream to 300ml for eggless mousse)' }
    ],
    instructions: [
      {
        step: 1,
        text: 'Chop 150 g Dark Chocolate and melt with 20 g Butter in a heatproof bowl set over simmering water until smooth. Remove and let cool to lukewarm.',
        durationMinutes: 5,
        ingredientsUsed: ['Dark Chocolate', 'Butter'],
        equipmentRequired: ['Double Boiler', 'Spatula'],
        tip: 'Chocolate must not be hot when folding into whipped cream, otherwise cream deflates.'
      },
      {
        step: 2,
        text: 'In a cold bowl, whip 200 ml chilled Heavy Cream with 30 g Sugar and 4 ml Vanilla Extract using an electric mixer until medium peaks form.',
        durationMinutes: 5,
        ingredientsUsed: ['Heavy Cream', 'Sugar', 'Vanilla Extract'],
        equipmentRequired: ['Electric Hand Whisk / Beater'],
        tip: 'A chilled bowl and whisk beat cream faster into stable airy peaks.'
      },
      {
        step: 3,
        text: 'Gently fold 1/3 of the whipped cream into the cooled melted chocolate to lighten it. Then fold in the remaining cream in gentle figure-eight motions until uniform.',
        durationMinutes: 4,
        ingredientsUsed: [],
        equipmentRequired: ['Spatula'],
        tip: 'Gentle folding traps air bubbles which give mousse its signature cloud-like texture.'
      },
      {
        step: 4,
        text: 'Spoon or pipe the mousse into 4 individual dessert glasses or ramekins.',
        durationMinutes: 4,
        ingredientsUsed: [],
        equipmentRequired: ['Dessert Glasses']
      },
      {
        step: 5,
        text: 'Refrigerate for at least 2 hours (or overnight) until set and chilled. Garnish with chocolate shavings before serving.',
        durationMinutes: 120,
        ingredientsUsed: [],
        temperature: 'Chill at 4°C',
        equipmentRequired: ['Refrigerator']
      }
    ],
    nutrition: { calories: 320, protein: 4, carbs: 26, fat: 23 }
  },

  // ==========================================
  // 5. RICE & GRAINS (FRIED RICE & STEAMED RICE)
  // ==========================================
  {
    id: 'rec_veg_fried_rice',
    title: 'Restaurant-Style Vegetable Fried Rice',
    description: 'Aromatic wok-tossed long-grain rice with colorful crisp vegetables, toasted garlic, ginger, and balanced soy seasoning on high heat.',
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    difficulty: 'Easy',
    category: 'Rice Dishes',
    cookingCategory: 'rice',
    cuisine: 'Indo-Chinese',
    dietaryTags: ['Vegan', 'Gluten-Free-Adaptable', 'Stovetop-Quick'],
    equipment: ['Heavy Wok or Wide Skillet', 'Chef Knife', 'Cutting Board', 'Spatula'],
    temperature: 'High Flame Wok Stir-Fry',
    storageGuidance: 'Store in an airtight container refrigerated for up to 3 days. Reheat in a smoking hot wok or microwave.',
    safetyNotes: 'High heat stir frying can splatter oil. Use a long spatula and keep ingredients prepped before firing heat.',
    ingredients: [
      { name: 'Rice', amount: 400, unit: 'g', note: 'Cooked long-grain basmati or jasmine rice (chilled/leftover rice is ideal)' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'High smoke-point oil (sesame or vegetable)' },
      { name: 'Onion', amount: 100, unit: 'g', note: 'Finely diced' },
      { name: 'Mixed Vegetables', amount: 200, unit: 'g', note: 'Carrots, bell peppers, green beans, sweet corn, cabbage' },
      { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Or freshly minced ginger and garlic' },
      { name: 'Green Chillies', amount: 5, unit: 'g', note: 'Finely chopped' },
      { name: 'Salt', amount: 6, unit: 'g', note: 'To taste' },
      { name: 'Soy Sauce', amount: 20, unit: 'ml', note: 'Dark or regular soy sauce' },
      { name: 'Black Pepper Powder', amount: 3, unit: 'g', note: 'Freshly cracked black pepper' }
    ],
    instructions: [
      {
        step: 1,
        text: 'Ensure cooked Rice is cold and grains are separated. Finely dice 100 g Onion and 200 g Mixed Vegetables.',
        durationMinutes: 8,
        ingredientsUsed: ['Rice', 'Onion', 'Mixed Vegetables'],
        equipmentRequired: ['Chef Knife', 'Cutting Board'],
        tip: 'Cold rice contains less moisture, preventing mushy fried rice.'
      },
      {
        step: 2,
        text: 'Heat 30 ml Cooking Oil in a large wok over high flame until smoking hot.',
        durationMinutes: 2,
        ingredientsUsed: ['Cooking Oil'],
        temperature: 'High Flame',
        equipmentRequired: ['Heavy Wok or Wide Skillet'],
        tip: 'High heat gives that authentic wok-hei smoky restaurant flavor.'
      },
      {
        step: 3,
        text: 'Add 15 g Ginger Garlic Paste, Green Chillies, and diced Onion. Toss vigorously on high heat for 1 minute until fragrant.',
        durationMinutes: 2,
        ingredientsUsed: ['Ginger Garlic Paste', 'Green Chillies', 'Onion'],
        temperature: 'High Flame'
      },
      {
        step: 4,
        text: 'Add 200 g Mixed Vegetables; stir-fry rapidly on high heat for 3 minutes keeping vegetables crisp and vibrant.',
        durationMinutes: 3,
        ingredientsUsed: ['Mixed Vegetables'],
        temperature: 'High Flame',
        tip: 'Do not overcook; vegetables should maintain a pleasant crunch.'
      },
      {
        step: 5,
        text: 'Add 400 g cold cooked Rice, 6 g Salt, 3 g Black Pepper, and drizzle 20 ml Soy Sauce around the edges of the wok.',
        durationMinutes: 2,
        ingredientsUsed: ['Rice', 'Salt', 'Black Pepper Powder', 'Soy Sauce'],
        equipmentRequired: ['Spatula']
      },
      {
        step: 6,
        text: 'Toss rice and vegetables together over maximum heat for 2-3 minutes until grains are coated and steaming hot. Serve immediately.',
        durationMinutes: 3,
        ingredientsUsed: [],
        temperature: 'High Flame'
      }
    ],
    nutrition: { calories: 310, protein: 6, carbs: 54, fat: 8 }
  },

  // ==========================================
  // 6. PASTA & NOODLES
  // ==========================================
  {
    id: 'rec_veg_pasta',
    title: 'Classic Vegetarian Penne in Rich Tomato Basil Sauce',
    description: 'Al dente penne pasta coated in a fragrant Italian crushed tomato, garlic, olive oil, and herb sauce.',
    prepTime: 10,
    cookTime: 18,
    servings: 4,
    difficulty: 'Easy',
    category: 'Pasta & Noodles',
    cookingCategory: 'pasta',
    cuisine: 'Italian',
    dietaryTags: ['Vegetarian', 'Quick-Dinner'],
    equipment: ['Large Stockpot', 'Wide Sauté Pan / Skillet', 'Colander', 'Tongs', 'Chef Knife'],
    temperature: 'Boiling Water & Medium Simmer',
    storageGuidance: 'Store pasta and sauce in an airtight container for up to 4 days.',
    safetyNotes: 'Careful with boiling pasta water when draining.',
    ingredients: [
      { name: 'Pasta', amount: 350, unit: 'g', note: 'Penne, rigatoni, or fusilli pasta' },
      { name: 'Water', amount: 3, unit: 'L', note: 'For boiling pasta' },
      { name: 'Salt', amount: 18, unit: 'g', note: '12g for boiling water, 6g for sauce' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'Extra virgin olive oil or cooking oil' },
      { name: 'Tomato', amount: 400, unit: 'g', note: 'Finely crushed or pureed ripe tomatoes' },
      { name: 'Onion', amount: 100, unit: 'g', note: 'Finely chopped' },
      { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Minced garlic cloves' },
      { name: 'Red Chilli Flakes', amount: 4, unit: 'g', note: 'Crushed red pepper' },
      { name: 'Black Pepper Powder', amount: 3, unit: 'g', note: 'Fresh cracked black pepper' },
      { name: 'Cherry Tomatoes', amount: 100, unit: 'g', optional: true, note: 'Halved for fresh texture' }
    ],
    instructions: [
      {
        step: 1,
        text: 'Bring 3 L Water to a rolling boil in a large pot. Add 12 g Salt (water should taste seasoned like the sea).',
        durationMinutes: 6,
        ingredientsUsed: ['Water', 'Salt'],
        temperature: 'Rolling Boil',
        equipmentRequired: ['Large Stockpot'],
        tip: 'Salting the cooking water is the only opportunity to season the pasta itself.'
      },
      {
        step: 2,
        text: 'Add 350 g Pasta to boiling water and cook for 9-11 minutes, stirring occasionally, until al dente (tender with a slight bite). Reserve 1/2 cup pasta cooking water, then drain pasta in a colander.',
        durationMinutes: 11,
        ingredientsUsed: ['Pasta'],
        equipmentRequired: ['Colander'],
        tip: 'Starchy pasta cooking water emulsifies the sauce into a silky restaurant glaze.'
      },
      {
        step: 3,
        text: 'In a wide sauté pan, heat 30 ml Olive Oil over medium flame. Add 100 g chopped Onion and 15 g Garlic; sauté for 3 minutes until translucent and fragrant.',
        durationMinutes: 3,
        ingredientsUsed: ['Cooking Oil', 'Onion', 'Ginger Garlic Paste'],
        equipmentRequired: ['Wide Sauté Pan / Skillet']
      },
      {
        step: 4,
        text: 'Add 400 g crushed Tomatoes, 6 g Salt, 4 g Red Chilli Flakes, 3 g Black Pepper, and halved Cherry Tomatoes. Simmer for 6 minutes until sauce thickens and oil glistens on the surface.',
        durationMinutes: 6,
        ingredientsUsed: ['Tomato', 'Salt', 'Red Chilli Flakes', 'Black Pepper Powder', 'Cherry Tomatoes']
      },
      {
        step: 5,
        text: 'Add drained al dente Pasta and 60 ml reserved pasta water to the pan. Toss vigorously over medium heat for 2 minutes until sauce clings generously to every piece of pasta.',
        durationMinutes: 2,
        ingredientsUsed: [],
        equipmentRequired: ['Tongs']
      },
      {
        step: 6,
        text: 'Drizzle a splash of olive oil, garnish with fresh herbs or cheese, and serve piping hot.',
        durationMinutes: 1,
        ingredientsUsed: ['Cooking Oil']
      }
    ],
    nutrition: { calories: 370, protein: 11, carbs: 64, fat: 9 }
  },

  // ==========================================
  // 7. INDIAN CURRIES & GRAVIES
  // ==========================================
  {
    id: 'rec_drumstick_curry',
    title: 'Traditional Drumstick Masala Curry',
    description: 'Authentic South Indian Drumstick (Murungakkai) curry simmered in a spiced onion, tomato, and tamarind gravy with aromatic tempering.',
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    difficulty: 'Easy',
    category: 'Curries & Gravies',
    cookingCategory: 'curry',
    cuisine: 'South Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'High-Fiber', 'Traditional'],
    equipment: ['Heavy Kadai / Pan', 'Chef Knife', 'Cutting Board', 'Lid'],
    temperature: 'Medium Flame Simmer',
    storageGuidance: 'Tastes even better the next day as drumsticks absorb the spices. Refrigerate for up to 4 days.',
    safetyNotes: 'Chew the succulent pulp from drumstick pods and discard the fibrous outer skin.',
    ingredients: [
      { name: 'Drumsticks', amount: 400, unit: 'g', note: 'Fresh drumsticks (approx 3-4 pods), washed and cut into 2.5-inch pieces' },
      { name: 'Onion', amount: 150, unit: 'g', note: 'Finely sliced' },
      { name: 'Tomato', amount: 150, unit: 'g', note: 'Chopped ripe tomatoes' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'For tempering and curry base' },
      { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Fresh aromatic paste' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit lengthwise' },
      { name: 'Mustard Seeds', amount: 3, unit: 'g', note: 'For tempering' },
      { name: 'Cumin Seeds', amount: 3, unit: 'g', note: 'For tempering' },
      { name: 'Curry Leaves', amount: 5, unit: 'g', note: 'Fresh aromatic leaves' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'To taste' },
      { name: 'Turmeric Powder', amount: 4, unit: 'g', note: 'Golden turmeric' },
      { name: 'Red Chilli Powder', amount: 8, unit: 'g', note: 'Spicy curry powder' },
      { name: 'Garam Masala', amount: 4, unit: 'g', note: 'Or sambar powder / coriander powder' },
      { name: 'Water', amount: 400, unit: 'ml', note: 'For boiling drumsticks and creating luscious gravy' }
    ],
    instructions: [
      {
        step: 1,
        text: 'Rinse 400 g Drumsticks thoroughly, scrape off any rough ridges lightly with a knife, and cut into uniform 2.5-inch pieces.',
        durationMinutes: 6,
        ingredientsUsed: ['Drumsticks'],
        equipmentRequired: ['Chef Knife', 'Cutting Board'],
        tip: 'Uniform cutting ensures all drumstick pieces cook evenly without getting mushy.'
      },
      {
        step: 2,
        text: 'Heat 30 ml Cooking Oil in a kadai over medium flame. Add 3 g Mustard Seeds, 3 g Cumin Seeds, and 5 g Curry Leaves until they crackle and splutter.',
        durationMinutes: 2,
        ingredientsUsed: ['Cooking Oil', 'Mustard Seeds', 'Cumin Seeds', 'Curry Leaves'],
        temperature: 'Medium Flame',
        equipmentRequired: ['Heavy Kadai / Pan']
      },
      {
        step: 3,
        text: 'Add 150 g sliced Onions and 10 g Green Chillies; sauté for 4 minutes until golden brown. Stir in 15 g Ginger Garlic Paste and cook for 1 minute until raw aroma dissipates.',
        durationMinutes: 5,
        ingredientsUsed: ['Onion', 'Green Chillies', 'Ginger Garlic Paste']
      },
      {
        step: 4,
        text: 'Add 150 g chopped Tomatoes, 10 g Salt, 4 g Turmeric Powder, and 8 g Red Chilli Powder. Cook for 5 minutes until tomatoes break down into a soft, fragrant paste and oil begins to separate.',
        durationMinutes: 5,
        ingredientsUsed: ['Tomato', 'Salt', 'Turmeric Powder', 'Red Chilli Powder']
      },
      {
        step: 5,
        text: 'Add prepped 400 g Drumsticks and pour in 400 ml Water. Stir well, cover with lid, and simmer on medium-low flame for 12-14 minutes until drumstick pieces are tender when pierced with a fork.',
        durationMinutes: 14,
        ingredientsUsed: ['Drumsticks', 'Water'],
        temperature: 'Medium-Low Flame',
        tip: 'Covering traps steam, infusing the masala deep into the center of the drumsticks.'
      },
      {
        step: 6,
        text: 'Uncover, stir in 4 g Garam Masala, simmer for 2 minutes until gravy reaches desired consistency, and serve warm with steamed rice.',
        durationMinutes: 2,
        ingredientsUsed: ['Garam Masala']
      }
    ],
    nutrition: { calories: 195, protein: 5, carbs: 22, fat: 8 }
  },

  {
    id: 'rec_chicken_curry',
    title: 'Restaurant Style Chicken Curry',
    description: 'Succulent chicken pieces simmered in an onion-tomato gravy with ginger garlic paste, green chillies, and garish spices.',
    prepTime: 20,
    cookTime: 30,
    servings: 4,
    difficulty: 'Medium',
    category: 'Curries & Gravies',
    cookingCategory: 'curry',
    cuisine: 'Indian',
    dietaryTags: ['High-Protein', 'Non-Vegetarian', 'Gluten-Free'],
    equipment: ['Heavy Kadai / Pot', 'Chef Knife', 'Mixing Bowls'],
    temperature: 'Medium-High Searing then Medium Simmer',
    storageGuidance: 'Refrigerate for up to 3 days.',
    safetyNotes: 'Ensure chicken is cooked to internal temperature of 74°C (165°F).',
    ingredients: [
      { name: 'Chicken', amount: 1, unit: 'kg', note: 'Curry cut pieces with bone' },
      { name: 'Onion', amount: 300, unit: 'g', note: 'Finely chopped' },
      { name: 'Tomato', amount: 200, unit: 'g', note: 'Pureed or chopped' },
      { name: 'Cooking Oil', amount: 45, unit: 'ml', note: 'For rich gravy base' },
      { name: 'Ginger Garlic Paste', amount: 30, unit: 'g', note: 'Freshly ground' },
      { name: 'Salt', amount: 12, unit: 'g', note: 'Seasoning to taste' },
      { name: 'Red Chilli Powder', amount: 10, unit: 'g', note: 'Kashmiri & spicy red chilli' },
      { name: 'Turmeric Powder', amount: 5, unit: 'g', note: 'Golden spice' },
      { name: 'Garam Masala', amount: 5, unit: 'g', note: 'Finishing spice' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit chillies' },
      { name: 'Water', amount: 400, unit: 'ml', note: 'For gravy simmer' }
    ],
    instructions: [
      { step: 1, text: 'Clean 1 kg Chicken and marinate with 15 g Ginger Garlic Paste, 3 g Salt, and 2 g Turmeric Powder for 15 minutes.', durationMinutes: 15, ingredientsUsed: ['Chicken', 'Ginger Garlic Paste', 'Salt', 'Turmeric Powder'] },
      { step: 2, text: 'Heat 45 ml Cooking Oil in a heavy pot, add 300 g Onions and 10 g Green Chillies; sauté until golden brown.', durationMinutes: 8, ingredientsUsed: ['Cooking Oil', 'Onion', 'Green Chillies'] },
      { step: 3, text: 'Add remaining Ginger Garlic Paste and cook for 2 minutes until fragrant.', durationMinutes: 2, ingredientsUsed: ['Ginger Garlic Paste'] },
      { step: 4, text: 'Add 200 g Tomatoes, 9 g Salt, 10 g Red Chilli Powder, and 3 g Turmeric; cook until oil separates from gravy.', durationMinutes: 7, ingredientsUsed: ['Tomato', 'Salt', 'Red Chilli Powder', 'Turmeric Powder'] },
      { step: 5, text: 'Add marinated Chicken pieces and sear on high heat for 5 minutes until chicken turns white on the exterior.', durationMinutes: 5, ingredientsUsed: ['Chicken'] },
      { step: 6, text: 'Pour in 400 ml Water, cover tightly, and simmer on medium-low for 15 minutes until chicken is succulent and tender.', durationMinutes: 15, ingredientsUsed: ['Water'] },
      { step: 7, text: 'Stir in 5 g Garam Masala, simmer 2 minutes, and serve hot with basmati rice or naan.', durationMinutes: 2, ingredientsUsed: ['Garam Masala'] }
    ],
    nutrition: { calories: 420, protein: 42, carbs: 12, fat: 24 }
  },

  {
    id: 'rec_paneer_butter_masala',
    title: 'Paneer Butter Masala',
    description: 'Succulent paneer cubes simmered in a velvety tomato, cashew, and yogurt butter gravy.',
    prepTime: 15,
    cookTime: 20,
    servings: 3,
    difficulty: 'Medium',
    category: 'Curries & Gravies',
    cookingCategory: 'curry',
    cuisine: 'North Indian',
    dietaryTags: ['Vegetarian', 'High-Protein'],
    equipment: ['Blender', 'Sauté Pan', 'Whisk'],
    temperature: 'Medium Flame',
    ingredients: [
      { name: 'Fresh Paneer', amount: 400, unit: 'g', note: 'Cubed into 1-inch pieces' },
      { name: 'Tomato', amount: 400, unit: 'g', note: 'Pureed' },
      { name: 'Raw Cashews', amount: 50, unit: 'g', note: 'Soaked for creaminess' },
      { name: 'Greek Yogurt', amount: 50, unit: 'g', note: 'Whisked yogurt' },
      { name: 'Butter', amount: 30, unit: 'g', note: 'Rich butter for pan' },
      { name: 'Ginger Garlic Paste', amount: 20, unit: 'g', note: 'Fresh aromatic paste' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'To taste' },
      { name: 'Red Chilli Powder', amount: 8, unit: 'g', note: 'Kashmiri chilli' },
      { name: 'Garam Masala', amount: 4, unit: 'g', note: 'Spice seasoning' },
      { name: 'Water', amount: 200, unit: 'ml', note: 'Gravy adjustment' }
    ],
    instructions: [
      { step: 1, text: 'Blend 400 g Tomatoes and 50 g soaked Raw Cashews into a smooth silky paste.', durationMinutes: 5, ingredientsUsed: ['Tomato', 'Raw Cashews'] },
      { step: 2, text: 'Melt 30 g Butter in a pan, add 20 g Ginger Garlic Paste and sauté for 1 minute.', durationMinutes: 2, ingredientsUsed: ['Butter', 'Ginger Garlic Paste'] },
      { step: 3, text: 'Add tomato cashew puree, 10 g Salt, 8 g Red Chilli Powder, and 200 ml Water; simmer for 8 minutes.', durationMinutes: 8, ingredientsUsed: ['Tomato', 'Raw Cashews', 'Salt', 'Red Chilli Powder', 'Water'] },
      { step: 4, text: 'Whisk in 50 g Greek Yogurt and 4 g Garam Masala until glossy.', durationMinutes: 3, ingredientsUsed: ['Greek Yogurt', 'Garam Masala'] },
      { step: 5, text: 'Gently add 400 g Fresh Paneer cubes and simmer on low heat for 4 minutes before serving.', durationMinutes: 4, ingredientsUsed: ['Fresh Paneer'] }
    ],
    nutrition: { calories: 450, protein: 22, carbs: 24, fat: 30 }
  },

  {
    id: 'rec_potato_curry',
    title: 'Homestyle Potato Masala Curry',
    description: 'Tender potato cubes cooked in a spiced onion-tomato gravy with mustard, cumin, and curry leaves.',
    prepTime: 12,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Curries & Gravies',
    cookingCategory: 'curry',
    cuisine: 'Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Comfort-Food'],
    ingredients: [
      { name: 'Potato', amount: 600, unit: 'g', note: 'Peeled and diced into 1-inch cubes' },
      { name: 'Onion', amount: 150, unit: 'g', note: 'Finely chopped' },
      { name: 'Tomato', amount: 150, unit: 'g', note: 'Pureed or chopped' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'For sautéing and tempering' },
      { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Aromatic paste' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit chillies' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'To taste' },
      { name: 'Red Chilli Powder', amount: 6, unit: 'g', note: 'Warm spice' },
      { name: 'Turmeric Powder', amount: 4, unit: 'g', note: 'Golden color' },
      { name: 'Mustard Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Cumin Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Curry Leaves', amount: 5, unit: 'g', note: 'Fresh sprig' },
      { name: 'Garam Masala', amount: 4, unit: 'g', note: 'Finishing spice' },
      { name: 'Water', amount: 300, unit: 'ml', note: 'Gravy simmer' }
    ],
    instructions: [
      { step: 1, text: 'Peel and cube 600 g Potatoes, chop 150 g Onion and 150 g Tomato.', durationMinutes: 8, ingredientsUsed: ['Potato', 'Onion', 'Tomato'] },
      { step: 2, text: 'Heat 30 ml Cooking Oil in a pan, add Mustard Seeds, Cumin Seeds, and Curry Leaves until they splutter.', durationMinutes: 3, ingredientsUsed: ['Cooking Oil', 'Mustard Seeds', 'Cumin Seeds', 'Curry Leaves'] },
      { step: 3, text: 'Add Onions, Green Chillies, and Ginger Garlic Paste; sauté until golden brown.', durationMinutes: 5, ingredientsUsed: ['Onion', 'Green Chillies', 'Ginger Garlic Paste'] },
      { step: 4, text: 'Add Tomatoes, Salt, Turmeric Powder, and Red Chilli Powder; cook until soft.', durationMinutes: 4, ingredientsUsed: ['Tomato', 'Salt', 'Turmeric Powder', 'Red Chilli Powder'] },
      { step: 5, text: 'Add Potatoes and 300 ml Water; cover and simmer for 12 minutes until potatoes are tender.', durationMinutes: 12, ingredientsUsed: ['Potato', 'Water'] },
      { step: 6, text: 'Stir in 4 g Garam Masala, simmer 2 minutes, and serve hot.', durationMinutes: 2, ingredientsUsed: ['Garam Masala'] }
    ],
    nutrition: { calories: 290, protein: 5, carbs: 42, fat: 11 }
  },

  {
    id: 'rec_rice',
    title: 'Steamed Basmati Rice',
    description: 'Fluffy, long-grain basmati rice cooked to perfection with subtle salt and oil seasoning.',
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    category: 'Rice Dishes',
    cookingCategory: 'rice',
    cuisine: 'Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Staple'],
    ingredients: [
      { name: 'Rice', amount: 500, unit: 'g', note: 'Rinsed and soaked for 20 mins' },
      { name: 'Water', amount: 1, unit: 'L', note: 'Filtered cooking water' },
      { name: 'Salt', amount: 5, unit: 'g', note: 'For boiling seasoning' },
      { name: 'Cooking Oil', amount: 10, unit: 'ml', note: 'Prevents rice sticking' }
    ],
    instructions: [
      { step: 1, text: 'Rinse 500 g Rice in cold water until water runs clear; soak for 20 minutes.', durationMinutes: 20, ingredientsUsed: ['Rice', 'Water'] },
      { step: 2, text: 'Bring 1 L Water to a rolling boil, add 5 g Salt and 10 ml Cooking Oil.', durationMinutes: 5, ingredientsUsed: ['Water', 'Salt', 'Cooking Oil'] },
      { step: 3, text: 'Add drained Rice to boiling water, reduce heat to low, cover tightly with lid and simmer for 12 minutes.', durationMinutes: 12, ingredientsUsed: ['Rice'] },
      { step: 4, text: 'Turn off heat, let rest covered for 5 minutes, then fluff gently with a fork before serving.', durationMinutes: 5, ingredientsUsed: [] }
    ],
    nutrition: { calories: 240, protein: 5, carbs: 52, fat: 1 }
  },

  {
    id: 'rec_egg_curry',
    title: 'Spiced Egg Masala Curry',
    description: 'Hard-boiled eggs simmered in a rich, spicy onion-tomato gravy with aromatic masalas.',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Curries & Gravies',
    cookingCategory: 'curry',
    cuisine: 'Indian',
    dietaryTags: ['High-Protein', 'Gluten-Free'],
    ingredients: [
      { name: 'Eggs', amount: 4, unit: 'pcs', note: 'Boiled and shallow fried' },
      { name: 'Onion', amount: 200, unit: 'g', note: 'Chopped' },
      { name: 'Tomato', amount: 150, unit: 'g', note: 'Chopped' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'For frying eggs and curry base' },
      { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Fresh' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'To taste' },
      { name: 'Red Chilli Powder', amount: 8, unit: 'g', note: 'Spicy chilli' },
      { name: 'Turmeric Powder', amount: 4, unit: 'g', note: 'For color' },
      { name: 'Garam Masala', amount: 5, unit: 'g', note: 'Finishing spice' },
      { name: 'Water', amount: 250, unit: 'ml', note: 'For gravy' }
    ],
    instructions: [
      { step: 1, text: 'Boil 4 Eggs for 10 minutes, peel shell, and make light vertical slits.', durationMinutes: 10, ingredientsUsed: ['Eggs'] },
      { step: 2, text: 'Heat 10 ml Cooking Oil with pinch of Turmeric & Chilli Powder; sear eggs until golden exterior forms.', durationMinutes: 3, ingredientsUsed: ['Cooking Oil', 'Eggs', 'Turmeric Powder', 'Red Chilli Powder'] },
      { step: 3, text: 'Heat remaining Oil, sauté Onions and Ginger Garlic Paste until translucent.', durationMinutes: 5, ingredientsUsed: ['Cooking Oil', 'Onion', 'Ginger Garlic Paste'] },
      { step: 4, text: 'Add Tomatoes, Salt, and remaining spices; cook until oil separates.', durationMinutes: 5, ingredientsUsed: ['Tomato', 'Salt', 'Red Chilli Powder', 'Turmeric Powder'] },
      { step: 5, text: 'Add 250 ml Water and seared Eggs; simmer for 6 minutes until gravy thickens.', durationMinutes: 6, ingredientsUsed: ['Eggs', 'Water', 'Garam Masala'] }
    ],
    nutrition: { calories: 340, protein: 18, carbs: 14, fat: 22 }
  },

  {
    id: 'rec_tomato_dal',
    title: 'Aromatic Tomato Dal (Pappu)',
    description: 'Yellow lentils cooked with juicy ripe tomatoes, tempered with mustard seeds, cumin, garlic, and curry leaves.',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Curries & Gravies',
    cookingCategory: 'curry',
    cuisine: 'South Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'High-Protein'],
    ingredients: [
      { name: 'Toor Dal', amount: 250, unit: 'g', note: 'Rinsed lentils' },
      { name: 'Tomato', amount: 250, unit: 'g', note: 'Ripe chopped tomatoes' },
      { name: 'Water', amount: 1, unit: 'L', note: 'For cooking lentils' },
      { name: 'Cooking Oil', amount: 25, unit: 'ml', note: 'For tempering' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit chillies' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'To taste' },
      { name: 'Turmeric Powder', amount: 4, unit: 'g', note: 'Golden color' },
      { name: 'Mustard Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Cumin Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Curry Leaves', amount: 5, unit: 'g', note: 'Fresh sprig' }
    ],
    instructions: [
      { step: 1, text: 'Pressure cook 250 g Toor Dal and 250 g Tomatoes with 1 L Water, 4 g Turmeric, and Green Chillies until tender.', durationMinutes: 15, ingredientsUsed: ['Toor Dal', 'Tomato', 'Water', 'Turmeric Powder', 'Green Chillies'] },
      { step: 2, text: 'Mash cooked dal gently to combine tomatoes and lentils.', durationMinutes: 2, ingredientsUsed: ['Toor Dal', 'Tomato'] },
      { step: 3, text: 'Heat 25 ml Cooking Oil in a pan; add Mustard Seeds, Cumin Seeds, and Curry Leaves until fragrant.', durationMinutes: 3, ingredientsUsed: ['Cooking Oil', 'Mustard Seeds', 'Cumin Seeds', 'Curry Leaves'] },
      { step: 4, text: 'Pour tempering into cooked tomato dal, add 10 g Salt, simmer 2 minutes, and serve warm.', durationMinutes: 2, ingredientsUsed: ['Salt'] }
    ],
    nutrition: { calories: 220, protein: 13, carbs: 34, fat: 4 }
  },

  {
    id: 'rec_potato_fry',
    title: 'Crispy Potato Masala Fry',
    description: 'Golden fried potato cubes tossed with mustard, cumin, curry leaves, chillies, and aromatic spices.',
    prepTime: 10,
    cookTime: 18,
    servings: 3,
    difficulty: 'Easy',
    category: 'Curries & Gravies',
    cookingCategory: 'curry',
    cuisine: 'South Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'Comfort-Food'],
    ingredients: [
      { name: 'Potato', amount: 600, unit: 'g', note: 'Peeled and diced into 1/2-inch cubes' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'For tempering and roasting' },
      { name: 'Salt', amount: 8, unit: 'g', note: 'Adjust to taste' },
      { name: 'Red Chilli Powder', amount: 5, unit: 'g', note: 'For fiery warmth' },
      { name: 'Turmeric Powder', amount: 3, unit: 'g', note: 'For vibrant golden color' },
      { name: 'Mustard Seeds', amount: 3, unit: 'g', note: 'For tempering' },
      { name: 'Cumin Seeds', amount: 3, unit: 'g', note: 'For earthy aroma' },
      { name: 'Onion', amount: 100, unit: 'g', note: 'Finely sliced' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit lengthwise' },
      { name: 'Curry Leaves', amount: 5, unit: 'g', note: 'Fresh sprig' }
    ],
    instructions: [
      { step: 1, text: 'Wash, peel, and cut 600 g Potatoes into uniform 1/2-inch cubes.', durationMinutes: 10, ingredientsUsed: ['Potato'] },
      { step: 2, text: 'Heat 30 ml Cooking Oil in a wide pan over medium heat. Add 3 g Mustard Seeds, 3 g Cumin Seeds, and 5 g Curry Leaves until they splutter.', durationMinutes: 3, ingredientsUsed: ['Cooking Oil', 'Mustard Seeds', 'Cumin Seeds', 'Curry Leaves'] },
      { step: 3, text: 'Add 100 g sliced Onion and 10 g Green Chillies; sauté for 3 minutes until soft.', durationMinutes: 3, ingredientsUsed: ['Onion', 'Green Chillies'] },
      { step: 4, text: 'Add diced Potatoes, 8 g Salt, 3 g Turmeric Powder, and 5 g Red Chilli Powder. Toss thoroughly.', durationMinutes: 2, ingredientsUsed: ['Potato', 'Salt', 'Turmeric Powder', 'Red Chilli Powder'] },
      { step: 5, text: 'Cover pan and cook on medium-low flame for 10 minutes, stirring occasionally until potatoes are tender inside.', durationMinutes: 10, ingredientsUsed: ['Potato'] },
      { step: 6, text: 'Remove lid, roast on medium heat for 3 minutes until edges become crisp and golden brown.', durationMinutes: 3, ingredientsUsed: [] }
    ],
    nutrition: { calories: 280, protein: 4, carbs: 38, fat: 12 }
  },

  {
    id: 'rec_dal_tadka',
    title: 'Yellow Dal Tadka',
    description: 'Golden yellow pigeon pea lentil soup tempered with cumin, mustard seeds, garlic, and curry leaves.',
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Curries & Gravies',
    cookingCategory: 'curry',
    cuisine: 'Indian',
    dietaryTags: ['Vegetarian', 'High-Protein', 'Gluten-Free'],
    ingredients: [
      { name: 'Toor Dal', amount: 250, unit: 'g', note: 'Rinsed yellow split lentils' },
      { name: 'Water', amount: 1, unit: 'L', note: 'For boiling lentils' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'For tempering' },
      { name: 'Onion', amount: 100, unit: 'g', note: 'Chopped' },
      { name: 'Tomato', amount: 100, unit: 'g', note: 'Diced' },
      { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Tempering aromatic' },
      { name: 'Green Chillies', amount: 10, unit: 'g', note: 'Slit' },
      { name: 'Salt', amount: 8, unit: 'g', note: 'Seasoning' },
      { name: 'Turmeric Powder', amount: 4, unit: 'g', note: 'Golden color' },
      { name: 'Red Chilli Powder', amount: 4, unit: 'g', note: 'Flavoring' },
      { name: 'Mustard Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Cumin Seeds', amount: 3, unit: 'g', note: 'Tempering' },
      { name: 'Curry Leaves', amount: 5, unit: 'g', note: 'Fresh sprig' }
    ],
    instructions: [
      { step: 1, text: 'Pressure cook 250 g Toor Dal with 1 L Water, 4 g Turmeric Powder, and 4 g Salt for 4 whistles until soft.', durationMinutes: 15, ingredientsUsed: ['Toor Dal', 'Water', 'Turmeric Powder', 'Salt'] },
      { step: 2, text: 'Heat 30 ml Cooking Oil in a pan. Add Mustard Seeds, Cumin Seeds, and Curry Leaves until they pop.', durationMinutes: 3, ingredientsUsed: ['Cooking Oil', 'Mustard Seeds', 'Cumin Seeds', 'Curry Leaves'] },
      { step: 3, text: 'Add 100 g Onion, Green Chillies, and Ginger Garlic Paste; sauté until translucent.', durationMinutes: 4, ingredientsUsed: ['Onion', 'Green Chillies', 'Ginger Garlic Paste'] },
      { step: 4, text: 'Add 100 g Tomato, remaining 4 g Salt, and Red Chilli Powder; cook until soft.', durationMinutes: 3, ingredientsUsed: ['Tomato', 'Salt', 'Red Chilli Powder'] },
      { step: 5, text: 'Pour cooked Dal into tempering pan, mix well, simmer 2 minutes, and serve.', durationMinutes: 2, ingredientsUsed: ['Toor Dal'] }
    ],
    nutrition: { calories: 230, protein: 14, carbs: 36, fat: 5 }
  },

  {
    id: 'rec_veg_curry',
    title: 'Homestyle Mixed Vegetable Curry',
    description: 'Seasonal mixed vegetables cooked in a spiced onion-tomato curry base.',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'Easy',
    category: 'Curries & Gravies',
    cookingCategory: 'curry',
    cuisine: 'Indian',
    dietaryTags: ['Vegan', 'Gluten-Free', 'High-Fiber'],
    ingredients: [
      { name: 'Mixed Vegetables', amount: 500, unit: 'g', note: 'Carrot, peas, beans, potato' },
      { name: 'Onion', amount: 150, unit: 'g', note: 'Finely chopped' },
      { name: 'Tomato', amount: 150, unit: 'g', note: 'Chopped' },
      { name: 'Cooking Oil', amount: 30, unit: 'ml', note: 'Sautéing oil' },
      { name: 'Ginger Garlic Paste', amount: 15, unit: 'g', note: 'Aromatic base' },
      { name: 'Salt', amount: 10, unit: 'g', note: 'Seasoning' },
      { name: 'Red Chilli Powder', amount: 6, unit: 'g', note: 'Spice powder' },
      { name: 'Turmeric Powder', amount: 3, unit: 'g', note: 'Golden spice' },
      { name: 'Garam Masala', amount: 4, unit: 'g', note: 'Finishing spice' },
      { name: 'Water', amount: 300, unit: 'ml', note: 'Curry liquid' }
    ],
    instructions: [
      { step: 1, text: 'Dice 500 g Mixed Vegetables into bite-sized pieces.', durationMinutes: 8, ingredientsUsed: ['Mixed Vegetables'] },
      { step: 2, text: 'Heat 30 ml Cooking Oil, sauté 150 g Onion and 15 g Ginger Garlic Paste until light brown.', durationMinutes: 4, ingredientsUsed: ['Cooking Oil', 'Onion', 'Ginger Garlic Paste'] },
      { step: 3, text: 'Add 150 g Tomato, 10 g Salt, 6 g Red Chilli Powder, and 3 g Turmeric; cook for 4 minutes.', durationMinutes: 4, ingredientsUsed: ['Tomato', 'Salt', 'Red Chilli Powder', 'Turmeric Powder'] },
      { step: 4, text: 'Add Mixed Vegetables and 300 ml Water; cover and cook on medium flame for 12 minutes.', durationMinutes: 12, ingredientsUsed: ['Mixed Vegetables', 'Water'] },
      { step: 5, text: 'Stir in 4 g Garam Masala and simmer 2 minutes before serving.', durationMinutes: 2, ingredientsUsed: ['Garam Masala'] }
    ],
    nutrition: { calories: 210, protein: 6, carbs: 28, fat: 8 }
  },

  {
    id: 'rec_smoothie_bowl',
    title: 'Dragon Fruit & Berry Smoothie Bowl',
    description: 'Vibrant, antioxidant-packed smoothie bowl garnished with raw cashews and honey.',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    difficulty: 'Easy',
    category: 'Breakfast',
    cookingCategory: 'breakfast',
    cuisine: 'Modern Fusion',
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'High-Antioxidant'],
    ingredients: [
      { name: 'Dragon Fruit', amount: 1, unit: 'pcs', note: 'Fresh dragon fruit' },
      { name: 'Greek Yogurt', amount: 150, unit: 'g', note: 'Chilled yogurt' },
      { name: 'Raw Cashews', amount: 30, unit: 'g', note: 'For topping' }
    ],
    instructions: [
      { step: 1, text: 'Dice fresh Dragon Fruit into uniform cubes, set half aside for topping.', durationMinutes: 3, ingredientsUsed: ['Dragon Fruit'] },
      { step: 2, text: 'Blend remaining Dragon Fruit with 150 g Greek Yogurt until smooth.', durationMinutes: 3, ingredientsUsed: ['Dragon Fruit', 'Greek Yogurt'] },
      { step: 3, text: 'Pour into chilled bowl and garnish with 30 g Raw Cashews.', durationMinutes: 2, ingredientsUsed: ['Raw Cashews'] }
    ],
    nutrition: { calories: 310, protein: 12, carbs: 42, fat: 11 }
  }
];
