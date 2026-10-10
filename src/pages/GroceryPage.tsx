import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Plus, Trash2, ShoppingBag, Sparkles, Copy, Check, Truck, PackagePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKitchenState } from '../state/KitchenContext';
import { GroceryItemDetailModal } from '../features/grocery/components/GroceryItemDetailModal';
import { GenerateGroceryModal } from '../features/grocery/components/GenerateGroceryModal';
import { QuickAddInventoryModal } from '../features/grocery/components/QuickAddInventoryModal';
import { BulkReceiveModal } from '../features/grocery/components/BulkReceiveModal';
import type { SmartGroceryItem, GroceryPriority, GroceryStatus } from '../features/grocery/types/groceryTypes';
import { useAuth } from '../contexts/AuthContext';

export const GroceryPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, addGroceryItem, deleteGroceryItem } = useKitchenState();
  const { restaurant } = useAuth();

  // Modals state
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isBulkReceiveOpen, setIsBulkReceiveOpen] = useState(false);
  const [quickAddItem, setQuickAddItem] = useState<SmartGroceryItem | null>(null);
  const [selectedInspectItem, setSelectedInspectItem] = useState<SmartGroceryItem | null>(null);

  // Quick Form State
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('5');
  const [unit, setUnit] = useState('kg');
  const [priority, setPriority] = useState<GroceryPriority>('HIGH');
  const [category] = useState('Produce');

  // Copy state
  const [copied, setCopied] = useState(false);

  // Status Tab State
  const [statusTab, setStatusTab] = useState<GroceryStatus | 'ALL'>('NEEDED');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: SmartGroceryItem = {
      id: `g_manual_${Date.now()}`,
      restaurantId: restaurant?.id,
      name: name.trim(),
      quantity: parseFloat(quantity) || 1,
      unit,
      reason: 'Manual staff addition',
      priority,
      source: 'MANUAL',
      status: 'NEEDED',
      category,
      createdAt: new Date().toISOString()
    };

    addGroceryItem(newItem);
    setName('');
    setQuantity('5');
  };

  const handleCopyList = () => {
    const pendingText = state.groceryList
      .filter((g) => g.status === 'NEEDED' || g.status === 'ORDERED' || g.status === 'PURCHASED')
      .map((g) => `- [${g.priority}] ${g.name}: ${g.quantity} ${g.unit} (${g.reason})`)
      .join('\n');

    navigator.clipboard.writeText(`🛒 ${restaurant?.name || 'Restaurant'} Smart Grocery Requirements:\n${pendingText || 'No pending grocery items'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter items by status tab
  const filteredList = state.groceryList.filter((g) => {
    if (statusTab === 'ALL') return true;
    if (statusTab === 'NEEDED') return g.status === 'NEEDED' || g.status === 'ORDERED';
    return g.status === statusTab;
  });

  const highPriorityItems = filteredList.filter((g) => g.priority === 'HIGH');
  const mediumPriorityItems = filteredList.filter((g) => g.priority === 'MEDIUM');
  const lowPriorityItems = filteredList.filter((g) => g.priority === 'LOW');

  const neededCount = state.groceryList.filter((g) => g.status === 'NEEDED' || g.status === 'ORDERED').length;
  const purchasedCount = state.groceryList.filter((g) => g.status === 'PURCHASED').length;
  const receivedCount = state.groceryList.filter((g) => g.status === 'RECEIVED').length;

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
            <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Module 6 &bull; Smart Grocery Workspace &bull; {restaurant?.name}
            </div>
            <h1 style={{ fontSize: '1.6rem', color: '#ea580c', fontWeight: 800 }}>Smart Grocery & Restock Management</h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsBulkReceiveOpen(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(22, 163, 74, 0.25)'
            }}
          >
            <Truck size={18} /> Bulk Receive Items
          </button>

          <button
            onClick={() => setIsGenerateOpen(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(234, 88, 12, 0.3)'
            }}
          >
            <Sparkles size={18} /> Auto-Generate List
          </button>

          <button
            onClick={handleCopyList}
            style={{
              padding: '10px 16px',
              borderRadius: '16px',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: '#0f172a',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            {copied ? 'Copied List' : 'Copy List'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <ShoppingBag size={28} color="#ea580c" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ea580c' }}>{neededCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Needed Items</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <CheckCircle size={28} color="#0284c7" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0284c7' }}>{purchasedCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Purchased / In-Transit</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
          <Truck size={28} color="#10b981" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{receivedCount}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Received Deliveries</div>
          </div>
        </div>
      </div>

      {/* Quick Item Add Form */}
      <form
        onSubmit={handleAddItem}
        className="glass-panel"
        style={{
          padding: '16px 20px',
          borderRadius: '20px',
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
          background: '#ffffff',
          border: '1px solid #e2e8f0'
        }}
      >
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name (e.g. Rice, Curry Leaves, Garlic...)"
          style={{
            flex: 2,
            minWidth: '200px',
            padding: '10px 14px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />

        <input
          type="number"
          step="any"
          min="0.1"
          required
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{
            width: '80px',
            padding: '10px 14px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        />

        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        >
          <option value="kg" style={{ background: '#ffffff', color: '#0f172a' }}>kg</option>
          <option value="g" style={{ background: '#ffffff', color: '#0f172a' }}>g</option>
          <option value="L" style={{ background: '#ffffff', color: '#0f172a' }}>L</option>
          <option value="ml" style={{ background: '#ffffff', color: '#0f172a' }}>ml</option>
          <option value="pcs" style={{ background: '#ffffff', color: '#0f172a' }}>pcs</option>
          <option value="pack" style={{ background: '#ffffff', color: '#0f172a' }}>pack</option>
          <option value="bottle" style={{ background: '#ffffff', color: '#0f172a' }}>bottle</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as GroceryPriority)}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            background: '#ffffff',
            border: '1.5px solid #cbd5e1',
            color: '#0f172a',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        >
          <option value="HIGH" style={{ background: '#ffffff', color: '#0f172a' }}>🔴 High Priority</option>
          <option value="MEDIUM" style={{ background: '#ffffff', color: '#0f172a' }}>🟡 Medium Priority</option>
          <option value="LOW" style={{ background: '#ffffff', color: '#0f172a' }}>🟢 Low Priority</option>
        </select>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.88rem',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Plus size={16} /> Add Grocery Item
        </button>
      </form>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
        {(['NEEDED', 'PURCHASED', 'RECEIVED', 'ALL'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '14px',
              background: statusTab === tab ? '#fff7ed' : '#ffffff',
              border: statusTab === tab ? '1.5px solid #ea580c' : '1px solid #cbd5e1',
              color: statusTab === tab ? '#ea580c' : '#64748b',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            {tab === 'NEEDED' ? `Needed / Out of Stock (${neededCount})` : tab === 'PURCHASED' ? `Purchased / In-Transit (${purchasedCount})` : tab === 'RECEIVED' ? `Received History (${receivedCount})` : 'All Items'}
          </button>
        ))}
      </div>

      {/* Priority Grouped Grocery Lists */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* HIGH PRIORITY */}
        {highPriorityItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '1rem', color: '#b91c1c', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔴 HIGH PRIORITY ({highPriorityItems.length})
            </h3>
            {highPriorityItems.map((item) => renderGroceryCard(item))}
          </div>
        )}

        {/* MEDIUM PRIORITY */}
        {mediumPriorityItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '1rem', color: '#b45309', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🟡 MEDIUM PRIORITY ({mediumPriorityItems.length})
            </h3>
            {mediumPriorityItems.map((item) => renderGroceryCard(item))}
          </div>
        )}

        {/* LOW PRIORITY */}
        {lowPriorityItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '1rem', color: '#047857', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🟢 LOW PRIORITY ({lowPriorityItems.length})
            </h3>
            {lowPriorityItems.map((item) => renderGroceryCard(item))}
          </div>
        )}

        {filteredList.length === 0 && (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: '#64748b', borderRadius: '20px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
            No grocery items matching current status filter. Click "Auto-Generate List" or "Add Grocery Item" above!
          </div>
        )}
      </div>

      {/* Modals */}
      <GenerateGroceryModal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} />

      <BulkReceiveModal
        items={state.groceryList}
        isOpen={isBulkReceiveOpen}
        onClose={() => setIsBulkReceiveOpen(false)}
      />

      {quickAddItem && (
        <QuickAddInventoryModal
          item={quickAddItem}
          isOpen={Boolean(quickAddItem)}
          onClose={() => setQuickAddItem(null)}
        />
      )}

      {selectedInspectItem && (
        <GroceryItemDetailModal
          item={selectedInspectItem}
          isOpen={Boolean(selectedInspectItem)}
          onClose={() => setSelectedInspectItem(null)}
        />
      )}
    </div>
  );

  function renderGroceryCard(item: SmartGroceryItem) {
    const isReceived = item.status === 'RECEIVED';

    return (
      <div
        key={item.id}
        className="glass-panel glass-panel-hover"
        onClick={() => setSelectedInspectItem(item)}
        style={{
          padding: '16px 20px',
          borderRadius: '18px',
          borderLeft: `4px solid ${item.priority === 'HIGH' ? '#ef4444' : item.priority === 'MEDIUM' ? '#f59e0b' : '#10b981'}`,
          borderTop: '1px solid #e2e8f0',
          borderRight: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: item.status === 'PURCHASED' ? '#f0f9ff' : isReceived ? '#ecfdf5' : '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: item.priority === 'HIGH' ? '#ef4444' : item.priority === 'MEDIUM' ? '#f59e0b' : '#10b981'
            }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.02rem', color: '#0f172a' }}>
              {item.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Reason: {item.reason}</span>
              <span>&bull; Source: {item.source}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#ea580c' }}>
              {item.quantity} {item.unit}
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: isReceived ? '#047857' : item.status === 'PURCHASED' ? '#0284c7' : '#b45309'
              }}
            >
              {item.status}
            </span>
          </div>

          {/* Action Buttons: 1. Add to Inventory (+)  2. Delete */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!isReceived && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickAddItem(item);
                }}
                title={`Add ${item.name} to inventory`}
                style={{
                  padding: '6px 10px',
                  borderRadius: '10px',
                  background: '#fff7ed',
                  border: '1px solid #fdba74',
                  color: '#ea580c',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <PackagePlus size={16} />
                <span>+ Stock</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteGroceryItem(item.id);
              }}
              title="Delete grocery item"
              style={{
                padding: '6px',
                borderRadius: '10px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }
};
