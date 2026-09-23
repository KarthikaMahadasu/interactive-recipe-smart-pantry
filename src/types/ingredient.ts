export type IngredientCategory = 
  | 'produce' 
  | 'dairy' 
  | 'meat' 
  | 'seafood' 
  | 'grain' 
  | 'spice' 
  | 'liquid' 
  | 'canned' 
  | 'bakery'
  | 'other';

export type FreshnessLevel = 'fresh' | 'expiring_soon' | 'critical' | 'pantry_stable';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity: number;
  unit: string; // e.g., 'g', 'kg', 'pcs', 'ml', 'cups', 'tbsp'
  freshness: FreshnessLevel;
  colorCode: string; // Dynamic hex/HSL accent color for 3D & UI representation
  iconName?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  expiresAt?: string;
  spatialPosition?: [number, number, number]; // [x, y, z] for 3D kitchen placement
}

export type DynamicIngredientInput = Omit<Ingredient, 'id' | 'createdAt'>;
