import React from 'react';
import type { RecipeMatchResult } from '../../../services/recipes/recipeMatchingService';
import { Clock, ChefHat, CheckCircle2, Circle, Sparkles, Utensils } from 'lucide-react';

interface RecipeCardProps {
  matchResult: RecipeMatchResult;
  onSelect: (recipeId: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ matchResult, onSelect }) => {
  const { recipe, availableIngredients, missingIngredients, matchPercentage } = matchResult;

  // Determine pill badge styling based on match percentage
  let matchColor = '#06b6d4';
  let matchBg = 'rgba(6, 182, 212, 0.15)';
  let matchBorder = 'rgba(6, 182, 212, 0.4)';

  if (matchPercentage >= 80) {
    matchColor = '#10b981';
    matchBg = 'rgba(16, 185, 129, 0.15)';
    matchBorder = 'rgba(16, 185, 129, 0.4)';
  } else if (matchPercentage >= 50) {
    matchColor = '#f59e0b';
    matchBg = 'rgba(245, 158, 11, 0.15)';
    matchBorder = 'rgba(245, 158, 11, 0.4)';
  }

  const totalIngredients = recipe.ingredients.length;

  return (
    <div
      onClick={() => onSelect(recipe.id)}
      className="glass-panel glass-panel-hover"
      style={{
        padding: '20px',
        borderRadius: '20px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        position: 'relative',
        transition: 'transform 0.3s ease, border-color 0.3s ease'
      }}
    >
      {/* Top Banner: Category & Match Pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <span
          style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Utensils size={13} color="var(--primary-cyan)" /> {recipe.category} &bull; {recipe.cuisine}
        </span>

        {/* Dynamic Match Percentage Pill */}
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            padding: '3px 10px',
            borderRadius: '12px',
            color: matchColor,
            background: matchBg,
            border: `1px solid ${matchBorder}`,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Sparkles size={12} /> {matchPercentage}% Match
        </div>
      </div>

      {/* Recipe Title & Description */}
      <div>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700, lineHeight: 1.3 }}>
          {recipe.title}
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {recipe.description}
        </p>
      </div>

      {/* Available vs Missing Ingredient Counts */}
      <div
        style={{
          padding: '10px 12px',
          borderRadius: '12px',
          background: 'rgba(8, 12, 20, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
          <span style={{ color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} /> {availableIngredients.length} / {totalIngredients} Available
          </span>
          <span style={{ color: missingIngredients.length > 0 ? '#fda4af' : 'var(--text-dim)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Circle size={12} /> {missingIngredients.length} Missing
          </span>
        </div>
      </div>

      {/* Footer Details & Action Button */}
      <div style={{ marginTop: 'auto', paddingTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} color="var(--primary-cyan)" /> {recipe.prepTime + recipe.cookTime}m
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ChefHat size={13} color="var(--accent-violet)" /> {recipe.difficulty}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(recipe.id);
          }}
          style={{
            padding: '6px 14px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            color: 'var(--primary-cyan)',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer'
          }}
        >
          View Recipe Details &rarr;
        </button>
      </div>
    </div>
  );
};
