import React, { useState } from 'react';
import { X, Sparkles, Utensils, PackageCheck, Layers } from 'lucide-react';
import { useKitchenState } from '../../../state/KitchenContext';
import { GroceryService } from '../services/groceryService';
import type { SmartGroceryItem } from '../types/groceryTypes';

interface GenerateGroceryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GenerateGroceryModal: React.FC<GenerateGroceryModalProps> = ({ isOpen, onClose }) => {
  const { state, addGroceryItem } = useKitchenState();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('');
  const [mode, setMode] = useState<'inventory' | 'single_recipe' | 'all_recipes'>('inventory');

  if (!isOpen) return null;

  const handleGenerate = () => {
    let generatedItems: SmartGroceryItem[] = [];

    if (mode === 'inventory') {
      generatedItems = GroceryService.generateFromInventory(state.pantry, state.groceryList);
    } else if (mode === 'single_recipe') {
      const recipe = state.recipes.find((r) => r.id === selectedRecipeId) || state.recipes[0];
      if (recipe) {
        generatedItems = GroceryService.generateFromRecipe(recipe, state.pantry, state.groceryList);
      }
    } else if (mode === 'all_recipes') {
      generatedItems = GroceryService.generateFromMultipleRecipes(state.recipes, state.pantry, state.groceryList);
    }

    if (generatedItems.length > 0) {
      generatedItems.forEach((item) => addGroceryItem(item));
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(8, 12, 20, 0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '28px',
          borderRadius: '24px',
          background: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc'
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Auto-Generate Grocery List
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                Create restock requirements from inventory thresholds or recipe needs
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-dim)', border: 'none', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Generation Mode Selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            onClick={() => setMode('inventory')}
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              background: mode === 'inventory' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(30, 41, 59, 0.5)',
              border: mode === 'inventory' ? '1.5px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <PackageCheck size={22} color={mode === 'inventory' ? '#c084fc' : '#94a3b8'} />
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                From Inventory Low / Out of Stock
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Scans all ingredients in shared stock and suggests restock quantities
              </div>
            </div>
          </div>

          <div
            onClick={() => setMode('single_recipe')}
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              background: mode === 'single_recipe' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(30, 41, 59, 0.5)',
              border: mode === 'single_recipe' ? '1.5px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Utensils size={22} color={mode === 'single_recipe' ? '#c084fc' : '#94a3b8'} />
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                  From Specific Selected Recipe
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Calculates missing ingredients for a single target recipe
                </div>
              </div>
            </div>

            {mode === 'single_recipe' && (
              <select
                value={selectedRecipeId}
                onChange={(e) => setSelectedRecipeId(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                {state.recipes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div
            onClick={() => setMode('all_recipes')}
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              background: mode === 'all_recipes' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(30, 41, 59, 0.5)',
              border: mode === 'all_recipes' ? '1.5px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer'
            }}
          >
            <Layers size={22} color={mode === 'all_recipes' ? '#c084fc' : '#94a3b8'} />
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>
                Generate Combined List From All Recipes
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Combines missing requirements across catalog without duplicate items
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              background: 'rgba(30, 41, 59, 0.6)',
              color: '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
            }}
          >
            <Sparkles size={18} /> GENERATE GROCERY ITEMS
          </button>
        </div>
      </div>
    </div>
  );
};
