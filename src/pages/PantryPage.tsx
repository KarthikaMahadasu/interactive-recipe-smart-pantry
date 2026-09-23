import React, { useState, useMemo } from 'react';
import { ArrowLeft, Sparkles, Plus, Search, AlertTriangle, PackageCheck, ShoppingBag, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKitchenState } from '../state/KitchenContext';
import { IngredientCard } from '../features/ingredients/IngredientCard';
import type { Ingredient, IngredientCategory, FreshnessLevel } from '../types/ingredient';

const CATEGORIES: { label: string; value: IngredientCategory | 'all' }[] = [
  { label: 'All Items', value: 'all' },
  { label: 'Produce', value: 'produce' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Grain', value: 'grain' },
  { label: 'Spices', value: 'spice' },
  { label: 'Meat/Seafood', value: 'meat' },
  { label: 'Other', value: 'other' }
];

export const PantryPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, addIngredient, addGroceryItem } = useKitchenState();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | 'all'>('all');
  const [freshnessFilter, setFreshnessFilter] = useState<'all' | 'expiring' | 'out_of_stock'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<IngredientCategory>('produce');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [freshness, setFreshness] = useState<FreshnessLevel>('fresh');
  const [tagInput, setTagInput] = useState('');

  // Stats
  const expiringCount = useMemo(() => {
    return state.pantry.filter((item) => item.freshness === 'expiring_soon' || item.freshness === 'critical').length;
  }, [state.pantry]);

  const outOfStockCount = useMemo(() => {
    return state.pantry.filter((item) => item.quantity <= 0).length;
  }, [state.pantry]);

  // Filtered List
  const filteredPantry = useMemo(() => {
    return state.pantry.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesFreshness =
        freshnessFilter === 'all'
          ? true
          : freshnessFilter === 'expiring'
          ? item.freshness === 'expiring_soon' || item.freshness === 'critical'
          : item.quantity <= 0;

      return matchesSearch && matchesCategory && matchesFreshness;
    });
  }, [state.pantry, searchQuery, selectedCategory, freshnessFilter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = ['#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);

    const newIng: Ingredient = {
      id: `ing_${Date.now()}`,
      name: name.trim(),
      category,
      quantity: Number(quantity),
      unit,
      freshness,
      colorCode: randomColor,
      tags: tags.length ? tags : ['pantry'],
      createdAt: new Date().toISOString()
    };

    addIngredient(newIng);
    setName('');
    setTagInput('');
    setQuantity(1);
    setShowAddModal(false);
  };

  const handleBatchRestockExpiring = () => {
    const expiringItems = state.pantry.filter(
      (i) => i.freshness === 'expiring_soon' || i.freshness === 'critical' || i.quantity <= 0
    );
    expiringItems.forEach((item) => {
      addGroceryItem({
        id: `g_batch_${Date.now()}_${item.id}`,
        name: item.name,
        quantity: item.quantity > 0 ? item.quantity : 1,
        unit: item.unit,
        bought: false,
        category: item.category
      });
    });
  };

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
              Module 2 &bull; Pantry Management
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Smart Pantry Vault</h1>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '10px 20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--primary-cyan) 0%, #0284c7 100%)',
            color: '#000',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)',
            cursor: 'pointer'
          }}
        >
          <Plus size={18} /> Add New Ingredient
        </button>
      </div>

      {/* Stats Summary Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {state.pantry.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Tracked Stock</div>
          </div>
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            borderLeft: expiringCount > 0 ? '4px solid var(--accent-amber)' : undefined
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <AlertTriangle size={28} color="var(--accent-amber)" />
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                {expiringCount}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Expiring Soon</div>
            </div>
          </div>

          {expiringCount > 0 && (
            <button
              onClick={handleBatchRestockExpiring}
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: 'var(--accent-amber)',
                fontSize: '0.72rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <ShoppingBag size={12} /> Restock All
            </button>
          )}
        </div>

        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderLeft: outOfStockCount > 0 ? '4px solid var(--accent-rose)' : undefined
          }}
        >
          <Sparkles size={28} color="var(--accent-emerald)" />
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
              {state.pantry.length - outOfStockCount} / {state.pantry.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active In Stock</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
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
              placeholder="Search pantry items, tags, or categories..."
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

          {/* Freshness Toggle Buttons */}
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
              All Status
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
              Expiring ({expiringCount})
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

      {/* Pantry Items Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px'
        }}
      >
        {filteredPantry.length > 0 ? (
          filteredPantry.map((item) => (
            <IngredientCard key={item.id} ingredient={item} />
          ))
        ) : (
          <div
            className="glass-panel"
            style={{
              gridColumn: '1 / -1',
              padding: '40px',
              textAlign: 'center',
              borderRadius: '20px',
              color: 'var(--text-muted)'
            }}
          >
            No pantry items match your current filter criteria.
          </div>
        )}
      </div>

      {/* Add Ingredient Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '480px',
              borderRadius: '24px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)' }}>Add Dynamic Ingredient</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Ingredient Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dragon Fruit, Ragi, Paneer, Avocado, Cashew..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as IngredientCategory)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="produce">Produce</option>
                    <option value="dairy">Dairy</option>
                    <option value="grain">Grain</option>
                    <option value="spice">Spice</option>
                    <option value="meat">Meat / Seafood</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Freshness State
                  </label>
                  <select
                    value={freshness}
                    onChange={(e) => setFreshness(e.target.value as FreshnessLevel)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="fresh">Peak Freshness</option>
                    <option value="expiring_soon">Expiring Soon</option>
                    <option value="critical">Critical (Today)</option>
                    <option value="pantry_stable">Pantry Stable</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                    Unit
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="pcs, g, kg, ml..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(30, 41, 59, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="superfood, keto, organic..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, var(--primary-cyan) 0%, #0284c7 100%)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Add Ingredient to Vault
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
