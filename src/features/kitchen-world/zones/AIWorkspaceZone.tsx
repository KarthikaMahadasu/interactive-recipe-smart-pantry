import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { SpatialZone } from '../../../spatial/SpatialZone';
import type { KitchenZone } from '../../../types/kitchen';
import { FloatingElement } from '../../../spatial/FloatingElement';

export const AI_WORKSPACE_ZONE_DATA: KitchenZone = {
  id: 'ai_workspace',
  name: 'Central AI Workspace',
  tagline: 'Culinary Intelligence Core',
  description: 'Neural workspace processing recipe synthesis, ingredient matching, and smart meal planning.',
  route: '/ai',
  icon: 'Brain',
  colorHex: '#8b5cf6',
  glowColor: 'rgba(139, 92, 246, 0.6)',
  itemCountLabel: 'AI Core Online',
  position3D: [0, 1.5, -0.5]
};

interface AIWorkspaceZoneProps {
  active?: boolean;
  onHover?: (id: string | null) => void;
  onClick?: (zone: KitchenZone) => void;
}

export const AIWorkspaceZone: React.FC<AIWorkspaceZoneProps> = ({ active, onHover, onClick }) => {
  return (
    <SpatialZone zone={AI_WORKSPACE_ZONE_DATA} active={active} onHover={onHover} onClick={onClick}>
      {/* Circular Spatial Platform & Energy Movement Container */}
      <div
        style={{
          width: '100%',
          height: '95px',
          borderRadius: '20px',
          background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.3) 0%, rgba(15, 23, 42, 0.95) 80%)',
          border: '1.5px solid rgba(139, 92, 246, 0.5)',
          boxShadow: '0 0 24px rgba(139, 92, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Floating Energy Particles */}
        <FloatingElement color="#a78bfa" size={6} top="25%" left="20%" delay={0} />
        <FloatingElement color="#06b6d4" size={5} top="65%" left="75%" delay={1} />
        <FloatingElement color="#c084fc" size={7} top="30%" left="80%" delay={2} />

        {/* Central Rotating Platform Ring */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: '2px dashed #a78bfa',
            animation: 'spatialSpin 12s linear infinite',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #8b5cf6 0%, #4c1d95 100%)',
              boxShadow: '0 0 16px #8b5cf6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Brain size={20} />
          </div>
        </div>

        <div style={{ position: 'absolute', top: 8, right: 12, color: '#a78bfa' }}>
          <Sparkles size={18} />
        </div>
      </div>
    </SpatialZone>
  );
};
