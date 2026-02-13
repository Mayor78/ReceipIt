// main.jsx - RESTRUCTURE THIS
import './performance-fixes.js' // Import this FIRST
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Use a loading state
const App = React.lazy(() => import('./App'))

createRoot(document.getElementById('root')).render(
  <React.Suspense fallback={
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      Loading...
    </div>
  }>
    <App />
  </React.Suspense>
)