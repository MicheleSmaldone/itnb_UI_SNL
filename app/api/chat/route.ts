import { NextRequest, NextResponse } from 'next/server'

// Watson Orchestrate API configuration
const WATSON_ORCHESTRATE_URL = 'https://api.eu-central-1.dl.watson-orchestrate.ibm.com/instances/20250721-1343-0678-809e-efdc3ba9c703/v1/orchestrate/56778937-70e3-4316-b8b3-e96df730fd10/chat/completions'

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request
    const body = await request.json()
    const { message, history } = body

    // Get the authorization token from environment variables
    const authToken = process.env.WATSON_ORCHESTRATE_AUTH_TOKEN
    if (!authToken) {
      console.error('WATSON_ORCHESTRATE_AUTH_TOKEN environment variable is not set')
      return NextResponse.json(
        { error: 'API configuration error: Missing authentication token' },
        { status: 500 }
      )
    }

    // Format the request for Watson Orchestrate API
    const orchestratePayload = {
      messages: [
        {
          role: "user",
          content: message
        }
      ],
      additional_parameters: {},
      context: history ? { history } : {},
      stream: false
    }

    console.log('Sending request to Watson Orchestrate:', {
      url: WATSON_ORCHESTRATE_URL,
      payload: orchestratePayload
    })

    // Make the request to Watson Orchestrate
    const response = await fetch(WATSON_ORCHESTRATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(orchestratePayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Watson Orchestrate API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      })
      
      return NextResponse.json(
        { 
          error: `Watson Orchestrate API error: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      )
    }

    const orchestrateResponse = await response.json()
    console.log('Watson Orchestrate response:', orchestrateResponse)

    // Transform the response to match the expected format
    // Watson Orchestrate typically returns the response in a 'choices' array
    let responseText = ''
    if (orchestrateResponse.choices && orchestrateResponse.choices.length > 0) {
      responseText = orchestrateResponse.choices[0].message?.content || orchestrateResponse.choices[0].text || ''
    } else if (orchestrateResponse.response) {
      responseText = orchestrateResponse.response
    } else if (orchestrateResponse.content) {
      responseText = orchestrateResponse.content
    } else {
      // Fallback to the entire response if structure is different
      responseText = JSON.stringify(orchestrateResponse)
    }

    // Return the response in the format expected by the frontend
    return NextResponse.json({
      response: responseText,
      query_time_ms: Date.now(), // Add timestamp
    })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
