import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/HomePage';
import { PantryPage } from '../pages/PantryPage';
import { RecipesPage } from '../pages/RecipesPage';
import { CookingPage } from '../pages/CookingPage';
import { AIPage } from '../pages/AIPage';
import { GroceryPage } from '../pages/GroceryPage';
import { SettingsPage } from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'home', element: <HomePage /> },
      { path: 'pantry', element: <PantryPage /> },
      { path: 'recipes', element: <RecipesPage /> },
      { path: 'cooking', element: <CookingPage /> },
      { path: 'ai', element: <AIPage /> },
      { path: 'grocery', element: <GroceryPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/" replace /> }
    ]
  }
]);
