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
        gap: '16px',
        background: '#ffffff',
        border: '1px solid #fed7aa',
        boxShadow: '0 4px 20px rgba(234, 88, 12, 0.06)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => navigate('/recipes')}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: '#fff7ed',
            border: '1px solid #ffedd5',
            color: '#ea580c',
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
          <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Module 4 &bull; Interactive AI Cooking Studio
          </div>
          <h1 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: 800 }}>
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
            background: '#ffffff',
            border: '1px solid #fed7aa',
            color: '#0f172a',
            fontSize: '0.88rem',
            fontWeight: 600,
            outline: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
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
            borderTop: '1px solid #ffedd5',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            fontSize: '0.82rem',
            color: '#64748b'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={15} color="#ea580c" /> Total: {recipe.prepTime + recipe.cookTime} mins (Prep {recipe.prepTime}m + Cook {recipe.cookTime}m)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ChefHat size={15} color="#ea580c" /> Difficulty: {recipe.difficulty}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Utensils size={15} color="#ea580c" /> Servings: {recipe.servings}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', fontWeight: 600, color: '#d97706' }}>
            <Award size={15} color="#d97706" /> {recipe.ingredients.length} Required Ingredients
          </span>
        </div>
      )}
    </div>
  );
};
