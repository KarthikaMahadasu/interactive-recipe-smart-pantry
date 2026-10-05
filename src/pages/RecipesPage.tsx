import React, { useState } from 'react';
import { ArrowLeft, Search, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRecipeMatching } from '../hooks/useRecipeMatching';
import { RecipeCard } from '../features/recipes/components/RecipeCard';
import { RecipeDetailsModal } from '../features/recipes/components/RecipeDetailsModal';
import { AIBrainOrb } from '../features/ai-brain/AIBrainOrb';
import { useKitchenState } from '../state/KitchenContext';

const CATEGORY_OPTIONS = ['all', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
const DIFFICULTY_OPTIONS = ['all', 'Easy', 'Medium', 'Hard'];

export const RecipesPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useKitchenState();

  const {
    filteredResults,
    selectedMatchResult,
    inspectRecipe,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    difficultyFilter,
    setDifficultyFilter,
    minMatchFilter,
    setMinMatchFilter,
    pantryCount
  } = useRecipeMatching();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRecipeClick = (recipeId: string) => {
    inspectRecipe(recipeId);
    setIsModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
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
            onClick={() => navigate('/')}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#f1f5f9',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              border: '1px solid #e2e8f0'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Module 3 &bull; AI Recipe Discovery
            </div>
            <h1 style={{ fontSize: '1.6rem', color: '#ea580c', fontWeight: 800 }}>Dynamic Pantry-Matched Recipes</h1>
          </div>
        </div>

        {/* Small Ambient AI Brain Orb Visual */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ transform: 'scale(0.55)', margin: '-20px -30px' }}>
            <AIBrainOrb state={state.aiState} size={110} showStatusLabel={false} />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ea580c', background: '#fff7ed', padding: '6px 14px', borderRadius: '14px', border: '1.5px solid #ea580c' }}>
            Syncing with {pantryCount} Pantry Items
          </span>
        </div>
      </div>

      {/* Search & Matching Filter Controls */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {/* Top Search Bar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              flex: 1,
              minWidth: '240px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              borderRadius: '14px',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1'
            }}
          >
            <Search size={18} color="#ea580c" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes by title, ingredient (rice, paneer...), or tags..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#0f172a',
                fontSize: '0.9rem',
                width: '100%'
              }}
            />
          </div>

          {/* Min Match Percentage Filter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 12px',
              borderRadius: '14px',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1'
            }}
          >
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Min Match:</span>
            {[0, 50, 75].map((pct) => (
              <button
                key={pct}
                onClick={() => setMinMatchFilter(pct)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: minMatchFilter === pct ? '#ea580c' : 'transparent',
                  color: minMatchFilter === pct ? '#ffffff' : '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {pct === 0 ? 'All' : `${pct}%+`}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Difficulty Pills */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, alignSelf: 'center' }}>Category:</span>
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  border: categoryFilter === cat ? '1.5px solid #ea580c' : '1px solid #cbd5e1',
                  background: categoryFilter === cat ? '#fff7ed' : '#ffffff',
                  color: categoryFilter === cat ? '#ea580c' : '#64748b',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, alignSelf: 'center' }}>Difficulty:</span>
            {DIFFICULTY_OPTIONS.map((dif) => (
              <button
                key={dif}
                onClick={() => setDifficultyFilter(dif)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  border: difficultyFilter === dif ? '1.5px solid #ea580c' : '1px solid #cbd5e1',
                  background: difficultyFilter === dif ? '#fff7ed' : '#ffffff',
                  color: difficultyFilter === dif ? '#ea580c' : '#64748b',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {dif === 'all' ? 'All' : dif}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recipe Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '20px'
        }}
      >
        {filteredResults.length > 0 ? (
          filteredResults.map((matchResult) => (
            <RecipeCard
              key={matchResult.recipe.id}
              matchResult={matchResult}
              onSelect={handleRecipeClick}
            />
          ))
        ) : (
          <div
            className="glass-panel"
            style={{
              gridColumn: '1 / -1',
              padding: '48px 24px',
              textAlign: 'center',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: '#fff7ed',
                color: '#ea580c',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Utensils size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>
              No matching recipes found.
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '440px' }}>
              {pantryCount === 0
                ? 'Your pantry is currently empty. Add ingredients to your Smart Pantry to see automated recipe match calculations.'
                : 'Try lowering the minimum match threshold or clearing search filters.'}
            </p>

            {pantryCount === 0 && (
              <button
                onClick={() => navigate('/pantry')}
                style={{
                  marginTop: '8px',
                  padding: '10px 20px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Go to Pantry to Add Ingredients
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recipe Details Modal */}
      <RecipeDetailsModal
        matchResult={selectedMatchResult}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
