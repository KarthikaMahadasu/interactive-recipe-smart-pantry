import type { InventoryTransaction, TransactionType } from '../types/transactionTypes';

const DEFAULT_TRANSACTIONS_KEY = 'smart_inventory_transactions_v1';

function getTransactionStorageKey(restaurantId?: string | null): string {
  if (restaurantId) {
    return `restaurant_${restaurantId}_transactions_v1`;
  }
  return DEFAULT_TRANSACTIONS_KEY;
}

export class InventoryTransactionService {
  /**
   * Loads transactions for a given restaurant from localStorage.
   */
  static loadTransactions(restaurantId?: string | null): InventoryTransaction[] {
    const key = getTransactionStorageKey(restaurantId);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn(`Failed to parse transactions for key ${key}`, e);
    }
    return [];
  }

  /**
   * Saves transactions for a given restaurant to localStorage.
   */
  static saveTransactions(restaurantId: string | null | undefined, transactions: InventoryTransaction[]): void {
    const key = getTransactionStorageKey(restaurantId);
    try {
      localStorage.setItem(key, JSON.stringify(transactions));
    } catch (e) {
      console.warn(`Failed to save transactions for key ${key}`, e);
    }
  }

  /**
   * Creates a new InventoryTransaction record.
   */
  static createTransaction(payload: {
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
  }): InventoryTransaction {
    return {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      restaurantId: payload.restaurantId,
      inventoryItemId: payload.inventoryItemId,
      itemName: payload.itemName,
      type: payload.type,
      quantity: payload.quantity,
      unit: payload.unit,
      previousQuantity: payload.previousQuantity,
      newQuantity: payload.newQuantity,
      reason: payload.reason || 'General inventory activity',
      referenceId: payload.referenceId,
      createdBy: payload.createdBy || 'Staff Member',
      createdAt: new Date().toISOString()
    };
  }
}
