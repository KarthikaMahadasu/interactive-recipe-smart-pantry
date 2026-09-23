import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import type { KitchenZoneId, KitchenZone } from '../types/kitchen';

export const KITCHEN_ZONES: KitchenZone[] = [
  {
    id: 'pantry',
    name: 'Pantry Storage',
    tagline: 'Dry Goods & Staples',
    description: 'Smart inventory for grains, spices, canned goods, and long-term pantry storage.',
    route: '/pantry',
    icon: 'Package',
    colorHex: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.5)',
    itemCountLabel: '6 Items Stored',
    position3D: [-3.2, 0.8, -1.2]
  },
  {
    id: 'refrigerator',
    name: 'Smart Refrigerator',
    tagline: 'Fresh Produce & Cold Vault',
    description: 'Temperature-controlled fresh storage for dairy, fruits, proteins, and greens.',
    route: '/pantry',
    icon: 'ThermometerSnowflake',
    colorHex: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    itemCountLabel: '3 Fresh Items',
    position3D: [-1.8, 1.2, -2.8]
  },
  {
    id: 'ai_workspace',
    name: 'Central AI Pedestal',
    tagline: 'Culinary Intelligence Core',
    description: 'Neural engine analyzing flavor profiles, recipe synthesis, and pantry optimization.',
    route: '/ai',
    icon: 'Brain',
    colorHex: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.7)',
    itemCountLabel: 'AI Core Online',
    position3D: [0, 1.5, -0.5]
  },
  {
    id: 'prep',
    name: 'Preparation Deck',
    tagline: 'Choppping & Measuring',
    description: 'Precision prep area with digital scale, ingredient bowl allocations, and cutting station.',
    route: '/cooking',
    icon: 'UtensilsCrossed',
    colorHex: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.5)',
    itemCountLabel: 'Prep Ready',
    position3D: [1.8, 0.8, -2.5]
  },
  {
    id: 'cooking',
    name: 'Induction Cooking Hub',
    tagline: 'Heat & Thermal Crafting',
    description: 'Smart induction stovetop with step-by-step timer, heat control, and recipe guidance.',
    route: '/cooking',
    icon: 'Flame',
    colorHex: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    itemCountLabel: 'Standby Heat',
    position3D: [3.2, 0.8, -1.2]
  },
  {
    id: 'serving',
    name: 'Serving Counter',
    tagline: 'Plating & Presentation',
    description: 'Final presentation counter for completed culinary creations and nutritional logs.',
    route: '/recipes',
    icon: 'Award',
    colorHex: '#ec4899',
    glowColor: 'rgba(236, 72, 153, 0.5)',
    itemCountLabel: 'Ready to Serve',
    position3D: [0, 0.6, 1.5]
  }
];

// Interactive 3D Zone Mesh
const ZoneMesh: React.FC<{
  zone: KitchenZone;
  isHovered: boolean;
  onHover: (id: KitchenZoneId | null) => void;
  onClick: (zone: KitchenZone) => void;
}> = ({ zone, isHovered, onHover, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (isHovered ? 0.8 : 0.2);
      const targetY = zone.position3D[1] + (isHovered ? 0.3 : 0);
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
    }
  });

  return (
    <group position={zone.position3D}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh
          ref={meshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(zone.id);
          }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            onClick(zone);
          }}
        >
          {zone.id === 'ai_workspace' ? (
            <sphereGeometry args={[0.7, 32, 32]} />
          ) : zone.id === 'refrigerator' ? (
            <boxGeometry args={[0.9, 1.6, 0.8]} />
          ) : zone.id === 'pantry' ? (
            <boxGeometry args={[1.0, 1.2, 0.8]} />
          ) : (
            <cylinderGeometry args={[0.7, 0.8, 0.5, 24]} />
          )}

          <meshStandardMaterial
            color={isHovered ? '#ffffff' : zone.colorHex}
            roughness={0.2}
            metalness={0.6}
            emissive={zone.colorHex}
            emissiveIntensity={isHovered ? 0.8 : 0.3}
            wireframe={isHovered && zone.id === 'ai_workspace'}
          />
        </mesh>
      </Float>

      {/* Floating 3D Zone Title Label */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.28}
        color={isHovered ? '#ffffff' : zone.colorHex}
        anchorX="center"
        anchorY="middle"
      >
        {zone.name}
      </Text>
    </group>
  );
};

// Countertop Base Surface
const KitchenCounterBase: React.FC = () => {
  return (
    <group position={[0, -0.2, 0]}>
      {/* Main Countertop Deck */}
      <RoundedBox args={[9.5, 0.3, 7.0]} radius={0.1} position={[0, 0, -0.5]}>
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </RoundedBox>

      {/* Subtle Grid Lines Overlay */}
      <gridHelper args={[10, 20, '#06b6d4', '#1e293b']} position={[0, 0.16, -0.5]} />
    </group>
  );
};

interface SpatialKitchenSceneProps {
  activeZoneId: KitchenZoneId | null;
  onZoneHover: (id: KitchenZoneId | null) => void;
  onZoneClick: (zone: KitchenZone) => void;
}

export const SpatialKitchenScene: React.FC<SpatialKitchenSceneProps> = ({
  activeZoneId,
  onZoneHover,
  onZoneClick
}) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 5.5, 7.5], fov: 48 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Ambient & Directional Lights */}
        <ambientLight intensity={0.6} />
        <pointLight position={[0, 6, 0]} intensity={1.5} color="#06b6d4" />
        <directionalLight position={[5, 8, 5]} intensity={1.0} />

        {/* Counter Surface */}
        <KitchenCounterBase />

        {/* Interactive 3D Kitchen Zone Meshes */}
        {KITCHEN_ZONES.map((zone) => (
          <ZoneMesh
            key={zone.id}
            zone={zone}
            isHovered={activeZoneId === zone.id}
            onHover={onZoneHover}
            onClick={onZoneClick}
          />
        ))}
      </Canvas>
    </div>
  );
};
