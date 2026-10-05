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
        background: 'rgba(15, 23, 42, 0.4)',
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
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
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
                  color: '#ea580c',
                  background: '#fff7ed',
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
                  color: matchPercentage >= 80 ? '#047857' : matchPercentage >= 50 ? '#b45309' : '#ea580c',
                  background: matchPercentage >= 80 ? '#ecfdf5' : matchPercentage >= 50 ? '#fffbe8' : '#fff7ed',
                  border: `1px solid ${matchPercentage >= 80 ? '#a7f3d0' : matchPercentage >= 50 ? '#fde68a' : '#ffedd5'}`,
                  padding: '2px 10px',
                  borderRadius: '12px'
                }}
              >
                <Sparkles size={12} /> {matchPercentage}% Pantry Match
              </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', color: '#ea580c', fontWeight: 800, marginTop: '6px' }}>
              {recipe.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', color: '#64748b', border: 'none', padding: 4, cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.45 }}>
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
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            fontSize: '0.82rem',
            color: '#0f172a',
            fontWeight: 600
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} color="#ea580c" /> Prep: {recipe.prepTime}m | Cook: {recipe.cookTime}m
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ChefHat size={16} color="#ea580c" /> Difficulty: {recipe.difficulty}
          </span>
          {recipe.nutrition && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', color: '#047857', fontWeight: 700 }}>
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
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <h4 style={{ fontSize: '0.9rem', color: '#047857', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} /> AVAILABLE IN PANTRY ({availableIngredients.length})
            </h4>

            {availableIngredients.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {availableIngredients.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: '0.82rem',
                      color: '#0f172a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #d1fae5'
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>✓ {item.recipeIngredient.name}</span>
                    <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>
                      {item.pantryItem ? `${item.pantryItem.quantity} ${item.pantryItem.unit} in stock` : 'Available'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                No required ingredients found in your pantry.
              </div>
            )}
          </div>

          {/* MISSING INGREDIENTS */}
          <div
            style={{
              padding: '16px',
              borderRadius: '16px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <h4 style={{ fontSize: '0.9rem', color: '#b91c1c', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Circle size={16} /> MISSING INGREDIENTS ({missingIngredients.length})
            </h4>

            {missingIngredients.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {missingIngredients.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      fontSize: '0.82rem',
                      color: '#0f172a',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #fee2e2'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700 }}>○ {item.recipeIngredient.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 700 }}>
                        Required: {item.recipeIngredient.amount} {item.recipeIngredient.unit}
                      </span>
                    </div>

                    {/* Requirement 21: Data-driven substitution hint */}
                    {item.suggestedSubstitution && (
                      <div style={{ fontSize: '0.72rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <RefreshCw size={11} /> Possible substitution: <strong>{item.suggestedSubstitution}</strong> (in pantry)
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={16} /> You have 100% of required ingredients to prepare this dish!
              </div>
            )}
          </div>
        </div>

        {/* Step by Step Cooking Instructions */}
        <div>
          <h4 style={{ fontSize: '1.0rem', color: '#ea580c', fontWeight: 800, marginBottom: '10px' }}>
            Preparation Instructions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recipe.instructions.map((step) => (
              <div
                key={step.step}
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
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
                    background: '#fff7ed',
                    color: '#ea580c',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    border: '1px solid #ffedd5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {step.step}
                </span>
                <div style={{ fontSize: '0.85rem', color: '#0f172a', lineHeight: 1.45 }}>
                  {step.text}
                  {step.tip && (
                    <div style={{ marginTop: '4px', fontSize: '0.76rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
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
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.88rem',
              border: 'none',
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
