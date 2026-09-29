import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { PublicRoute } from '../components/layout/PublicRoute';
import { HomePage } from '../pages/HomePage';
import { PantryPage } from '../pages/PantryPage';
import { RecipesPage } from '../pages/RecipesPage';
import { CookingPage } from '../pages/CookingPage';
import { AIPage } from '../pages/AIPage';
import { GroceryPage } from '../pages/GroceryPage';
import { SettingsPage } from '../pages/SettingsPage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { StaffPage } from '../pages/StaffPage';
import { WelcomePage } from '../pages/WelcomePage';

export const router = createBrowserRouter([
  // Public Unauthenticated Routes
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/welcome',
        element: <WelcomePage />
      },
      {
        path: '/signin',
        element: <SignInPage />
      },
      {
        path: '/signup',
        element: <SignUpPage />
      }
    ]
  },

  // Protected Restaurant Workspace Routes
  {
    element: <ProtectedRoute />,
    children: [
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
          { path: 'staff', element: <StaffPage /> },
          { path: 'grocery', element: <GroceryPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: '*', element: <Navigate to="/" replace /> }
        ]
      }
    ]
  }
]);
