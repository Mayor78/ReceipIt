// Simple proxy to avoid CORS
export const trackEvent = async (eventName, eventData = {}) => {
  try {
    // Store events in localStorage as backup
    const events = JSON.parse(localStorage.getItem('pending_events') || '[]');
    const event = {
      id: Date.now(),
      name: eventName,
      data: eventData,
      timestamp: new Date().toISOString(),
      userId: getUserId(),
      platform: navigator.userAgent
    };
    
    events.push(event);
    localStorage.setItem('pending_events', JSON.stringify(events.slice(-50))); // Keep last 50
    
    // Try to send via Google Apps Script
    sendViaGoogleAppsScript(event);
    
    return { success: true };
  } catch (error) {
    console.log('Event stored locally:', eventName);
    return { success: true }; // Always return success
  }
};

const sendViaGoogleAppsScript = (event) => {
  // Use image pixel technique (no CORS issues)
  const params = new URLSearchParams({
    userId: event.userId,
    event: event.name,
    eventData: JSON.stringify(event.data),
    platform: event.platform,
    type: 'pixel'
  });
  
  const pixel = new Image();
  pixel.src = `${EVENTS_SCRIPT_URL}?${params}`;
  pixel.style.display = 'none';
  pixel.onload = () => console.log('Event sent via pixel');
  pixel.onerror = () => console.log('Pixel failed (silent)');
  
  document.body.appendChild(pixel);
  setTimeout(() => document.body.removeChild(pixel), 1000);
};

// Get user ID
const getUserId = () => {
  let userId = localStorage.getItem('receiptit_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('receiptit_user_id', userId);
  }
  return userId;
};

// Sync pending events when possible
export const syncPendingEvents = async () => {
  try {
    const events = JSON.parse(localStorage.getItem('pending_events') || '[]');
    if (events.length === 0) return;
    
    console.log(`Syncing ${events.length} pending events...`);
    
    // Try to send each event
    events.forEach(event => {
      sendViaGoogleAppsScript(event);
    });
    
    // Clear sent events
    localStorage.removeItem('pending_events');
  } catch (error) {
    console.log('Sync failed, will retry later');
  }
};