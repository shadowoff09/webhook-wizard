import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { platform, webhookUrl, payload } = await request.json()

  if (!webhookUrl || !payload) {
    return NextResponse.json({ message: 'Webhook URL and payload are required.' }, { status: 400 })
  }

  // Check if the payload is valid based on the platform
  if (platform === 'slack' && !payload.text && !payload.blocks) {
    return NextResponse.json({ message: 'Slack webhook requires either text or blocks in the payload.' }, { status: 400 })
  } else if (platform === 'discord' && !payload.content && !payload.embeds) {
    return NextResponse.json({ message: 'Discord webhook requires either content or embeds in the payload.' }, { status: 400 })
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      return NextResponse.json({ message: 'Webhook sent successfully.' })
    } else {
      const errorText = await response.text()
      return NextResponse.json({ message: `Failed to send webhook. Error: ${errorText}` }, { status: response.status })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ message: `An error occurred while sending the webhook: ${errorMessage}` }, { status: 500 })
  }
}