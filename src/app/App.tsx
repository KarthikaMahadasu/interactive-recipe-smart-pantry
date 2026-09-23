import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { KitchenProvider } from '../state/KitchenContext';
import '../assets/styles/main.css';

export function App() {
  return (
    <KitchenProvider>
      <RouterProvider router={router} />
    </KitchenProvider>
  );
}

export default App;
