import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConnectedKitchenEnvironment } from '../features/kitchen-world/ConnectedKitchenEnvironment';
import { AICommandBar } from '../features/ai-brain/AICommandBar';
import { IngredientCard } from '../features/ingredients/IngredientCard';
import { CameraScannerModal } from '../features/inventory/camera/components/CameraScannerModal';
import { useKitchenState } from '../state/KitchenContext';
import { useAuth } from '../contexts/AuthContext';
import { getRoleBadgeConfig } from '../utils/permissions';
import { Package, Plus, Sparkles, Building2, Users, AlertTriangle, Utensils, Camera } from 'lucide-react';
import type { Ingredient } from '../types/ingredient';

export const HomePage: React.FC = () => {
  const { state, addIngredient } = useKitchenState();
  const { user, restaurant, hasPermission } = useAuth();

  // Modals state
  const [newIngredientName, setNewIngredientName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const roleConfig = user ? getRoleBadgeConfig(user.role) : null;
  const canManage = hasPermission('manage_inventory');
  const expiringCount = state.pantry.filter((i) => i.freshness === 'expiring_soon' || i.freshness === 'critical').length;

  const handleAddCustomIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientName.trim()) return;

    const colors = ['#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newIng: Ingredient = {
      id: `ing_${Date.now()}`,
      restaurantId: restaurant?.id,
      name: newIngredientName.trim(),
      category: 'produce',
      quantity: 1,
      unit: 'kg',
      freshness: 'fresh',
      colorCode: randomColor,
      tags: ['custom-dynamic'],
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Staff Member'
    };

    addIngredient(newIng);
    setNewIngredientName('');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Restaurant Workspace Welcome Header */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          borderRadius: '28px',
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', zIndex: 2, position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-cyan)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <Building2 size={16} /> Intelligent Kitchen Workspace
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px', fontFamily: 'var(--font-heading)' }}>
              Welcome to {restaurant?.name || 'Your Kitchen'}
            </h1>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-dim)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span>Staff: <strong style={{ color: '#fff' }}>{user?.name}</strong></span>
              <span>&bull;</span>
              {roleConfig && (
                <span
                  style={{
                    padding: '2px 10px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: roleConfig.color,
                    background: roleConfig.bg,
                    border: `1px solid ${roleConfig.border}`
                  }}
                >
                  {roleConfig.label}
                </span>
              )}
              <span>&bull;</span>
              <span>Type: <strong style={{ color: 'var(--primary-cyan)' }}>{restaurant?.type}</strong></span>
            </p>
          </div>

          {/* Quick Hub Navigation & Camera Shortcuts */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {canManage && (
              <button
                onClick={() => setIsCameraOpen(true)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                  cursor: 'pointer'
                }}
              >
                <Camera size={16} /> Scan Item
              </button>
            )}

            <Link
              to="/ai"
              style={{
                padding: '10px 18px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(6, 182, 212, 0.4)'
              }}
            >
              <Sparkles size={16} /> AI Kitchen Core
            </Link>

            <Link
              to="/staff"
              style={{
                padding: '10px 18px',
                borderRadius: '14px',
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#c084fc',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Users size={16} /> Staff Database
            </Link>
          </div>
        </div>

        {/* Workspace Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '24px'
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '18px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {state.pantry.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Shared Restaurant Items
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '14px 18px',
              borderRadius: '18px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: '12px', background: expiringCount > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: expiringCount > 0 ? '#fcd34d' : '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {expiringCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Low-Stock / Expiring Alerts
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '14px 18px',
              borderRadius: '18px',
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Utensils size={22} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {state.recipes.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Active Menu Catalog
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Central AI Intelligent Command Bar */}
      <AICommandBar style={{ maxWidth: '100%' }} />

      {/* Primary AI Kitchen World Connected Spatial Environment (Module 1 Foundation Preserved!) */}
      <ConnectedKitchenEnvironment />

      {/* Dynamic Restaurant Inventory Grid */}
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
              <Package size={18} /> Shared Restaurant Inventory ({restaurant?.name})
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginTop: '2px' }}>
              Tracked Stock ({state.pantry.length} items)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              All authorized restaurant personnel work with this shared inventory source of truth.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {canManage && (
              <button
                onClick={() => setIsCameraOpen(true)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '14px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  color: '#c084fc',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Camera size={16} /> Scan Item
              </button>
            )}

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
              <Plus size={16} /> Add Dynamic Stock Item
            </button>
          </div>
        </div>

        {/* Add Form */}
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
              placeholder={`Add item to ${restaurant?.name} inventory (e.g. Rice, Paneer, Dragon Fruit...)`}
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
              Add to Shared Stock
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

      {/* Camera Scanner Modal */}
      {canManage && <CameraScannerModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} />}
    </div>
  );
};
