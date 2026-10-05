import React from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight, ShoppingBag } from 'lucide-react';
import type { Recipe } from '../../../types/recipe';
import type { Ingredient } from '../../../types/ingredient';
import { useNavigate } from 'react-router-dom';
import { useKitchenState } from '../../../state/KitchenContext';

interface CookingCompletionModalProps {
  recipe: Recipe | null;
  pantry: Ingredient[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CookingCompletionModal: React.FC<CookingCompletionModalProps> = ({
  recipe,
  pantry,
  isOpen,
  onClose,
  onConfirm
}) => {
  const navigate = useNavigate();
  const { addGroceryItem } = useKitchenState();

  if (!isOpen || !recipe) return null;

  // Calculate deduction details
  const deductionList = recipe.ingredients.map((req) => {
    const reqNameLower = req.name.toLowerCase().trim();
    const pantryItem = pantry.find(
      (p) => p.name.toLowerCase().trim() === reqNameLower || p.name.toLowerCase().includes(reqNameLower)
    );

    const currentQty = pantryItem ? pantryItem.quantity : 0;
    const isInsufficient = currentQty < req.amount;
    const missingAmount = Math.max(0, req.amount - currentQty);
    const remainingQty = Math.max(0, currentQty - req.amount);

    return {
      name: req.name,
      required: req.amount,
      unit: req.unit,
      currentQty,
      missingAmount,
      remainingQty,
      isInsufficient
    };
  });

  const missingItems = deductionList.filter((d) => d.isInsufficient);
  const hasInsufficient = missingItems.length > 0;

  const handleAddMissingToGrocery = () => {
    missingItems.forEach((m) => {
      addGroceryItem({
        id: `g_cook_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: m.name,
        quantity: m.missingAmount > 0 ? m.missingAmount : 1,
        unit: m.unit,
        reason: `Missing requirement for cooking "${recipe.title}"`,
        priority: 'HIGH',
        source: 'RECIPE_MISSING',
        status: 'NEEDED',
        createdAt: new Date().toISOString()
      });
    });
    navigate('/grocery');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '540px',
          padding: '28px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1px solid #fed7aa',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.3rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {hasInsufficient ? (
              <>
                <AlertTriangle size={22} color="#d97706" /> Insufficient Stock Alert
              </>
            ) : (
              <>
                <CheckCircle2 size={22} color="#16a34a" /> Confirm Cooking Completion
              </>
            )}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#64748b', padding: 4, cursor: 'pointer', border: 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.45 }}>
          You are finishing <strong style={{ color: '#ea580c' }}>{recipe.title}</strong>. Confirming will deduct actual ingredients from your live restaurant inventory and record usage activity.
        </p>

        {/* Insufficient Stock Warning Card */}
        {hasInsufficient && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '16px',
              background: '#fffbe5',
              border: '1px solid #fde68a',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} color="#d97706" /> Missing Ingredients Identified ({missingItems.length} items short)
            </div>
            <div style={{ fontSize: '0.78rem', color: '#78350f', lineHeight: 1.4 }}>
              {missingItems.map((m) => (
                <div key={m.name}>
                  &bull; <strong>{m.name}</strong>: Required {m.required} {m.unit}, Available {m.currentQty} {m.unit} (Short by {m.missingAmount} {m.unit})
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deductions Breakdown Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
            Pantry Ingredient Deductions:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
            {deductionList.map((d, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: `1px solid ${d.isInsufficient ? '#fde68a' : '#e2e8f0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{d.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#dc2626', marginLeft: '8px', fontWeight: 600 }}>
                    -{d.required} {d.unit}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#64748b', textAlign: 'right' }}>
                  <span>{d.currentQty} {d.unit}</span> &rarr; <strong style={{ color: d.isInsufficient ? '#d97706' : '#16a34a' }}>{d.remainingQty} {d.unit}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
          {hasInsufficient && (
            <button
              onClick={handleAddMissingToGrocery}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '14px',
                background: '#faf5ff',
                border: '1px solid #e9d5ff',
                color: '#9333ea',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <ShoppingBag size={16} /> Add Missing Ingredients to Grocery List
            </button>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '14px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#475569',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onConfirm();
                setTimeout(() => {
                  navigate('/pantry');
                }, 1200);
              }}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '14px',
                background: hasInsufficient ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)' : 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(234, 88, 12, 0.25)'
              }}
            >
              Confirm & Deduct Stock <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
