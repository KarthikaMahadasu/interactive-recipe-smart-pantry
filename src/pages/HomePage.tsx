import React, { useState, useRef } from 'react';
import { WelcomeBanner } from '../features/kitchen-world/WelcomeBanner';
import { AIBrainOrb } from '../features/ai-brain/AIBrainOrb';
import { AIBrainStatePicker } from '../features/ai-brain/AIBrainStatePicker';
import { AICommandBar } from '../features/ai-brain/AICommandBar';
import { SpatialCanvas } from '../spatial/SpatialCanvas';
import { ZoneDetailModal } from '../features/kitchen-world/ZoneDetailModal';
import { IngredientCard } from '../features/ingredients/IngredientCard';
import type { KitchenZone } from '../types/kitchen';
import { useKitchenState } from '../state/KitchenContext';
import { useAIBrain } from '../hooks/useAIBrain';
import { Sparkles, Package, Plus } from 'lucide-react';
import type { Ingredient } from '../types/ingredient';

export const HomePage: React.FC = () => {
  const { state, setActiveZone, addIngredient } = useKitchenState();
  const { aiState, changeState } = useAIBrain();
  const [selectedZone, setSelectedZone] = useState<KitchenZone | null>(null);
  
  // Ref for scrolling down to AI Command area when quick prompt button clicked
  const aiCommandRef = useRef<HTMLDivElement | null>(null);

  // Quick ingredient add modal toggle for testing dynamic ingredient handling
  const [newIngredientName, setNewIngredientName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleZoneClick = (zone: KitchenZone) => {
    setSelectedZone(zone);
  };

  const handleAskAIClick = () => {
    aiCommandRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddCustomIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) return;

    const colors = ['#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newIng: Ingredient = {
      id: `ing_${Date.now()}`,
      name: newIngredientName.trim(),
      category: 'produce',
      quantity: 1,
      unit: 'kg',
      freshness: 'fresh',
      colorCode: randomColor,
      tags: ['custom-dynamic'],
      createdAt: new Date().toISOString()
    };

    addIngredient(newIng);
    setNewIngredientName('');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 1. Hero Entrance Banner */}
      <WelcomeBanner onAskAIClick={handleAskAIClick} />

      {/* 2. Central AI Brain Identity & Spatial Scene Container */}
      <div
        className="glass-panel"
        style={{
          padding: '28px',
          borderRadius: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          background: 'rgba(15, 23, 42, 0.75)'
        }}
      >
        {/* Top Bar of Kitchen World */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-cyan)', fontWeight: 600, fontSize: '0.9rem' }}>
              <Sparkles size={18} /> Central AI Kitchen Environment
            </div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginTop: '2px' }}>
              Spatial Kitchen World
            </h2>
          </div>

          {/* AI Brain State Selector Controls */}
          <AIBrainStatePicker currentState={aiState} onStateChange={changeState} />
        </div>

        {/* Hero AI Brain Orb & Spatial Deck Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 260px) 1fr',
            gap: '24px',
            alignItems: 'center'
          }}
          className="spatial-grid-layout"
        >
          {/* Central AI Orb Display Unit */}
          <div
            className="glass-panel"
            style={{
              padding: '24px 16px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, rgba(15, 23, 42, 0.9) 80%)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              boxShadow: '0 8px 32px rgba(6, 182, 212, 0.15)',
              minHeight: '260px'
            }}
          >
            <AIBrainOrb state={aiState} size={180} />
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Neural Kitchen Core
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Visual State: <strong style={{ color: 'var(--primary-cyan)' }}>{aiState}</strong>
              </div>
            </div>
          </div>

          {/* 3D / 2.5D Interactive Spatial Canvas */}
          <SpatialCanvas
            activeZoneId={state.activeZone}
            onZoneHover={setActiveZone}
            onZoneClick={handleZoneClick}
          />
        </div>
      </div>

      {/* 3. AI Command Input Section */}
      <div ref={aiCommandRef} style={{ scrollMarginTop: '100px' }}>
        <AICommandBar />
      </div>

      {/* 4. Dynamic Pantry Ingredients Showcase */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: 600, fontSize: '0.88rem' }}>
              <Package size={18} /> Dynamic Ingredient Registry
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginTop: '2px' }}>
              Active Kitchen Stock ({state.pantry.length} Items)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Accepts ANY dynamic item (e.g. Dragon Fruit, Ragi, Paneer, Tofu, Avocado, Cashew, or custom inputs).
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '8px 16px',
              borderRadius: '14px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontWeight: 600,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> Test Add Dynamic Ingredient
          </button>
        </div>

        {/* Test Add Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddCustomIngredient}
            style={{
              display: 'flex',
              gap: '10px',
              padding: '14px',
              background: 'rgba(8, 12, 20, 0.6)',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}
          >
            <input
              type="text"
              value={newIngredientName}
              onChange={(e) => setNewIngredientName(e.target.value)}
              placeholder="Enter ANY ingredient name (e.g. Millet, Dragon Fruit, Paneer, Chicken, Potato...)"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.9rem'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '6px 16px',
                borderRadius: '12px',
                background: 'var(--accent-emerald)',
                color: '#000',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              Add Item
            </button>
          </form>
        )}

        {/* Ingredient Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px'
          }}
        >
          {state.pantry.map((item) => (
            <IngredientCard key={item.id} ingredient={item} />
          ))}
        </div>
      </div>

      {/* Zone Detail Modal Overlay */}
      <ZoneDetailModal zone={selectedZone} onClose={() => setSelectedZone(null)} />

      {/* Responsive Inline CSS */}
      <style>{`
        @media (max-width: 768px) {
          .spatial-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
