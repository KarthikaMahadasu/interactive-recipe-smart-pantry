import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Plus, Trash2, ShoppingBag, Sparkles, Copy, Check, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKitchenState } from '../state/KitchenContext';
import { GroceryItemDetailModal } from '../features/grocery/components/GroceryItemDetailModal';
import { GenerateGroceryModal } from '../features/grocery/components/GenerateGroceryModal';
import type { SmartGroceryItem, GroceryPriority, GroceryStatus } from '../features/grocery/types/groceryTypes';
import { useAuth } from '../contexts/AuthContext';

export const GroceryPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, addGroceryItem, deleteGroceryItem } = useKitchenState();
  const { restaurant } = useAuth();

  // Modals state
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
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
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Module 6 &bull; Smart Grocery Workspace &bull; {restaurant?.name}
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Smart Grocery & Restock Management</h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsGenerateOpen(true)}
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
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
            }}
          >
            <Sparkles size={18} /> Auto-Generate List
          </button>

          <button
            onClick={handleCopyList}
            style={{
              padding: '10px 16px',
              borderRadius: '16px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'var(--text-main)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
            {copied ? 'Copied List' : 'Copy List'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ShoppingBag size={28} color="#f43f5e" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f43f5e' }}>{neededCount}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Needed Items</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <CheckCircle size={28} color="#38bdf8" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>{purchasedCount}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Purchased / In-Transit</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Truck size={28} color="#34d399" />
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>{receivedCount}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Received Deliveries</div>
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
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name (e.g. Rice, Paneer, Dragon Fruit...)"
          style={{
            flex: 2,
            minWidth: '200px',
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-main)',
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
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-main)',
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
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-main)',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        >
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="L">L</option>
          <option value="ml">ml</option>
          <option value="pcs">pcs</option>
          <option value="pack">pack</option>
          <option value="bottle">bottle</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as GroceryPriority)}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        >
          <option value="HIGH">🔴 High Priority</option>
          <option value="MEDIUM">🟡 Medium Priority</option>
          <option value="LOW">🟢 Low Priority</option>
        </select>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            background: 'var(--accent-emerald)',
            color: '#000',
            fontWeight: 700,
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
              background: statusTab === tab ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.4)',
              border: statusTab === tab ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
              color: statusTab === tab ? '#34d399' : 'var(--text-muted)',
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
            <h3 style={{ fontSize: '1rem', color: '#fda4af', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔴 HIGH PRIORITY ({highPriorityItems.length})
            </h3>
            {highPriorityItems.map((item) => renderGroceryCard(item))}
          </div>
        )}

        {/* MEDIUM PRIORITY */}
        {mediumPriorityItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '1rem', color: '#fcd34d', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🟡 MEDIUM PRIORITY ({mediumPriorityItems.length})
            </h3>
            {mediumPriorityItems.map((item) => renderGroceryCard(item))}
          </div>
        )}

        {/* LOW PRIORITY */}
        {lowPriorityItems.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h3 style={{ fontSize: '1rem', color: '#6ee7b7', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              🟢 LOW PRIORITY ({lowPriorityItems.length})
            </h3>
            {lowPriorityItems.map((item) => renderGroceryCard(item))}
          </div>
        )}

        {filteredList.length === 0 && (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '20px' }}>
            No grocery items matching current status filter. Click "Auto-Generate List" or "Add Grocery Item" above!
          </div>
        )}
      </div>

      {/* Modals */}
      <GenerateGroceryModal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} />

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
    return (
      <div
        key={item.id}
        className="glass-panel glass-panel-hover"
        onClick={() => setSelectedInspectItem(item)}
        style={{
          padding: '16px 20px',
          borderRadius: '18px',
          borderLeft: `4px solid ${item.priority === 'HIGH' ? '#f43f5e' : item.priority === 'MEDIUM' ? '#f59e0b' : '#10b981'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: item.status === 'PURCHASED' ? 'rgba(56, 189, 248, 0.08)' : item.status === 'RECEIVED' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.85)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: item.priority === 'HIGH' ? '#f43f5e' : item.priority === 'MEDIUM' ? '#f59e0b' : '#10b981'
            }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.02rem', color: 'var(--text-main)' }}>
              {item.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>Reason: {item.reason}</span>
              <span>&bull; Source: {item.source}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary-cyan)' }}>
              {item.quantity} {item.unit}
            </div>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: item.status === 'RECEIVED' ? '#34d399' : item.status === 'PURCHASED' ? '#38bdf8' : '#fcd34d'
              }}
            >
              {item.status}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteGroceryItem(item.id);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: 4 }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    );
  }
};
