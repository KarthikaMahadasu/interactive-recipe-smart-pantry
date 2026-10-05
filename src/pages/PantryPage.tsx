import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, AlertTriangle, PackageCheck, Trash2, Building2, Lock, Camera, ArrowUpDown, PackageX, MinusCircle, SlidersHorizontal, History } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IngredientCard } from '../features/ingredients/IngredientCard';
import { AddIngredientModal } from '../features/pantry/components/AddIngredientModal';
import { EditIngredientModal } from '../features/pantry/components/EditIngredientModal';
import { CameraScannerModal } from '../features/inventory/camera/components/CameraScannerModal';
import { ManualUsageModal } from '../features/inventory/components/ManualUsageModal';
import { WasteTrackingModal } from '../features/inventory/components/WasteTrackingModal';
import { StockAdjustmentModal } from '../features/inventory/components/StockAdjustmentModal';
import { InventoryHistorySection } from '../features/inventory/components/InventoryHistorySection';
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
  const location = useLocation();
  const {
    searchPantry,
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
  const [activeTab, setActiveTab] = useState<'inventory' | 'history'>('inventory');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);
  const [isWasteOpen, setIsWasteOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);

  useEffect(() => {
    if (location.search.includes('camera=true')) {
      setIsCameraOpen(true);
    }
  }, [location.search]);

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
              background: '#f1f5f9',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid #e2e8f0'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Building2 size={14} /> Shared Workspace Inventory &bull; {restaurant?.name}
            </div>
            <h1 style={{ fontSize: '1.6rem', color: '#ea580c', fontWeight: 800 }}>Restaurant Inventory</h1>
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

          {/* Step 10 Manual Operations Buttons */}
          <button
            onClick={() => setIsUsageOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '14px',
              background: '#fffbebf0',
              border: '1px solid #fde68a',
              color: '#b45309',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <MinusCircle size={15} /> Record Usage
          </button>

          <button
            onClick={() => setIsWasteOpen(true)}
            style={{
              padding: '8px 14px',
              borderRadius: '14px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Trash2 size={15} /> Record Waste
          </button>

          {canManage && (
            <button
              onClick={() => setIsAdjustOpen(true)}
              style={{
                padding: '8px 14px',
                borderRadius: '14px',
                background: '#fff7ed',
                border: '1px solid #ffedd5',
                color: '#ea580c',
                fontWeight: 700,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <SlidersHorizontal size={15} /> Adjust Stock
            </button>
          )}

          {/* Camera Scanner Button */}
          {canManage && (
            <button
              onClick={() => setIsCameraOpen(true)}
              style={{
                padding: '10px 18px',
                borderRadius: '16px',
                background: '#ffffff',
                border: '1.5px solid #ea580c',
                color: '#ea580c',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(234, 88, 12, 0.1)',
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
                background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(234, 88, 12, 0.3)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <Plus size={18} /> Add Stock Item
            </button>
          )}

          {!canManage && (
            <div
              style={{
                padding: '8px 14px',
                borderRadius: '12px',
                background: '#fffbe8',
                border: '1px solid #fde68a',
                color: '#b45309',
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

      {/* Main Mode Tabs: Stock Room vs Inventory History */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('inventory')}
          style={{
            padding: '10px 20px',
            borderRadius: '16px',
            background: activeTab === 'inventory' ? 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' : '#ffffff',
            border: activeTab === 'inventory' ? 'none' : '1px solid #cbd5e1',
            color: activeTab === 'inventory' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'inventory' ? '0 4px 15px rgba(234, 88, 12, 0.25)' : 'none'
          }}
        >
          <PackageCheck size={18} /> Stock Room View
        </button>

        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '10px 20px',
            borderRadius: '16px',
            background: activeTab === 'history' ? 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)' : '#ffffff',
            border: activeTab === 'history' ? 'none' : '1px solid #cbd5e1',
            color: activeTab === 'history' ? '#ffffff' : '#64748b',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: activeTab === 'history' ? '0 4px 15px rgba(234, 88, 12, 0.25)' : 'none'
          }}
        >
          <History size={18} /> Activity Log & Audit History
        </button>
      </div>

      {activeTab === 'inventory' ? (
        <>
          {/* Real-time Summary Metrics Banner */}
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
              <PackageCheck size={28} color="#ea580c" />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                  {totalCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Total Tracked Stock</div>
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
                  background: '#10b981',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)'
                }}
              />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                  {inStockCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Healthy In-Stock</div>
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
                borderLeft: lowStockCount > 0 ? '4px solid #f59e0b' : undefined
              }}
            >
              <AlertTriangle size={26} color="#f59e0b" />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                  {lowStockCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Low Stock Threshold</div>
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
                borderLeft: expiringSoonCount > 0 ? '4px solid #ea580c' : undefined
              }}
            >
              <AlertTriangle size={26} color="#ea580c" />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ea580c' }}>
                  {expiringSoonCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Expiring Soon</div>
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
              <PackageX size={26} color="#64748b" />
              <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#64748b' }}>
                  {outOfStockCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Out of Stock</div>
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
              <div
                style={{
                  flex: 1,
                  minWidth: '220px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 16px',
                  borderRadius: '14px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1'
                }}
              >
                <Search size={18} color="#ea580c" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${restaurant?.name} inventory (e.g. rice, paneer, dragon fruit...)...`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    width: '100%'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', padding: '6px 12px', borderRadius: '14px', border: '1.5px solid #cbd5e1' }}>
                <ArrowUpDown size={14} color="#ea580c" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as InventorySortOption)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#0f172a',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="updated_desc" style={{ background: '#ffffff', color: '#0f172a' }}>Recently Updated</option>
                  <option value="name_asc" style={{ background: '#ffffff', color: '#0f172a' }}>Name (A to Z)</option>
                  <option value="name_desc" style={{ background: '#ffffff', color: '#0f172a' }}>Name (Z to A)</option>
                  <option value="qty_desc" style={{ background: '#ffffff', color: '#0f172a' }}>Quantity (High to Low)</option>
                  <option value="qty_asc" style={{ background: '#ffffff', color: '#0f172a' }}>Quantity (Low to High)</option>
                  <option value="expiry_asc" style={{ background: '#ffffff', color: '#0f172a' }}>Expiry Date (Earliest)</option>
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
                      border: isActive ? '1.5px solid #ea580c' : '1px solid #cbd5e1',
                      background: isActive ? '#fff7ed' : '#ffffff',
                      color: isActive ? '#ea580c' : '#64748b',
                      fontWeight: 700,
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
                    border: selectedCategory === cat.value ? '1.5px solid #ea580c' : '1px solid #cbd5e1',
                    background: selectedCategory === cat.value ? '#fff7ed' : '#ffffff',
                    color: selectedCategory === cat.value ? '#ea580c' : '#64748b',
                    fontWeight: 700,
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
              </div>
            )}
          </div>
        </>
      ) : (
        <InventoryHistorySection />
      )}

      {/* Modals */}
      {canManage && <AddIngredientModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />}
      {canManage && <CameraScannerModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} />}
      <ManualUsageModal isOpen={isUsageOpen} onClose={() => setIsUsageOpen(false)} />
      <WasteTrackingModal isOpen={isWasteOpen} onClose={() => setIsWasteOpen(false)} />
      {canManage && <StockAdjustmentModal isOpen={isAdjustOpen} onClose={() => setIsAdjustOpen(false)} />}
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
