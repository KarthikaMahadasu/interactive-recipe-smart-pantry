import React, { useState } from 'react';
import { History, Search, ArrowUpRight, ArrowDownLeft, Trash2, Camera, Utensils, RefreshCw, User, Calendar } from 'lucide-react';
import { useKitchenState } from '../../../state/KitchenContext';
import type { TransactionType } from '../types/transactionTypes';

export const InventoryHistorySection: React.FC = () => {
  const { state } = useKitchenState();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL');

  const getTxBadge = (type: TransactionType) => {
    switch (type) {
      case 'RECEIVED':
        return { label: 'Received Delivery', color: '#34d399', bg: 'rgba(16, 185, 129, 0.15)', icon: ArrowDownLeft };
      case 'CAMERA_RECEIVED':
        return { label: 'Camera Received', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', icon: Camera };
      case 'USED_IN_COOKING':
        return { label: 'Used in Cooking', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: Utensils };
      case 'MANUAL_ADJUSTMENT':
        return { label: 'Kitchen Usage', color: '#fb923c', bg: 'rgba(249, 115, 22, 0.15)', icon: ArrowUpRight };
      case 'WASTE':
        return { label: 'Waste Record', color: '#f87171', bg: 'rgba(239, 68, 68, 0.15)', icon: Trash2 };
      case 'CORRECTION':
        return { label: 'Stock Correction', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)', icon: RefreshCw };
    }
  };

  const filteredTransactions = state.transactions.filter((tx) => {
    const matchesSearch =
      tx.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.reason && tx.reason.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'ALL' || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--primary-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <History size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Inventory Activity History
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Real-time audit log of stock entries, usage, cooking deductions & waste
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Search size={16} color="var(--text-dim)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by item or staff..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.82rem',
                width: '180px'
              }}
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            style={{
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: 600,
              outline: 'none'
            }}
          >
            <option value="ALL">All Activity Types</option>
            <option value="RECEIVED">Received Deliveries</option>
            <option value="CAMERA_RECEIVED">Camera Scans</option>
            <option value="USED_IN_COOKING">Used in Cooking</option>
            <option value="MANUAL_ADJUSTMENT">Kitchen Usage</option>
            <option value="WASTE">Waste Records</option>
            <option value="CORRECTION">Stock Corrections</option>
          </select>
        </div>
      </div>

      {/* Transactions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => {
            const badge = getTxBadge(tx.type);
            const Icon = badge.icon;
            const isNegative = tx.type === 'USED_IN_COOKING' || tx.type === 'MANUAL_ADJUSTMENT' || tx.type === 'WASTE';
            const dateStr = new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date(tx.createdAt).toLocaleDateString();

            return (
              <div
                key={tx.id}
                style={{
                  padding: '14px 18px',
                  borderRadius: '16px',
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '10px',
                      background: badge.bg,
                      color: badge.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{tx.itemName}</strong>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '8px',
                          color: badge.color,
                          background: badge.bg
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span>{tx.reason}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} color="var(--primary-cyan)" /> {tx.createdBy}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: isNegative ? 'var(--accent-rose)' : '#34d399'
                    }}
                  >
                    {isNegative ? '-' : '+'}{tx.quantity} {tx.unit}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginTop: '2px' }}>
                    <Calendar size={11} /> {dateStr}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No inventory activity history found matching search/filter.
          </div>
        )}
      </div>
    </div>
  );
};
