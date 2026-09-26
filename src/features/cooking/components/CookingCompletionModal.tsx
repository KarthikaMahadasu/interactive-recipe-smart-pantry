import React from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import type { Recipe } from '../../../types/recipe';
import type { Ingredient } from '../../../types/ingredient';
import { useNavigate } from 'react-router-dom';

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

  if (!isOpen || !recipe) return null;

  // Calculate deduction details
  const deductionList = recipe.ingredients.map((req) => {
    const reqNameLower = req.name.toLowerCase().trim();
    const pantryItem = pantry.find(
      (p) => p.name.toLowerCase().trim() === reqNameLower || p.name.toLowerCase().includes(reqNameLower)
    );

    const currentQty = pantryItem ? pantryItem.quantity : 0;
    const isInsufficient = currentQty < req.amount;
    const remainingQty = Math.max(0, currentQty - req.amount);

    return {
      name: req.name,
      required: req.amount,
      unit: req.unit,
      currentQty,
      remainingQty,
      isInsufficient
    };
  });

  const hasInsufficient = deductionList.some((d) => d.isInsufficient);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(8, 12, 20, 0.85)',
        backdropFilter: 'blur(10px)',
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
          maxWidth: '520px',
          padding: '28px',
          borderRadius: '24px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={22} color="#10b981" /> Complete Cooking Session?
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', color: 'var(--text-dim)', padding: 4, cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          You are completing <strong>{recipe.title}</strong>. Confirming will deduct the actual recipe ingredients from your live Smart Pantry stock.
        </p>

        {/* Deductions Breakdown Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Pantry Ingredient Deductions:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
            {deductionList.map((d, idx) => (
              <div
                key={idx}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.5)',
                  border: `1px solid ${d.isInsufficient ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{d.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginLeft: '8px' }}>
                    -{d.required} {d.unit}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'right' }}>
                  <span>{d.currentQty} {d.unit}</span> &rarr; <strong style={{ color: d.isInsufficient ? '#f43f5e' : '#34d399' }}>{d.remainingQty} {d.unit}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {hasInsufficient && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--accent-amber)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertTriangle size={16} />
            <span>Some ingredients had less stock than required. Quantities will be safely set to 0 (no negative values).</span>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              background: 'rgba(30, 41, 59, 0.6)',
              color: 'var(--text-muted)',
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
              }, 1400);
            }}
            style={{
              flex: 2,
              padding: '12px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.9rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)'
            }}
          >
            Confirm & Deduct Stock <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
