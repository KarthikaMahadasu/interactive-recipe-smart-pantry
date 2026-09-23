import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Plus, Trash2, ShoppingBag, ArrowRightLeft, Sparkles, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKitchenState } from '../state/KitchenContext';
import type { GroceryItem } from '../state/types';

export const GroceryPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, addGroceryItem, toggleGroceryItem, deleteGroceryItem, transferPurchasedToPantry } = useKitchenState();

  // Form State
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('pcs');
  const [category, setCategory] = useState('Produce');

  // Copy state
  const [copied, setCopied] = useState(false);

  // Recommendations based on low stock in pantry
  const lowStockPantryItems = state.pantry.filter((item) => item.quantity <= 1 || item.freshness === 'critical');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: GroceryItem = {
      id: `g_${Date.now()}`,
      name: name.trim(),
      quantity: Number(quantity),
      unit,
      bought: false,
      category
    };

    addGroceryItem(newItem);
    setName('');
    setQuantity(1);
  };

  const handleCopyList = () => {
    const pendingText = state.groceryList
      .filter((g) => !g.bought)
      .map((g) => `- ${g.name} (${g.quantity} ${g.unit})`)
      .join('\n');

    navigator.clipboard.writeText(`🛒 Kitchen Grocery List:\n${pendingText || 'No pending items'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const purchasedCount = state.groceryList.filter((g) => g.bought).length;
  const pendingCount = state.groceryList.filter((g) => !g.bought).length;

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
              Module 6 &bull; Grocery Auto-Restock
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Smart Grocery & Restock List</h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleCopyList}
            style={{
              padding: '8px 16px',
              borderRadius: '14px',
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
            {copied ? 'Copied to Clipboard' : 'Copy List'}
          </button>

          {purchasedCount > 0 && (
            <button
              onClick={transferPurchasedToPantry}
              style={{
                padding: '8px 18px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)',
                color: '#000',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
              }}
            >
              <ArrowRightLeft size={16} /> Transfer Purchased to Pantry ({purchasedCount})
            </button>
          )}
        </div>
      </div>

      {/* Auto Restock Recommendation Pill Section */}
      {lowStockPantryItems.length > 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '16px 20px',
            borderRadius: '20px',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.88rem' }}>
            <Sparkles size={18} /> Smart Low-Stock Recommendations
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {lowStockPantryItems.map((item) => {
              const alreadyInList = state.groceryList.some((g) => g.name.toLowerCase() === item.name.toLowerCase());
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!alreadyInList) {
                      addGroceryItem({
                        id: `g_recom_${Date.now()}_${item.id}`,
                        name: item.name,
                        quantity: 1,
                        unit: item.unit,
                        bought: false,
                        category: item.category
                      });
                    }
                  }}
                  disabled={alreadyInList}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '12px',
                    background: alreadyInList ? 'rgba(30, 41, 59, 0.5)' : 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: alreadyInList ? 'var(--text-dim)' : 'var(--text-main)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: alreadyInList ? 'default' : 'pointer'
                  }}
                >
                  <Plus size={14} /> {item.name} {alreadyInList ? '(Added)' : '+ Add'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Item Add Form */}
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
          placeholder="Add item to shopping list (e.g. Fresh Basil, Coconut Milk...)"
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
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{
            width: '70px',
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
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="pcs, g..."
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '12px',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            outline: 'none'
          }}
        >
          <option value="Produce">Produce</option>
          <option value="Dairy">Dairy</option>
          <option value="Pantry">Pantry</option>
          <option value="Spices">Spices</option>
          <option value="Meat">Meat</option>
          <option value="Other">Other</option>
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
          <Plus size={16} /> Add Item
        </button>
      </form>

      {/* Grocery Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Pending Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={18} color="var(--accent-emerald)" /> Needed Items ({pendingCount})
          </h3>

          {state.groceryList.filter((g) => !g.bought).length > 0 ? (
            state.groceryList
              .filter((g) => !g.bought)
              .map((item) => (
                <div
                  key={item.id}
                  className="glass-panel glass-panel-hover"
                  style={{
                    padding: '16px 20px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div
                    onClick={() => toggleGroceryItem(item.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', flex: 1 }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{item.name}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-cyan)', fontWeight: 600 }}>
                      {item.quantity} {item.unit}
                    </span>
                    <button
                      onClick={() => deleteGroceryItem(item.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '16px' }}>
              No pending grocery items! Everything is stocked.
            </div>
          )}
        </div>

        {/* Purchased Items (Ready to transfer) */}
        {purchasedCount > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={18} /> Purchased / Cart ({purchasedCount})
            </h3>

            {state.groceryList
              .filter((g) => g.bought)
              .map((item) => (
                <div
                  key={item.id}
                  className="glass-panel"
                  style={{
                    padding: '14px 20px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: 0.75,
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <div
                    onClick={() => toggleGroceryItem(item.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', flex: 1 }}
                  >
                    <CheckCircle size={22} color="var(--accent-emerald)" />
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                      {item.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {item.quantity} {item.unit}
                    </span>
                    <button
                      onClick={() => deleteGroceryItem(item.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
