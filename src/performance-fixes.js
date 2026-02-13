// performance-fixes.js
// Load this FIRST in main.jsx

// 1. Remove all console logs in production
if (import.meta.env.PROD) {
  console.log = () => {}
  console.debug = () => {}
  console.warn = () => {}
  console.error = () => {}
}

// 2. Add resource hints programmatically
const addResourceHint = () => {
  const hints = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
  ]
  
  hints.forEach(({ rel, href, crossorigin }) => {
    const link = document.createElement('link')
    link.rel = rel
    link.href = href
    if (crossorigin) link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

addResourceHint()