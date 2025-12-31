import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeP0Systems } from './services/p0Initializer'
import { LanguageProvider } from './contexts/LanguageContext'

// Initialize P0 protective systems
initializeP0Systems();

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
