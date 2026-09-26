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
              background: 'rgba(30, 41, 59, 0.6)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-violet)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Module 3 &bull; AI Recipe Discovery
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Dynamic Pantry-Matched Recipes</h1>
          </div>
        </div>

        {/* Small Ambient AI Brain Orb Visual */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ transform: 'scale(0.55)', margin: '-20px -30px' }}>
            <AIBrainOrb state={state.aiState} size={110} showStatusLabel={false} />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-cyan)', background: 'rgba(6, 182, 212, 0.12)', padding: '4px 12px', borderRadius: '14px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
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
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Search size={18} color="var(--text-dim)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes by title, ingredient (rice, paneer...), or tags..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-main)',
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
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>Min Match:</span>
            {[0, 50, 75].map((pct) => (
              <button
                key={pct}
                onClick={() => setMinMatchFilter(pct)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: minMatchFilter === pct ? 'var(--primary-cyan)' : 'transparent',
                  color: minMatchFilter === pct ? '#000' : 'var(--text-muted)',
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
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, alignSelf: 'center' }}>Category:</span>
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  border: categoryFilter === cat ? '1px solid var(--accent-violet)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: categoryFilter === cat ? 'rgba(139, 92, 246, 0.2)' : 'rgba(30, 41, 59, 0.4)',
                  color: categoryFilter === cat ? '#c084fc' : 'var(--text-muted)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, alignSelf: 'center' }}>Difficulty:</span>
            {DIFFICULTY_OPTIONS.map((dif) => (
              <button
                key={dif}
                onClick={() => setDifficultyFilter(dif)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  border: difficultyFilter === dif ? '1px solid var(--primary-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: difficultyFilter === dif ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                  color: difficultyFilter === dif ? 'var(--primary-cyan)' : 'var(--text-muted)',
                  fontSize: '0.76rem',
                  fontWeight: 600,
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
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
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
                background: 'rgba(139, 92, 246, 0.15)',
                color: 'var(--accent-violet)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Utensils size={28} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
              No matching recipes found.
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '440px' }}>
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
                  background: 'linear-gradient(135deg, var(--primary-cyan) 0%, #0284c7 100%)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.88rem',
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
