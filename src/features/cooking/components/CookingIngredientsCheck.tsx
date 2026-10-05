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
        background: '#ffffff',
        border: '1px solid #fed7aa',
        boxShadow: '0 4px 20px rgba(234, 88, 12, 0.06)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#ea580c" /> Recipe Ingredient Availability Checklist
        </h3>

        {/* Validation Status Badge */}
        {canCook ? (
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#16a34a', background: '#f0fdf4', padding: '4px 14px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
            ✓ Ready to Cook (100% In Stock)
          </span>
        ) : (
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#dc2626', background: '#fef2f2', padding: '4px 14px', borderRadius: '14px', border: '1px solid #fecaca' }}>
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
                background: isOK ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${isOK ? '#bbf7d0' : '#fecaca'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{req.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  Required: {req.amount} {req.unit} | Available: {detail.availableAmount} {req.unit}
                </div>
              </div>

              {isOK ? (
                <CheckCircle2 size={18} color="#16a34a" />
              ) : (
                <XCircle size={18} color="#dc2626" />
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
            background: '#fffbe5',
            border: '1px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#92400e', fontWeight: 600 }}>
            <AlertTriangle size={18} color="#d97706" />
            <span>Some ingredients are missing or have insufficient stock.</span>
          </div>

          <button
            onClick={() => alert('Grocery list integration point (Module 6). Missing items recorded.')}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#b45309',
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
              ? 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)'
              : 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.98rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(234, 88, 12, 0.25)',
            transition: 'transform 0.2s ease'
          }}
        >
          {canCook ? '🍳 All Ingredients Ready — Start Guided Cooking' : '⚠️ Proceed to Guided Cooking (With Available Ingredients)'}
        </button>
      )}
    </div>
  );
};
