import React from 'react';
import { ArrowLeft, ChefHat, Clock, Utensils, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../../../types/recipe';
import { useKitchenState } from '../../../state/KitchenContext';

interface CookingHeaderProps {
  recipe: Recipe | null;
  onRecipeChange: (recipe: Recipe) => void;
}

export const CookingHeader: React.FC<CookingHeaderProps> = ({ recipe, onRecipeChange }) => {
  const navigate = useNavigate();
  const { state } = useKitchenState();

  return (
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
          onClick={() => navigate('/recipes')}
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
          title="Back to Recipes"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Module 4 &bull; Interactive AI Cooking Studio
          </div>
          <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>
            {recipe ? recipe.title : 'Interactive Cooking Studio'}
          </h1>
        </div>
      </div>

      {/* Recipe Dropdown Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <select
          value={recipe?.id || ''}
          onChange={(e) => {
            const found = state.recipes.find((r) => r.id === e.target.value);
            if (found) onRecipeChange(found);
          }}
          style={{
            padding: '8px 14px',
            borderRadius: '14px',
            background: 'rgba(30, 41, 59, 0.9)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: 'var(--text-main)',
            fontSize: '0.88rem',
            fontWeight: 600,
            outline: 'none'
          }}
        >
          {state.recipes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>

      {recipe && (
        <div
          style={{
            width: '100%',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            fontSize: '0.82rem',
            color: 'var(--text-dim)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} color="var(--primary-cyan)" /> Total: {recipe.prepTime + recipe.cookTime} mins (Prep {recipe.prepTime}m + Cook {recipe.cookTime}m)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ChefHat size={15} color="var(--accent-violet)" /> Difficulty: {recipe.difficulty}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Utensils size={15} color="var(--accent-emerald)" /> Servings: {recipe.servings}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <Award size={15} color="var(--accent-amber)" /> {recipe.ingredients.length} Required Ingredients
          </span>
        </div>
      )}
    </div>
  );
};
