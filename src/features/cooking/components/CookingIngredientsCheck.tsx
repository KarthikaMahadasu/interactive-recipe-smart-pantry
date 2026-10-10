import React, { useState } from 'react';
import { CheckCircle2, XCircle, ShoppingBag, AlertTriangle, Sparkles, Check } from 'lucide-react';
import type { CookingValidationSummary } from '../services/cookingService';
import { useKitchenState } from '../../../state/KitchenContext';
import { useNavigate } from 'react-router-dom';

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
  const { addGroceryItem } = useKitchenState();
  const navigate = useNavigate();
  const [addedGrocery, setAddedGrocery] = useState(false);

  if (!summary) return null;

  const { canCook, validationDetails, missingCount, insufficientCount } = summary;

  const handleAddMissingToGrocery = () => {
    const missingItems = validationDetails.filter((d) => !d.isAvailable || d.isInsufficient);

    missingItems.forEach((d) => {
      const missingQty = !d.isAvailable
        ? d.requiredAmount
        : Math.max(1, d.requiredAmount - d.availableAmount);

      addGroceryItem({
        id: `g_cook_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: d.ingredient.name,
        quantity: missingQty,
        unit: d.ingredient.unit,
        reason: 'Missing ingredient for active recipe',
        priority: 'HIGH',
        source: 'RECIPE_MISSING',
        status: 'NEEDED',
        createdAt: new Date().toISOString()
      });
    });

    setAddedGrocery(true);
    setTimeout(() => {
      navigate('/grocery');
    }, 1000);
  };

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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
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
                <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {req.name}
                  {req.optional && (
                    <span style={{ fontSize: '0.7rem', color: '#64748b', background: '#e2e8f0', padding: '1px 6px', borderRadius: '8px' }}>
                      Optional
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '2px' }}>
                  Required: <strong>{req.amount} {req.unit}</strong> | Stock: <strong style={{ color: isOK ? '#16a34a' : '#dc2626' }}>{detail.availableAmount} {detail.availableUnit}</strong>
                </div>
                {req.note && (
                  <div style={{ fontSize: '0.72rem', color: '#d97706', fontStyle: 'italic', marginTop: '2px' }}>
                    Note: {req.note}
                  </div>
                )}
              </div>

              {isOK ? (
                <CheckCircle2 size={20} color="#16a34a" style={{ flexShrink: 0 }} />
              ) : (
                <XCircle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Missing Warning Banner & Action Button */}
      {!canCook && (
        <div
          style={{
            padding: '14px 16px',
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
            <span>Some ingredients are missing or short in current restaurant inventory.</span>
          </div>

          <button
            onClick={handleAddMissingToGrocery}
            disabled={addedGrocery}
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              background: addedGrocery ? '#dcfce7' : '#fef3c7',
              border: `1px solid ${addedGrocery ? '#86efac' : '#fde68a'}`,
              color: addedGrocery ? '#15803d' : '#b45309',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: addedGrocery ? 'default' : 'pointer'
            }}
          >
            {addedGrocery ? <Check size={14} /> : <ShoppingBag size={14} />}
            {addedGrocery ? 'Added to Grocery List!' : 'Add Missing to Grocery List'}
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
