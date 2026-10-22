import type { IngredientCategory } from '../../../../types/ingredient';
import { ImageAnalysisService } from './imageAnalysisService';

export interface DetectionResult {
  name: string;
  category: IngredientCategory;
  confidence: 'High' | 'Medium' | 'Low';
  suggestedQuantity: number;
  suggestedUnit: string;
  detectedFeatures?: string[];
}

export interface MultiDetectionResult {
  items: DetectionResult[];
  timestamp: string;
}

/**
 * Service Abstraction for Inventory Item Detection from Camera Image.
 * Connected directly to the visual food classifier pipeline (ImageAnalysisService).
 */
export class ImageDetectionService {
  /**
   * Analyzes captured image base64 data and returns ingredient detection result.
   */
  static async detectInventoryItemFromImage(base64Image: string): Promise<DetectionResult> {
    if (!base64Image || base64Image.length < 50) {
      throw new Error('Invalid or empty image data captured');
    }

    const analysis = await ImageAnalysisService.analyzeImage(base64Image);

    if (!analysis.detectedItem || analysis.confidenceLevel === 'uncertain') {
      return {
        name: 'Ingredient not confidently identified',
        category: 'other',
        confidence: 'Low',
        suggestedQuantity: 1,
        suggestedUnit: 'kg',
        detectedFeatures: analysis.detectedFeatures || ['Visual descriptors below threshold', 'Manual selection required']
      };
    }

    const confMap: Record<string, 'High' | 'Medium' | 'Low'> = {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      uncertain: 'Low'
    };

    return {
      name: analysis.detectedItem,
      category: analysis.category,
      confidence: confMap[analysis.confidenceLevel] || 'Medium',
      suggestedQuantity: analysis.suggestedQuantity || 1,
      suggestedUnit: analysis.suggestedUnit || 'kg',
      detectedFeatures: analysis.detectedFeatures
    };
  }

  /**
   * Extensible multi-item detection method for multi-object scanning.
   */
  static async detectMultipleItemsFromImage(base64Image: string): Promise<MultiDetectionResult> {
    const primary = await this.detectInventoryItemFromImage(base64Image);
    return {
      items: [primary],
      timestamp: new Date().toISOString()
    };
  }
}
