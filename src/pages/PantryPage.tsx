import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, AlertTriangle, PackageCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IngredientCard } from '../features/ingredients/IngredientCard';
import { AddIngredientModal } from '../features/pantry/components/AddIngredientModal';
import { EditIngredientModal } from '../features/pantry/components/EditIngredientModal';
import { usePantry } from '../hooks/usePantry';
import type { Ingredient, IngredientCategory } from '../types/ingredient';

const CATEGORIES: { label: string; value: IngredientCategory | 'all' }[] = [
  { label: 'All Items', value: 'all' },
  { label: 'Produce', value: 'produce' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Grain', value: 'grain' },
  { label: 'Spices', value: 'spice' },
  { label: 'Meat/Seafood', value: 'meat' },
  { label: 'Liquids/Oils', value: 'liquid' },
  { label: 'Other', value: 'other' }
];

export const PantryPage: React.FC = () => {
  const navigate = useNavigate();
  const { pantry, searchPantry, expiringSoonCount, clearPantry, totalCount } = usePantry();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | 'all'>('all');
  const [freshnessFilter, setFreshnessFilter] = useState<'all' | 'expiring' | 'out_of_stock'>('all');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const filteredPantry = searchPantry(searchQuery, selectedCategory, freshnessFilter === 'expiring' ? 'expiring_soon' : 'all');

  const outOfStockCount = pantry.filter((item) => item.quantity <= 0).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(30, 41, 59, 0.6)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Module 2 &bull; Smart Pantry Vault
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Dynamic Smart Pantry</h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {totalCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all pantry ingredients?')) {
                  clearPantry();
                }
              }}
              style={{
                padding: '10px 16px',
                borderRadius: '16px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                fontWeight: 600,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={16} /> Clear Pantry
            </button>
          )}

          <button
            onClick={() => setIsAddOpen(true)}
            style={{
              padding: '10px 20px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--primary-cyan) 0%, #0284c7 100%)',
              color: '#000000',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} /> Add Ingredient
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <PackageCheck size={28} color="var(--primary-cyan)" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {totalCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Tracked Items</div>
          </div>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderLeft: expiringSoonCount > 0 ? '4px solid var(--accent-amber)' : undefined
          }}
        >
          <AlertTriangle size={28} color="var(--accent-amber)" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {expiringSoonCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Expiring Soon</div>
          </div>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: 'var(--accent-emerald)',
              boxShadow: '0 0 10px var(--accent-emerald)'
            }}
          />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {totalCount - outOfStockCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active In-Stock Items</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div
            style={{
              flex: 1,
              minWidth: '220px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              borderRadius: '14px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Search size={18} color="var(--text-dim)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pantry by item name (e.g. rice, paneer, dragon fruit...)..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                width: '100%'
              }}
            />
          </div>

          {/* Freshness Status Toggle */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => setFreshnessFilter('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: 'none',
                background: freshnessFilter === 'all' ? 'var(--primary-cyan)' : 'transparent',
                color: freshnessFilter === 'all' ? '#000' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              All Items
            </button>
            <button
              onClick={() => setFreshnessFilter('expiring')}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: 'none',
                background: freshnessFilter === 'expiring' ? 'var(--accent-amber)' : 'transparent',
                color: freshnessFilter === 'expiring' ? '#000' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Expiring Soon ({expiringSoonCount})
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '12px',
                border: selectedCategory === cat.value ? '1px solid var(--primary-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: selectedCategory === cat.value ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                color: selectedCategory === cat.value ? 'var(--primary-cyan)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pantry Grid / Empty State */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px'
        }}
      >
        {filteredPantry.length > 0 ? (
          filteredPantry.map((item) => (
            <IngredientCard
              key={item.id}
              ingredient={item}
              onEdit={(ing) => setEditingIngredient(ing)}
            />
          ))
        ) : (
          <div
            className="glass-panel"
            style={{
              gridColumn: '1 / -1',
              padding: '48px 24px',
              textAlign: 'center',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--primary-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Search size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
              {totalCount === 0 ? 'Your pantry is empty.' : 'No matching pantry items found.'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '420px' }}>
              {totalCount === 0
                ? 'Add ingredients to discover recipes automatically generated from your active stock.'
                : 'Try clearing your search query or switching categories.'}
            </p>

            {totalCount === 0 && (
              <button
                onClick={() => setIsAddOpen(true)}
                style={{
                  marginTop: '8px',
                  padding: '10px 20px',
                  borderRadius: '14px',
                  background: 'var(--primary-cyan)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Add Your First Ingredient
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Ingredient Modal */}
      <AddIngredientModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />

      {/* Edit Ingredient Modal */}
      <EditIngredientModal
        ingredient={editingIngredient}
        isOpen={Boolean(editingIngredient)}
        onClose={() => setEditingIngredient(null)}
      />
    </div>
  );
};
