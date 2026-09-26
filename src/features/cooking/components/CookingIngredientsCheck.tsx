import React from 'react';
import { CheckCircle2, XCircle, ShoppingBag, AlertTriangle, Sparkles } from 'lucide-react';
import type { CookingValidationSummary } from '../services/cookingService';

interface CookingIngredientsCheckProps {
  summary: CookingValidationSummary | null;
  onStartCooking: () => void;
  isCookingStarted: boolean;
}

export const CookingIngredientsCheck: React.FC<CookingIngredientsCheckProps> = ({
  summary,
  onStartCooking,
  isCookingStarted
}) => {
  if (!summary) return null;

  const { canCook, validationDetails, missingCount, insufficientCount } = summary;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--primary-cyan)" /> Recipe Ingredient Availability Checklist
        </h3>

        {/* Validation Status Badge */}
        {canCook ? (
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 14px', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
            ✓ Ready to Cook (100% In Stock)
          </span>
        ) : (
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f43f5e', background: 'rgba(244, 63, 94, 0.15)', padding: '4px 14px', borderRadius: '14px', border: '1px solid rgba(244, 63, 94, 0.4)' }}>
            ✕ Missing Ingredients ({missingCount + insufficientCount})
          </span>
        )}
      </div>

      {/* Ingredient Items List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
        {validationDetails.map((detail, idx) => {
          const req = detail.ingredient;
          const isOK = detail.isAvailable && !detail.isInsufficient;

          return (
            <div
              key={idx}
              style={{
                padding: '12px 14px',
                borderRadius: '14px',
                background: isOK ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
                border: `1px solid ${isOK ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{req.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                  Required: {req.amount} {req.unit} | Available: {detail.availableAmount} {req.unit}
                </div>
              </div>

              {isOK ? (
                <CheckCircle2 size={18} color="#10b981" />
              ) : (
                <XCircle size={18} color="#f43f5e" />
              )}
            </div>
          );
        })}
      </div>

      {/* Missing Warning Banner & Action Button */}
      {!canCook && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--accent-amber)' }}>
            <AlertTriangle size={18} />
            <span>Some ingredients are missing or have insufficient stock.</span>
          </div>

          <button
            onClick={() => alert('Grocery list integration point (Module 6). Missing items recorded.')}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: 'var(--accent-amber)',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ShoppingBag size={14} /> Add Missing to Grocery (Module 6)
          </button>
        </div>
      )}

      {/* Start Cooking Trigger Button */}
      {!isCookingStarted && (
        <button
          onClick={onStartCooking}
          style={{
            marginTop: '4px',
            padding: '14px',
            borderRadius: '16px',
            background: canCook
              ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#000000',
            fontWeight: 800,
            fontSize: '0.98rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.2s ease'
          }}
        >
          {canCook ? '🍳 All Ingredients Ready — Start Guided Cooking' : '⚠️ Proceed to Guided Cooking (With Available Ingredients)'}
        </button>
      )}
    </div>
  );
};
