# Watson Orchestrate Integration Setup

This document explains how to configure the UI to connect with Watson Orchestrate.

## Configuration Steps

### 1. Environment Setup

Create a `.env.local` file in the project root with the following content:

```env
# Watson Orchestrate API Configuration
WATSON_ORCHESTRATE_AUTH_TOKEN=your_actual_token_here

# Demo mode (set to false when using real API)
NEXT_PUBLIC_DEMO_MODE=false
```

Replace `your_actual_token_here` with your actual Watson Orchestrate authorization token.

### 2. API Endpoint

The Watson Orchestrate instance is configured to use:
```
https://api.eu-central-1.dl.watson-orchestrate.ibm.com/instances/20250721-1343-0678-809e-efdc3ba9c703/v1/orchestrate/56778937-70e3-4316-b8b3-e96df730fd10/chat/completions
```

This endpoint is already configured in the API route handler.

### 3. Request Format

The integration formats requests according to the Watson Orchestrate API specification:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "hello"
    }
  ],
  "additional_parameters": {},
  "context": {},
  "stream": false
}
```

### 4. Authentication

The API uses Bearer token authentication:
```
Authorization: Bearer <your_token>
```

## Testing the Integration

### Health Check
Visit `/api/health` to verify the API configuration:
- `watson_orchestrate_configured`: Should be `true` when properly configured
- `demo_mode`: Should be `false` for live Watson Orchestrate usage

### Chat Interface
1. Start the development server: `npm run dev`
2. Open the chat interface
3. Send a test message
4. Check the browser console and server logs for any errors

## Troubleshooting

### Common Issues

1. **Missing Auth Token**: Ensure `WATSON_ORCHESTRATE_AUTH_TOKEN` is set in `.env.local`
2. **CORS Issues**: The API route acts as a proxy to avoid CORS issues
3. **Response Format**: The integration handles different Watson Orchestrate response formats

### Debug Information

The API route logs detailed information including:
- Outgoing requests to Watson Orchestrate
- Response data from Watson Orchestrate
- Any errors that occur

Check the server console for these logs when debugging issues.

## API Route Handler

The integration is implemented in `/app/api/chat/route.ts` which:
1. Accepts requests from the frontend
2. Formats them for Watson Orchestrate
3. Forwards requests to the Watson Orchestrate endpoint
4. Transforms responses back to the expected frontend format

## Security Notes

- Never commit your actual auth token to version control
- Use `.env.local` for local development
- For production deployments, set environment variables through your hosting platform
