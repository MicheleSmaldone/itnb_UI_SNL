// Use local proxy to avoid CORS issues
export const API_BASE_URL = '/api'

export const DEFAULT_API_TIMEOUT = 90000

// Demo mode for deployments without backend
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

// Mock responses for demo mode
export const DEMO_RESPONSES = [
  "Here are some Van Gogh exhibition posters from Switzerland [POSTER_IMAGE: https://ccsa.admin.ch/posters/SNL_1992_343.jpg]. This exhibition showcased his work [PRIMARY_SOURCE: https://nb-posters.primo.exlibrisgroup.com/discovery/fulldisplay] from 1973.",
  "The Vincent van Gogh collection [POSTER_IMAGE: https://ccsa.admin.ch/posters/SNL_EXPO_2459.jpg] features drawings and watercolors. More details [PRIMARY_SOURCE: https://nb-posters.primo.exlibrisgroup.com/discovery/fulldisplay] can be found in the archives.",
  "This poster [POSTER_IMAGE: https://ccsa.admin.ch/posters/SNL_EXPO_2451.jpg] represents paintings from the Stedelijk Museum Amsterdam. The exhibition [PRIMARY_SOURCE: https://nb-posters.primo.exlibrisgroup.com/discovery/fulldisplay] ran from October to November 1954.",
  "The Fondation Pierre Gianadda exhibition [POSTER_IMAGE: https://ccsa.admin.ch/posters/VSBCVS_B5151.jpg] in Martigny featured Van Gogh's work. Historical context [PRIMARY_SOURCE: https://nb-posters.primo.exlibrisgroup.com/discovery/fulldisplay] is available in the documentation."
]

// /api/chat
export const API_ENDPOINTS = {
  chat: `${API_BASE_URL}/chat`,  // Main chat endpoint
  upload: `${API_BASE_URL}/upload`,  // File upload endpoint
  health: `${API_BASE_URL}/health`,  // Health check endpoint
}

// API Types
export interface ImageResponse {
  filename: string;
  base64_data: string;
}

export interface ChatResponse {
  response: string;  // Updated to match FastAPI response
  images?: ImageResponse[];
  query_language?: string;
  query_time_ms?: number;
}

export interface ChatHistoryItem {
  question: string;
  answer: string;
}

export interface UploadFileResponse {
  url: string;
}

// Updated to match FastAPI ChatRequest model
export interface AssistantQueryBody {
  message: string;  // Changed from 'question' to 'message'
  history: string;  // Changed to string format as per FastAPI
}

// Test if the backend is accessible
export const testBackendConnection = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.health, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    console.log('Health check status:', response.status);
    return response.ok;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  try {
    console.log('Sending request to:', endpoint);
    console.log('Request body:', options.body);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 180 second timeout

    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    // Clear timeout
    clearTimeout(timeoutId);

    console.log('Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Handle potential errors before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    // Try to parse as JSON, with fallback
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      return { response: "Sorry, there was an error processing the response from the server." };
    }
    
    console.log('Response data:', responseData);
    return responseData;
  } catch (error: unknown) {
    console.error('API call error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      endpoint,
      options
    });
    
    // Handle specific error types
    if (error instanceof Error && error.name === 'AbortError') {
      return { response: "The request took too long and was aborted. The server might be busy." };
    }
    
    // Handle connection reset errors specifically
    if (error instanceof Error && 
       (error.message.includes('socket hang up') || 
        error.message.includes('ECONNRESET'))) {
      return { 
        response: "The connection was interrupted while the server was processing your request. " +
                "The answer may have been too complex or the server might be overloaded. " +
                "Please try a simpler question or try again later."
      };
    }
    
    // Return a user-friendly error rather than throwing
    return { response: "Sorry, there was an error connecting to the server. Please try again later." };
  }
} 