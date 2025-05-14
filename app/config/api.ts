// Use local proxy to avoid CORS issues
export const API_BASE_URL = '/api'

export const DEFAULT_API_TIMEOUT = 90000


// /api/chat
export const API_ENDPOINTS = {
  chat: `${API_BASE_URL}/chat`,  // Main chat endpoint (updated from /query)
  upload: `${API_BASE_URL}/upload`,  // File upload endpoint
  health: `${API_BASE_URL}/health`,  // Health check endpoint
}

// API Types
export interface ImageResponse {
  filename: string;
  base64_data: string;
}

export interface ChatResponse {
  answer: string;
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

export interface AssistantQueryBody {
  question: string;
  history?: ChatHistoryItem[] | null;
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

      // Create an AbortController to handle timeout
    // const controller = new AbortController();
    // const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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
      return { answer: "Sorry, there was an error processing the response from the server." };
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
      return { answer: "The request took too long and was aborted. The server might be busy." };
    }
    
    // Handle connection reset errors specifically
    if (error instanceof Error && 
       (error.message.includes('socket hang up') || 
        error.message.includes('ECONNRESET'))) {
      return { 
        answer: "The connection was interrupted while the server was processing your request. " +
                "The answer may have been too complex or the server might be overloaded. " +
                "Please try a simpler question or try again later."
      };
    }
    
    // Return a user-friendly error rather than throwing
    return { answer: "Sorry, there was an error connecting to the server. Please try again later." };
  }
} 