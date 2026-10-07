import type { Ingredient, IngredientCategory } from '../../../../types/ingredient';
import type { SmartGroceryItem } from '../../../grocery/types/groceryTypes';

export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'uncertain';

export interface OCRResult {
  detectedText: string;
  extractedName?: string;
  extractedQuantity?: number;
  extractedUnit?: string;
  confidence: number;
}

export interface ImageAnalysisResult {
  detectedItem: string | null;
  normalizedName: string;
  category: IngredientCategory;
  confidence: number; // 0 to 1.0
  confidenceLevel: ConfidenceLevel;
  requiresConfirmation: boolean;
  alternatives: string[];
  imageAnalyzed: boolean;
  ocrResult?: OCRResult;
  detectedFeatures?: string[];
  suggestedQuantity?: number;
  suggestedUnit?: string;
}

export interface MultiImageAnalysisResult {
  items: ImageAnalysisResult[];
  timestamp: string;
}

export interface CameraInventoryMatch {
  existsInInventory: boolean;
  inventoryItem?: Ingredient;
  existsInGrocery: boolean;
  groceryItem?: SmartGroceryItem;
  status: 'available' | 'low_stock' | 'out_of_stock' | 'not_in_inventory';
  groceryStatus?: SmartGroceryItem['status'];
}

export type CameraActionStep = 
  | 'preview' 
  | 'captured' 
  | 'analyzing' 
  | 'detected' 
  | 'manual_correction' 
  | 'inventory_match' 
  | 'action_dialog' 
  | 'verifying' 
  | 'success';
