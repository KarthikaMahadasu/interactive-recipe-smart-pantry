export type TransactionType = 
  | 'RECEIVED'
  | 'USED_IN_COOKING'
  | 'MANUAL_ADJUSTMENT'
  | 'CAMERA_RECEIVED'
  | 'WASTE'
  | 'CORRECTION';

export interface InventoryTransaction {
  id: string;
  restaurantId: string;
  inventoryItemId?: string;
  itemName: string;
  type: TransactionType;
  quantity: number;
  unit: string;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  referenceId?: string;
  createdBy: string;
  createdAt: string;
}
