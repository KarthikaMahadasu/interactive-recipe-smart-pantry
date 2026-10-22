import React from 'react';
import { ArrowLeft, ChefHat, Clock, Award, Flame, Wrench, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../../../types/recipe';
import { useKitchenState } from '../../../state/KitchenContext';

interface CookingHeaderProps {
  recipe: Recipe | null;
  onRecipeChange: (recipe: Recipe) => void;
  onAdjustServings?: (newServings: number) => void;
}

export const CookingHeader: React.FC<CookingHeaderProps> = ({ recipe, onRecipeChange, onAdjustServings }) => {
  const navigate = useNavigate();
  const { state } = useKitchenState();

  const getCategoryColor = (cat?: string) => {
    switch (cat) {
      case 'cake':
      case 'cupcake':
      case 'baking':
      case 'Cakes & Baking':
        return { bg: '#fdf4ff', text: '#c026d3', border: '#f5d0fe' };
      case 'chocolate':
      case 'Chocolate & Confectionery':
        return { bg: '#fff7ed', text: '#78350f', border: '#ffedd5' };
      case 'curry':
      case 'Main Course':
      case 'Indian Curries':
        return { bg: '#fff7ed', text: '#ea580c', border: '#ffedd5' };
      case 'pasta':
      case 'Pasta & Noodles':
        return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'chilled_dessert':
      case 'Puddings & Chilled Desserts':
        return { bg: '#f0fdfa', text: '#0d9488', border: '#ccfbf1' };
      default:
        return { bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
    }
  };

  const catStyle = getCategoryColor(recipe?.cookingCategory || recipe?.category);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Interactive AI Cooking Studio
            </span>
            {recipe && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 10px',
                  borderRadius: '12px',
                  background: catStyle.bg,
                  color: catStyle.text,
                  border: `1px solid ${catStyle.border}`
                }}
              >
                {recipe.category}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.6rem', color: '#0f172a', fontWeight: 800 }}>
            {recipe ? recipe.title : 'Interactive Cooking Studio'}
          </h1>
        </div>
      </div>

      {/* Recipe Dropdown Selector & Servings Scaler */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {recipe && onAdjustServings && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '14px',
              background: '#fff7ed',
              border: '1px solid #ffedd5'
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#9a3412', marginRight: '4px' }}>Servings:</span>
            <button
              onClick={() => onAdjustServings(Math.max(1, recipe.servings - 1))}
              disabled={recipe.servings <= 1}
              style={{
                width: 26,
                height: 26,
                borderRadius: '8px',
                border: '1px solid #fed7aa',
                background: '#ffffff',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: recipe.servings <= 1 ? 'not-allowed' : 'pointer',
                opacity: recipe.servings <= 1 ? 0.5 : 1
              }}
              title="Decrease Servings"
            >
              <Minus size={14} />
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', minWidth: '22px', textAlign: 'center' }}>
              {recipe.servings}
            </span>
            <button
              onClick={() => onAdjustServings(recipe.servings + 1)}
              style={{
                width: 26,
                height: 26,
                borderRadius: '8px',
                border: '1px solid #fed7aa',
                background: '#ffffff',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Increase Servings"
            >
              <Plus size={14} />
            </button>
          </div>
        )}

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
            gap: '16px',
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
          {recipe.temperature && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#dc2626', fontWeight: 600 }}>
              <Flame size={15} color="#dc2626" /> Temp: {recipe.temperature}
            </span>
          )}
          {recipe.equipment && recipe.equipment.length > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
              <Wrench size={14} color="#64748b" /> Tools: {recipe.equipment.slice(0, 3).join(', ')}{recipe.equipment.length > 3 ? '...' : ''}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', fontWeight: 600, color: '#d97706' }}>
            <Award size={15} color="#d97706" /> {recipe.ingredients.length} Required Ingredients (Scaled for {recipe.servings})
          </span>
        </div>
      )}
    </div>
  );
};
