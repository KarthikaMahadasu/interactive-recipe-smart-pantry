export type KitchenZoneId = 
  | 'pantry' 
  | 'refrigerator' 
  | 'cooking' 
  | 'prep' 
  | 'serving' 
  | 'ai_workspace';

export interface KitchenZone {
  id: KitchenZoneId;
  name: string;
  tagline: string;
  description: string;
  route: string;
  icon: string;
  colorHex: string;
  glowColor: string;
  itemCountLabel: string;
  position3D: [number, number, number];
  rotation3D?: [number, number, number];
}

export type SpatialRenderMode = '3d' | 'canvas2d' | 'simplified';
