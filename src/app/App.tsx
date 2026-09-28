import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from '../contexts/AuthContext';
import { KitchenProvider } from '../state/KitchenContext';
import '../assets/styles/main.css';

export function App() {
  return (
    <AuthProvider>
      <KitchenProvider>
        <RouterProvider router={router} />
      </KitchenProvider>
    </AuthProvider>
  );
}

export default App;
