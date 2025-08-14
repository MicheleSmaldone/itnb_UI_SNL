import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if the Watson Orchestrate auth token is configured
    const authToken = process.env.WATSON_ORCHESTRATE_AUTH_TOKEN
    const isConfigured = authToken && authToken !== 'your_actual_token_here'

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      watson_orchestrate_configured: isConfigured,
      demo_mode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}
