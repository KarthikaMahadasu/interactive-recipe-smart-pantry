import React, { useState } from 'react';
import { ArrowLeft, Plus, Search, AlertTriangle, PackageCheck, Trash2, Building2, Lock, Camera, ArrowUpDown, Filter, PackageX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { IngredientCard } from '../features/ingredients/IngredientCard';
import { AddIngredientModal } from '../features/pantry/components/AddIngredientModal';
import { EditIngredientModal } from '../features/pantry/components/EditIngredientModal';
import { CameraScannerModal } from '../features/inventory/camera/components/CameraScannerModal';
import { usePantry } from '../hooks/usePantry';
import { useAuth } from '../contexts/AuthContext';
import { getRoleBadgeConfig } from '../utils/permissions';
import type { InventoryStatus, InventorySortOption } from '../features/inventory/utils/inventoryUtils';
import type { Ingredient, IngredientCategory } from '../types/ingredient';

const CATEGORIES: { label: string; value: IngredientCategory | 'all' }[] = [
  { label: 'All Categories', value: 'all' },
  { label: 'Produce', value: 'produce' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Grain', value: 'grain' },
  { label: 'Spices', value: 'spice' },
  { label: 'Meat/Seafood', value: 'meat' },
  { label: 'Liquids/Oils', value: 'liquid' },
  { label: 'Other', value: 'other' }
];

const STATUS_FILTERS: { label: string; value: InventoryStatus | 'all' }[] = [
  { label: 'All Items', value: 'all' },
  { label: 'In Stock', value: 'in_stock' },
  { label: 'Low Stock', value: 'low_stock' },
  { label: 'Expiring Soon', value: 'expiring_soon' },
  { label: 'Out of Stock', value: 'out_of_stock' }
];

export const PantryPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchPantry,
    clearPantry,
    totalCount,
    inStockCount,
    lowStockCount,
    expiringSoonCount,
    outOfStockCount
  } = usePantry();
  const { user, restaurant, hasPermission } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<InventoryStatus | 'all'>('all');
  const [sortOption, setSortOption] = useState<InventorySortOption>('updated_desc');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  const filteredPantry = searchPantry(searchQuery, selectedCategory, statusFilter, sortOption);
  const canManage = hasPermission('manage_inventory');
  const roleConfig = user ? getRoleBadgeConfig(user.role) : null;

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
            <div style={{ fontSize: '0.78rem', color: 'var(--primary-cyan)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={14} /> Shared Workspace Inventory &bull; {restaurant?.name}
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Restaurant Inventory</h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {roleConfig && (
            <span
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: roleConfig.color,
                background: roleConfig.bg,
                border: `1px solid ${roleConfig.border}`
              }}
            >
              Role: {roleConfig.label}
            </span>
          )}

          {/* Camera Scanner Button */}
          {canManage && (
            <button
              onClick={() => setIsCameraOpen(true)}
              style={{
                padding: '10px 18px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)',
                cursor: 'pointer'
              }}
            >
              <Camera size={18} />
              <span>Scan Stock Item</span>
            </button>
          )}

          {canManage && (
            <button
              onClick={() => setIsAddOpen(true)}
              style={{
                padding: '10px 18px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--primary-cyan) 0%, #0284c7 100%)',
                color: '#000000',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)',
                cursor: 'pointer'
              }}
            >
              <Plus size={18} /> Add Stock Item
            </button>
          )}

          {canManage && totalCount > 0 && (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to clear all ${restaurant?.name} inventory items?`)) {
                  clearPantry();
                }
              }}
              style={{
                padding: '10px 14px',
                borderRadius: '16px',
                background: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                fontWeight: 600,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={16} /> Clear All
            </button>
          )}

          {!canManage && (
            <div
              style={{
                padding: '8px 14px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fcd34d',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Lock size={14} /> Shared View Mode ({user?.role?.toUpperCase()})
            </div>
          )}
        </div>
      </div>

      {/* Real-time Calculated Summary Metrics Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        {/* Total Items */}
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
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Tracked Stock</div>
          </div>
        </div>

        {/* In Stock */}
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
              background: '#34d399',
              boxShadow: '0 0 10px #34d399'
            }}
          />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
              {inStockCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Healthy In-Stock</div>
          </div>
        </div>

        {/* Low Stock */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderLeft: lowStockCount > 0 ? '4px solid #fcd34d' : undefined
          }}
        >
          <AlertTriangle size={26} color="#fcd34d" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fcd34d' }}>
              {lowStockCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Low Stock Threshold</div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            borderLeft: expiringSoonCount > 0 ? '4px solid #fb923c' : undefined
          }}
        >
          <AlertTriangle size={26} color="#fb923c" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fb923c' }}>
              {expiringSoonCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Expiring Soon</div>
          </div>
        </div>

        {/* Out of Stock */}
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
          <PackageX size={26} color="#94a3b8" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#94a3b8' }}>
              {outOfStockCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Out of Stock</div>
          </div>
        </div>
      </div>

      {/* Search, Status Tabs, Category & Sort Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '18px 22px',
          borderRadius: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
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
              placeholder={`Search ${restaurant?.name} inventory (e.g. rice, paneer, dragon fruit...)...`}
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

          {/* Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px 12px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <ArrowUpDown size={14} color="var(--primary-cyan)" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as InventorySortOption)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              <option value="updated_desc" style={{ background: '#0f172a' }}>Recently Updated</option>
              <option value="name_asc" style={{ background: '#0f172a' }}>Name (A to Z)</option>
              <option value="name_desc" style={{ background: '#0f172a' }}>Name (Z to A)</option>
              <option value="qty_desc" style={{ background: '#0f172a' }}>Quantity (High to Low)</option>
              <option value="qty_asc" style={{ background: '#0f172a' }}>Quantity (Low to High)</option>
              <option value="expiry_asc" style={{ background: '#0f172a' }}>Expiry Date (Earliest)</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {STATUS_FILTERS.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '12px',
                  border: isActive ? '1px solid var(--primary-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'rgba(6, 182, 212, 0.18)' : 'rgba(30, 41, 59, 0.4)',
                  color: isActive ? 'var(--primary-cyan)' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '12px',
                border: selectedCategory === cat.value ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                background: selectedCategory === cat.value ? 'rgba(139, 92, 246, 0.18)' : 'rgba(30, 41, 59, 0.4)',
                color: selectedCategory === cat.value ? '#c084fc' : 'var(--text-muted)',
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

      {/* Inventory Grid / Empty State */}
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
              onEdit={canManage ? (ing) => setEditingIngredient(ing) : undefined}
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
              {totalCount === 0 ? `Shared inventory for ${restaurant?.name} is empty.` : 'No matching inventory items found.'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '420px' }}>
              {totalCount === 0
                ? 'Add ingredients manually or scan stock items using the camera scanner.'
                : 'Try clearing your search query or switching filters.'}
            </p>

            {canManage && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  onClick={() => setIsCameraOpen(true)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Camera size={16} /> Scan Item
                </button>

                <button
                  onClick={() => setIsAddOpen(true)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '14px',
                    background: 'var(--primary-cyan)',
                    color: '#000',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Add Manually
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Ingredient Modal */}
      {canManage && <AddIngredientModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />}

      {/* Camera Scanner Modal */}
      {canManage && <CameraScannerModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} />}

      {/* Edit Ingredient Modal */}
      {canManage && (
        <EditIngredientModal
          ingredient={editingIngredient}
          isOpen={Boolean(editingIngredient)}
          onClose={() => setEditingIngredient(null)}
        />
      )}
    </div>
  );
};
