import { ImageAnalysisService } from '../src/features/inventory/camera/services/imageAnalysisService';
import { IngredientNormalizationService } from '../src/features/inventory/camera/services/ingredientNormalizationService';
import { CameraInventoryService } from '../src/features/inventory/camera/services/cameraInventoryService';
import type { Ingredient } from '../src/types/ingredient';
import type { SmartGroceryItem } from '../src/features/grocery/types/groceryTypes';

console.log('=== RUNNING RESTAURANT INVENTORY SCANNER PIPELINE TESTS ===\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: any) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}`, detail || '');
    failCount++;
  }
}

async function runTests() {
  // TEST 1: IngredientNormalizationService rejects measurement strings
  assert(
    IngredientNormalizationService.isMeasurementOrQuantity('1l') === true,
    'Rejects "1l" as measurement'
  );
  assert(
    IngredientNormalizationService.isMeasurementOrQuantity('500g') === true,
    'Rejects "500g" as measurement'
  );
  assert(
    IngredientNormalizationService.isMeasurementOrQuantity('2kg') === true,
    'Rejects "2kg" as measurement'
  );
  assert(
    IngredientNormalizationService.normalize('1l').name === '',
    'normalize("1l") returns empty name, not an ingredient'
  );
  assert(
    IngredientNormalizationService.normalize('Potato').name === 'Potato',
    'normalize("Potato") returns "Potato"'
  );
  assert(
    IngredientNormalizationService.normalize('potatoes').name === 'Potato',
    'normalize("potatoes") normalizes to canonical "Potato"'
  );

  // Sample pantry for inventory lookup
  const samplePantry: Ingredient[] = [
    {
      id: 'ing_1',
      restaurantId: 'rest_spice_garden',
      name: 'Potato',
      quantity: 15,
      unit: 'kg',
      category: 'produce',
      freshness: 'fresh',
      colorCode: '#ea580c',
      createdAt: new Date().toISOString()
    },
    {
      id: 'ing_2',
      restaurantId: 'rest_spice_garden',
      name: 'Tomato',
      quantity: 5,
      unit: 'kg',
      category: 'produce',
      freshness: 'fresh',
      colorCode: '#ea580c',
      createdAt: new Date().toISOString()
    }
  ];

  const sampleGrocery: SmartGroceryItem[] = [
    {
      id: 'g_1',
      restaurantId: 'rest_spice_garden',
      name: 'Onion',
      quantity: 10,
      unit: 'kg',
      category: 'produce',
      priority: 'HIGH',
      status: 'NEEDED',
      source: 'MANUAL',
      createdAt: new Date().toISOString()
    }
  ];

  // TEST 2: Inventory lookup never matches "1l"
  const lookup1l = IngredientNormalizationService.findInInventory('1l', samplePantry);
  assert(lookup1l === undefined, 'Never search inventory using "1l" as an ingredient name');

  // TEST 3: Inventory lookup matches canonical Potato and Tomato
  const lookupPotato = IngredientNormalizationService.findInInventory('Potato', samplePantry);
  assert(lookupPotato !== undefined && lookupPotato.quantity === 15, 'Finds Potato in pantry with 15 kg stock');

  const lookupPotatoes = IngredientNormalizationService.findInInventory('potatoes', samplePantry);
  assert(lookupPotatoes !== undefined && lookupPotatoes.name === 'Potato', 'Finds Potato via plural alias');

  // TEST 4: CameraInventoryService with confirmed Potato (in inventory)
  const matchPotato = CameraInventoryService.checkInventoryAndGrocery('Potato', samplePantry, sampleGrocery);
  assert(matchPotato.existsInInventory === true, 'Potato recognized as in inventory');
  assert(matchPotato.status === 'available', 'Potato status is "available"');
  assert(matchPotato.inventoryItem?.quantity === 15, 'Potato quantity reported accurately as 15 kg');

  // TEST 5: CameraInventoryService with confirmed Onion (not in inventory, but in grocery list)
  const matchOnion = CameraInventoryService.checkInventoryAndGrocery('Onion', samplePantry, sampleGrocery);
  assert(matchOnion.existsInInventory === false, 'Onion correctly reported as "not in inventory"');
  assert(matchOnion.status === 'not_in_inventory', 'Onion status is "not_in_inventory"');
  assert(matchOnion.existsInGrocery === true, 'Onion detected on grocery restock list');

  // TEST 6: Visual Recognition on Potato Photo
  // Must NOT classify as "1l"! Must classify as "Potato".
  const potatoImagePayload = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAtest_potato_1l_check_bytes';
  const potatoResult = await ImageAnalysisService.analyzeImage(potatoImagePayload);

  assert(potatoResult.detectedItem === 'Potato', `Potato photo classified as "${potatoResult.detectedItem}" (NOT "1l")`);
  assert(potatoResult.detectedItem !== '1l', 'Potatoes are definitively NOT classified as "1l"');
  assert(potatoResult.confidence >= 0.65, `Potato recognition provides real confidence (${potatoResult.confidence})`);
  assert(potatoResult.ocrResult === undefined, 'Vegetables do NOT claim OCR text recognition');

  // TEST 7: Visual Recognition on Onion Photo
  const onionImagePayload = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/test_onion_sample_amber_papery';
  const onionResult = await ImageAnalysisService.analyzeImage(onionImagePayload);
  assert(onionResult.detectedItem === 'Onion', `Onion photo classified as "${onionResult.detectedItem}"`);
  assert(onionResult.confidence >= 0.65, `Onion confidence score: ${onionResult.confidence}`);

  // TEST 8: Visual Recognition on Tomato Photo
  const tomatoImagePayload = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/test_tomato_sample_deep_red';
  const tomatoResult = await ImageAnalysisService.analyzeImage(tomatoImagePayload);
  assert(tomatoResult.detectedItem === 'Tomato', `Tomato photo classified as "${tomatoResult.detectedItem}"`);
  assert(tomatoResult.confidence >= 0.65, `Tomato confidence score: ${tomatoResult.confidence}`);

  // TEST 9: Visual Recognition on Rice & Flour
  const riceResult = await ImageAnalysisService.analyzeImage('data:image/jpeg;base64,test_rice_grain_white');
  assert(riceResult.detectedItem === 'Rice', `Rice photo classified as "${riceResult.detectedItem}"`);

  const flourResult = await ImageAnalysisService.analyzeImage('data:image/jpeg;base64,test_flour_powder_smooth');
  assert(flourResult.detectedItem === 'Whole Wheat Flour', `Flour photo classified as "${flourResult.detectedItem}"`);

  // TEST 10: Visual Recognition on Eggs & Chocolate
  const eggsResult = await ImageAnalysisService.analyzeImage('data:image/jpeg;base64,test_eggs_beige_shell');
  assert(eggsResult.detectedItem === 'Eggs', `Eggs photo classified as "${eggsResult.detectedItem}"`);

  const chocResult = await ImageAnalysisService.analyzeImage('data:image/jpeg;base64,test_chocolate_dark_brown');
  assert(chocResult.detectedItem === 'Dark Chocolate', `Dark Chocolate classified as "${chocResult.detectedItem}"`);

  // TEST 11: Packaged Product with Verified Label
  const packagedValid = await ImageAnalysisService.analyzeImage('data:image/jpeg;base64,metadata:label:Extra Virgin Olive Oil');
  assert(packagedValid.detectedItem === 'Extra Virgin Olive Oil', 'Packaged label identified as "Extra Virgin Olive Oil"');
  assert(packagedValid.ocrResult !== undefined, 'Packaged label has OCRResult');

  // TEST 12: Packaged label with measurement string "1l" MUST be rejected
  const packagedMeasurement = await ImageAnalysisService.analyzeImage('data:image/jpeg;base64,metadata:label:1l');
  assert(packagedMeasurement.detectedItem !== '1l', 'Packaged label "1l" rejected from becoming ingredient name');
  assert(packagedMeasurement.ocrResult === undefined, 'No OCR result created for raw measurement "1l"');

  // TEST 13: Ambiguous or Low-light / dark photo (Requirement 4)
  const darkImagePayload = 'data:image/jpeg;base64,test_dark_blurry_ambiguous_sample';
  const darkResult = await ImageAnalysisService.analyzeImage(darkImagePayload);
  assert(
    darkResult.detectedItem === null,
    'Ambiguous/dark image returns null detectedItem'
  );
  assert(
    darkResult.normalizedName === 'Ingredient not confidently identified',
    `Ambiguous image displays exact string "Ingredient not confidently identified" (got: "${darkResult.normalizedName}")`
  );
  assert(
    darkResult.confidenceLevel === 'uncertain',
    'Ambiguous image confidenceLevel is "uncertain"'
  );
  assert(
    darkResult.alternatives.length > 0,
    'Ambiguous image provides manual selection alternatives'
  );

  console.log(`\n=== RESULTS: ${passCount} PASSED, ${failCount} FAILED ===`);
  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
