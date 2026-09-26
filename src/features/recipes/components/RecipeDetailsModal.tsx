import React from 'react';
import { X, CheckCircle2, Circle, Clock, ChefHat, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import type { RecipeMatchResult } from '../../../services/recipes/recipeMatchingService';

interface RecipeDetailsModalProps {
  matchResult: RecipeMatchResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({ matchResult, isOpen, onClose }) => {
  if (!isOpen || !matchResult) return null;

  const { recipe, availableIngredients, missingIngredients, matchPercentage } = matchResult;

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
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          borderRadius: '24px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1.5px solid rgba(6, 182, 212, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {/* Header Title & Match Badge */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--primary-cyan)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  padding: '2px 10px',
                  borderRadius: '12px'
                }}
              >
                {recipe.category} &bull; {recipe.cuisine}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: matchPercentage >= 80 ? '#10b981' : matchPercentage >= 50 ? '#f59e0b' : '#06b6d4',
                  background: matchPercentage >= 80 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                  padding: '2px 10px',
                  borderRadius: '12px'
                }}
              >
                <Sparkles size={12} /> {matchPercentage}% Pantry Match
              </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '6px' }}>
              {recipe.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', color: 'var(--text-dim)', padding: 4, cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
          {recipe.description}
        </p>

        {/* Recipe Meta Info Bar */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            padding: '12px 16px',
            borderRadius: '14px',
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.82rem',
            color: 'var(--text-main)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="var(--primary-cyan)" /> Prep: {recipe.prepTime}m | Cook: {recipe.cookTime}m
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ChefHat size={16} color="var(--accent-violet)" /> Difficulty: {recipe.difficulty}
          </span>
          {recipe.nutrition && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              {recipe.nutrition.calories} kcal | {recipe.nutrition.protein}g Protein
            </span>
          )}
        </div>

        {/* Requirement 19 & 20: Pantry Ingredient Comparison Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {/* AVAILABLE INGREDIENTS */}
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <h4 style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} /> AVAILABLE IN PANTRY ({availableIngredients.length})
            </h4>

            {availableIngredients.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {availableIngredients.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.6)'
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>✓ {item.recipeIngredient.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#34d399' }}>
                      {item.pantryItem ? `${item.pantryItem.quantity} ${item.pantryItem.unit} in stock` : 'Available'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                No required ingredients found in your pantry.
              </div>
            )}
          </div>

          {/* MISSING INGREDIENTS */}
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <h4 style={{ fontSize: '0.9rem', color: '#fda4af', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Circle size={16} /> MISSING INGREDIENTS ({missingIngredients.length})
            </h4>

            {missingIngredients.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {missingIngredients.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-main)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.6)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>○ {item.recipeIngredient.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#fda4af' }}>
                        Required: {item.recipeIngredient.amount} {item.recipeIngredient.unit}
                      </span>
                    </div>

                    {/* Requirement 21: Data-driven substitution hint */}
                    {item.suggestedSubstitution && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <RefreshCw size={11} /> Possible substitution: <strong>{item.suggestedSubstitution}</strong> (in pantry)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={16} /> You have 100% of required ingredients to prepare this dish!
              </div>
            )}
          </div>
        </div>

        {/* Step by Step Cooking Instructions */}
        <div>
          <h4 style={{ fontSize: '1.0rem', color: 'var(--text-main)', marginBottom: '10px' }}>
            Preparation Instructions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recipe.instructions.map((step) => (
              <div
                key={step.step}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'rgba(6, 182, 212, 0.2)',
                    color: 'var(--primary-cyan)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {step.step}
                </span>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
                  {step.text}
                  {step.tip && (
                    <div style={{ marginTop: '4px', fontSize: '0.76rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> Tip: {step.tip}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close button */}
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 24px',
              borderRadius: '14px',
              background: 'var(--primary-cyan)',
              color: '#000000',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Done Inspecting Recipe
          </button>
        </div>
      </div>
    </div>
  );
};
