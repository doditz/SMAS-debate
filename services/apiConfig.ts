// services/apiConfig.ts

// In a real deployment, these would come from environment variables.
// For this project, we define them as constants.

// --- STEP 1: CHOOSE YOUR BACKEND ---
// Option A: Local Development (if you run the Python server on your laptop)
const LOCAL_WEBSOCKET_URL = 'ws://localhost:8000/ws';

// Option B: Hosted Backend (PASTE YOUR CLOUD URL HERE)
// Get this URL from your deployed Hugging Face Space or GitHub Codespace.
// Example: 'wss://your-name-your-space.hf.space/ws'
const HOSTED_WEBSOCKET_URL = ''; // <-- PASTE YOUR PUBLIC WEBSOCKET URL HERE

// The application will automatically use your hosted URL if you provide it.
// Otherwise, it falls back to the local URL for development.
const selectedWebsocketUrl = HOSTED_WEBSOCKET_URL.trim() !== '' ? HOSTED_WEBSOCKET_URL : LOCAL_WEBSOCKET_URL;

console.log(`Connecting to backend at: ${selectedWebsocketUrl}`);

export const config = {
    // The API base URL is less critical for a WebSocket-first architecture, but kept for potential future REST endpoints.
    apiBaseUrl: selectedWebsocketUrl.replace('ws', 'http').replace('/ws', ''),
    websocketUrl: selectedWebsocketUrl,
};
