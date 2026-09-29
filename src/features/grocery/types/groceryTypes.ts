export type GroceryPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type GrocerySource = 'LOW_STOCK' | 'OUT_OF_STOCK' | 'RECIPE_MISSING' | 'MANUAL';

export type GroceryStatus = 'NEEDED' | 'ORDERED' | 'PURCHASED' | 'RECEIVED' | 'CANCELLED';

export interface SmartGroceryItem {
  id: string;
  restaurantId?: string;
  name: string;
  quantity: number;
  unit: string;
  reason: string;
  priority: GroceryPriority;
  source: GrocerySource;
  sourceReferenceId?: string;
  status: GroceryStatus;
  category?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt?: string;
}
