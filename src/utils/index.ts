/**
 * Utility functions for the Recipe & Smart Pantry Manager
 */

export function formatQuantity(quantity: number, unit: string): string {
  return `${quantity} ${unit}`;
}

export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
