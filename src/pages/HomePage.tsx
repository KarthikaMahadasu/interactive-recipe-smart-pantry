import React, { useState } from 'react';
import { ConnectedKitchenEnvironment } from '../features/kitchen-world/ConnectedKitchenEnvironment';
import { IngredientCard } from '../features/ingredients/IngredientCard';
import { useKitchenState } from '../state/KitchenContext';
import { Package, Plus } from 'lucide-react';
import type { Ingredient } from '../types/ingredient';

export const HomePage: React.FC = () => {
  const { state, addIngredient } = useKitchenState();

  // Quick ingredient add modal toggle for testing dynamic ingredient handling
  const [newIngredientName, setNewIngredientName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

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
      {/* Primary AI Kitchen World Connected Spatial Environment */}
      <ConnectedKitchenEnvironment />

      {/* Dynamic Ingredient Architecture Showcase */}
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
              <Package size={18} /> Dynamic Ingredient Spatial Architecture
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginTop: '2px' }}>
              Pantry Stock Items ({state.pantry.length})
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Accepts ANY dynamic ingredient object (e.g. Dragon Fruit, Ragi, Paneer, Tofu, Avocado, Cashew, or custom inputs).
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
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Plus size={16} /> Add Custom Dynamic Ingredient
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
                fontSize: '0.85rem',
                cursor: 'pointer'
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
    </div>
  );
};
