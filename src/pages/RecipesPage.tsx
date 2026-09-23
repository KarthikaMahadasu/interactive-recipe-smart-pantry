import React, { useState, useMemo } from 'react';
import { ArrowLeft, Sparkles, Clock, ChefHat, CheckCircle, AlertCircle, Play, Search, X, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKitchenState } from '../state/KitchenContext';
import type { Recipe, RecipeCategory } from '../types/recipe';

export const RecipesPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, addRecipe, startCooking } = useKitchenState();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatchFilter, setSelectedMatchFilter] = useState<'all' | 'ready' | 'almost'>('all');
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');
  const [selectedDiet, setSelectedDiet] = useState<string | 'all'>('all');

  // Modals
  const [viewRecipe, setViewRecipe] = useState<Recipe | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // AI Generator Form
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Filtered recipes list with calculated matches
  const processedRecipes = useMemo(() => {
    const getRecipeMatchInfo = (recipe: Recipe) => {
      if (!recipe.ingredients || recipe.ingredients.length === 0) {
        return { matchPercentage: 100, presentCount: 0, totalCount: 0, missing: [] };
      }

      let presentCount = 0;
      const missing: string[] = [];

      recipe.ingredients.forEach((ing) => {
        const match = state.pantry.find(
          (p) => p.name.toLowerCase().includes(ing.name.toLowerCase()) || ing.name.toLowerCase().includes(p.name.toLowerCase())
        );
        if (match && match.quantity > 0) {
          presentCount++;
        } else if (!ing.optional) {
          missing.push(ing.name);
        }
      });

      const totalCount = recipe.ingredients.length;
      const matchPercentage = Math.round((presentCount / totalCount) * 100);

      return { matchPercentage, presentCount, totalCount, missing };
    };

    return state.recipes.map((rec) => {
      const matchInfo = getRecipeMatchInfo(rec);
      return { ...rec, matchInfo };
    }).filter((rec) => {
      const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || rec.category === selectedCategory;
      const matchesDiet = selectedDiet === 'all' || rec.dietaryTags.some((d) => d.toLowerCase() === selectedDiet.toLowerCase());
      
      const matchesMatchFilter =
        selectedMatchFilter === 'all'
          ? true
          : selectedMatchFilter === 'ready'
          ? rec.matchInfo.matchPercentage === 100
          : rec.matchInfo.missing.length <= 1;

      return matchesSearch && matchesCategory && matchesDiet && matchesMatchFilter;
    });
  }, [state.recipes, state.pantry, searchQuery, selectedCategory, selectedDiet, selectedMatchFilter]);

  // Handle Instant AI Recipe Creation
  const handleGenerateRecipe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    setIsGenerating(true);

    setTimeout(() => {
      const promptLower = customPrompt.toLowerCase();
      const generatedTitle = customPrompt.charAt(0).toUpperCase() + customPrompt.slice(1);

      const colors = [
        'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
        'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
      ];
      const randomGradient = colors[Math.floor(Math.random() * colors.length)];

      const newRecipe: Recipe = {
        id: `rec_ai_${Date.now()}`,
        title: generatedTitle,
        description: `AI-engineered custom recipe inspired by your request for "${customPrompt}". Perfectly balanced with active pantry stock.`,
        prepTime: 12,
        cookTime: 15,
        servings: 2,
        difficulty: 'Medium',
        category: promptLower.includes('smoothie') || promptLower.includes('bowl') ? 'Breakfast' : 'Dinner',
        cuisine: 'Modern Culinary AI',
        dietaryTags: ['AI-Crafted', 'Zero-Waste', 'High-Protein'],
        colorGradient: randomGradient,
        createdAt: new Date().toISOString(),
        ingredients: [
          { name: state.pantry[0]?.name || 'Primary Ingredient', amount: 1, unit: 'pcs' },
          { name: state.pantry[1]?.name || 'Secondary Ingredient', amount: 100, unit: 'g' },
          { name: 'Cold Pressed Olive Oil', amount: 1, unit: 'tbsp' },
          { name: 'Pink Himalayan Salt & Black Pepper', amount: 1, unit: 'tsp', optional: true }
        ],
        instructions: [
          { step: 1, text: `Prep fresh ${state.pantry[0]?.name || 'ingredients'} by slicing into uniform pieces.`, durationMinutes: 3 },
          { step: 2, text: 'Warm pan over medium flame with a splash of olive oil.', durationMinutes: 2 },
          { step: 3, text: 'Sauté gently for 8-10 minutes until aromatic and perfectly textured.', durationMinutes: 8, tip: 'Keep heat medium to preserve fresh flavors.' },
          { step: 4, text: 'Garnish with herbs and serve fresh.', durationMinutes: 2 }
        ],
        nutrition: { calories: 380, protein: 18, carbs: 32, fat: 14 }
      };

      addRecipe(newRecipe);
      setIsGenerating(false);
      setShowGenerateModal(false);
      setCustomPrompt('');
      setViewRecipe(newRecipe);
    }, 800);
  };

  const handleStartCookingClick = (recipe: Recipe) => {
    startCooking(recipe);
    setViewRecipe(null);
    navigate('/cooking');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
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
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Module 3 &bull; Recipe Discovery & Generation
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>AI Recipe Engine</h1>
          </div>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          style={{
            padding: '10px 20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--accent-amber) 0%, #d97706 100%)',
            color: '#000',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)',
            cursor: 'pointer'
          }}
        >
          <Sparkles size={18} /> Generate AI Recipe
        </button>
      </div>

      {/* Filter Controls */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div
            style={{
              flex: 1,
              minWidth: '220px',
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
              placeholder="Search recipes, ingredients, cuisines..."
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

          {/* Pantry Availability Match Tabs */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => setSelectedMatchFilter('all')}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: 'none',
                background: selectedMatchFilter === 'all' ? 'var(--accent-amber)' : 'transparent',
                color: selectedMatchFilter === 'all' ? '#000' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              All Recipes
            </button>
            <button
              onClick={() => setSelectedMatchFilter('ready')}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: 'none',
                background: selectedMatchFilter === 'ready' ? 'var(--accent-emerald)' : 'transparent',
                color: selectedMatchFilter === 'ready' ? '#000' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              100% Ready To Cook
            </button>
            <button
              onClick={() => setSelectedMatchFilter('almost')}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: 'none',
                background: selectedMatchFilter === 'almost' ? 'var(--primary-cyan)' : 'transparent',
                color: selectedMatchFilter === 'almost' ? '#000' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Missing &le; 1 Item
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {(['all', 'Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'] as (RecipeCategory | 'all')[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '4px 12px',
                borderRadius: '10px',
                border: selectedCategory === cat ? '1px solid var(--primary-cyan)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: selectedCategory === cat ? 'rgba(56, 189, 248, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                color: selectedCategory === cat ? 'var(--primary-cyan)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* Dietary Filters */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', 'Vegetarian', 'Vegan', 'Gluten-Free', 'High-Protein', 'Keto'].map((diet) => (
            <button
              key={diet}
              onClick={() => setSelectedDiet(diet)}
              style={{
                padding: '4px 12px',
                borderRadius: '10px',
                border: selectedDiet === diet ? '1px solid var(--accent-amber)' : '1px solid rgba(255, 255, 255, 0.08)',
                background: selectedDiet === diet ? 'rgba(245, 158, 11, 0.15)' : 'rgba(30, 41, 59, 0.4)',
                color: selectedDiet === diet ? 'var(--accent-amber)' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {diet === 'all' ? 'All Diets' : diet}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Cards List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {processedRecipes.length > 0 ? (
          processedRecipes.map((rec) => {
            const { matchPercentage, missing } = rec.matchInfo;
            const isReady = matchPercentage === 100;

            return (
              <div
                key={rec.id}
                onClick={() => setViewRecipe(rec)}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '24px',
                  borderRadius: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Background ambient gradient accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '120px',
                    height: '120px',
                    background: rec.colorGradient || 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
                    opacity: 0.25,
                    borderRadius: '0 24px 0 100%',
                    pointerEvents: 'none'
                  }}
                />

                {/* Top Badge Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isReady ? '#34d399' : matchPercentage >= 70 ? '#fbbf24' : '#f87171',
                      background: isReady ? 'rgba(16, 185, 129, 0.15)' : matchPercentage >= 70 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isReady ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    {matchPercentage}% Pantry Match
                  </span>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {rec.prepTime + (rec.cookTime || 0)} mins
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', lineHeight: 1.3 }}>{rec.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '6px', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {rec.description}
                  </p>
                </div>

                {/* Missing Items Warning */}
                {!isReady && missing.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.1)', padding: '6px 10px', borderRadius: '10px' }}>
                    Missing: {missing.join(', ')}
                  </div>
                )}

                {/* Tags & Action Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {rec.dietaryTags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(30, 41, 59, 0.6)', padding: '2px 8px', borderRadius: '8px' }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartCookingClick(rec);
                    }}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '12px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#34d399',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <Play size={14} /> Cook Now
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div
            className="glass-panel"
            style={{
              gridColumn: '1 / -1',
              padding: '40px',
              textAlign: 'center',
              borderRadius: '20px',
              color: 'var(--text-muted)'
            }}
          >
            No recipes match the selected filters. Try generating a new custom recipe!
          </div>
        )}
      </div>

      {/* Recipe Detail Modal */}
      {viewRecipe && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '28px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-amber)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {viewRecipe.category} &bull; {viewRecipe.cuisine}
                </span>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginTop: '2px' }}>{viewRecipe.title}</h2>
              </div>
              <button onClick={() => setViewRecipe(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {viewRecipe.description}
            </p>

            {/* Quick Metrics Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', background: 'rgba(30, 41, 59, 0.5)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Prep / Cook</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{viewRecipe.prepTime}m / {viewRecipe.cookTime}m</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Calories</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-amber)' }}>{viewRecipe.nutrition.calories} kcal</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Protein</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>{viewRecipe.nutrition.protein}g</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Servings</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{viewRecipe.servings}</div>
              </div>
            </div>

            {/* Ingredients Checklist */}
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Utensils size={16} color="var(--accent-amber)" /> Ingredients Required
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {viewRecipe.ingredients.map((ing, idx) => {
                  const inPantry = state.pantry.some(
                    (p) => p.name.toLowerCase().includes(ing.name.toLowerCase()) && p.quantity > 0
                  );
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {inPantry ? (
                          <CheckCircle size={16} color="var(--accent-emerald)" />
                        ) : (
                          <AlertCircle size={16} color="var(--accent-amber)" />
                        )}
                        <span style={{ fontSize: '0.88rem', color: inPantry ? 'var(--text-main)' : 'var(--text-muted)' }}>
                          {ing.name} {ing.optional ? '(Optional)' : ''}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-cyan)' }}>
                        {ing.amount} {ing.unit}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div>
              <h4 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChefHat size={16} color="var(--accent-amber)" /> Step-by-Step Instructions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {viewRecipe.instructions.map((step) => (
                  <div key={step.step} style={{ display: 'flex', gap: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(30, 41, 59, 0.4)' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent-amber)', color: '#000', fontWeight: 800, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {step.step}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.4 }}>{step.text}</p>
                      {step.tip && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '4px' }}>
                          💡 Tip: {step.tip}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleStartCookingClick(viewRecipe)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)',
                color: '#000',
                fontWeight: 800,
                fontSize: '1rem',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Play size={18} /> Start Guided Cooking Mode
            </button>
          </div>
        </div>
      )}

      {/* Generate AI Recipe Modal */}
      {showGenerateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '480px',
              borderRadius: '24px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)' }}>
                <Sparkles size={20} /> <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>AI Recipe Synthesizer</h3>
              </div>
              <button onClick={() => setShowGenerateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Describe what you want to make, or mention ingredients you have (e.g., "High protein paneer avocado wrap", "Ragi cashew warm bowl").
            </p>

            <form onSubmit={handleGenerateRecipe} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <textarea
                required
                rows={4}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Create a 15-minute healthy dinner using Avocado, Paneer, and Cashews with zero waste..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  resize: 'none',
                  outline: 'none'
                }}
              />

              <button
                type="submit"
                disabled={isGenerating}
                style={{
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, var(--accent-amber) 0%, #d97706 100%)',
                  color: '#000',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: isGenerating ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isGenerating ? (
                  <>Synthesizing Recipe Logic...</>
                ) : (
                  <>
                    <Sparkles size={16} /> Synthesize Recipe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
