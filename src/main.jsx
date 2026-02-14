// main.jsx - RESTRUCTURE THIS
import './performance-fixes.js' // Import this FIRST
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Use a loading state
const App = React.lazy(() => import('./App'))

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)