import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeP0Systems } from './services/p0Initializer'

// Initialize P0 protective systems
initializeP0Systems();

createRoot(document.getElementById("root")!).render(<App />);
