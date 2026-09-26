import React, { useState } from 'react';
import { X, Plus, AlertCircle, Calendar, Tag as TagIcon } from 'lucide-react';
import type { Ingredient, IngredientCategory, FreshnessLevel } from '../../../types/ingredient';
import { usePantry } from '../../../hooks/usePantry';

interface AddIngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_COLORS: Record<IngredientCategory, string> = {
  produce: '#10b981',
  dairy: '#38bdf8',
  meat: '#f43f5e',
  seafood: '#06b6d4',
  grain: '#a16207',
  spice: '#f59e0b',
  liquid: '#8b5cf6',
  canned: '#64748b',
  bakery: '#d97706',
  other: '#ec4899'
};

const COMMON_UNITS = ['kg', 'g', 'mg', 'L', 'ml', 'pcs', 'pack', 'bottle', 'cup', 'tbsp', 'tsp'];

export const AddIngredientModal: React.FC<AddIngredientModalProps> = ({ isOpen, onClose }) => {
  const { addIngredient, pantry } = usePantry();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<string>('1');
  const [unit, setUnit] = useState('pcs');
  const [category, setCategory] = useState<IngredientCategory>('produce');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage('Ingredient name cannot be empty.');
      return;
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setErrorMessage('Quantity must be a positive number.');
      return;
    }

    // Duplicate check warning
    const exists = pantry.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase());
    if (exists) {
      setErrorMessage(`"${trimmedName}" is already in your pantry. You can update its quantity or edit it.`);
      return;
    }

    // Determine freshness based on expiry date
    let freshness: FreshnessLevel = 'fresh';
    if (expiryDate) {
      const exp = new Date(expiryDate).getTime();
      const now = new Date().getTime();
      const daysLeft = (exp - now) / (1000 * 60 * 60 * 24);
      if (daysLeft < 0) {
        freshness = 'critical';
      } else if (daysLeft <= 3) {
        freshness = 'expiring_soon';
      }
    } else if (category === 'grain' || category === 'canned' || category === 'spice') {
      freshness = 'pantry_stable';
    }

    const newIng: Ingredient = {
      id: `ing_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmedName,
      quantity: numQty,
      unit,
      category,
      freshness,
      colorCode: CATEGORY_COLORS[category] || '#06b6d4',
      expiresAt: expiryDate || undefined,
      notes: notes.trim() || undefined,
      createdAt: new Date().toISOString()
    };

    addIngredient(newIng);

    // Reset form
    setName('');
    setQuantity('1');
    setUnit('pcs');
    setCategory('produce');
    setExpiryDate('');
    setNotes('');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(8, 12, 20, 0.85)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '480px',
          padding: '24px 28px',
          borderRadius: '24px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid rgba(6, 182, 212, 0.35)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} color="var(--primary-cyan)" /> Add Dynamic Ingredient
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: 'var(--text-dim)', padding: 4, cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {errorMessage && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#fda4af',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Ingredient Name */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Ingredient Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter ANY item (e.g. Dragon Fruit, Paneer, Avocado, Rice, Millet...)"
              autoFocus
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Quantity & Unit Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Quantity *
              </label>
              <input
                type="number"
                step="any"
                min="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Unit *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '6px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TagIcon size={12} /> Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IngredientCategory)}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              <option value="produce">Produce (Fruits & Veggies)</option>
              <option value="dairy">Dairy & Plant Milks</option>
              <option value="grain">Grains & Rice</option>
              <option value="meat">Meat & Poultry</option>
              <option value="seafood">Seafood</option>
              <option value="spice">Spices & Seasonings</option>
              <option value="liquid">Oils & Liquids</option>
              <option value="canned">Canned & Preserves</option>
              <option value="bakery">Bakery</option>
              <option value="other">Other Pantry Goods</option>
            </select>
          </div>

          {/* Optional Expiry Date */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} /> Expiry Date (Optional)
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '14px',
                background: 'rgba(30, 41, 59, 0.6)',
                color: 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                padding: '10px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                color: '#000000',
                fontWeight: 700,
                fontSize: '0.88rem'
              }}
            >
              Add to Smart Pantry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
