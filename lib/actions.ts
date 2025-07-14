/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

interface SendWebhookParams {
  platform: string
  webhookUrl: string
  payload: any
}

export async function sendWebhook(params: SendWebhookParams) {
  const { platform, webhookUrl, payload } = params

  if (!webhookUrl || !payload) {
    return { 
      success: false, 
      message: 'Webhook URL and payload are required.',
      error: 'Missing required fields'
    }
  }

  // Check if the payload is valid based on the platform
  if (platform === 'slack' && !payload.text && !payload.blocks) {
    return { 
      success: false, 
      message: 'Slack webhook requires either text or blocks in the payload.',
      error: 'Invalid payload for Slack platform'
    }
  } else if (platform === 'discord' && !payload.content && !payload.embeds) {
    return { 
      success: false, 
      message: 'Discord webhook requires either content or embeds in the payload.',
      error: 'Invalid payload for Discord platform'
    }
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
      return { 
        success: true, 
        message: 'Webhook sent successfully.' 
      }
    } else {
      const errorText = await response.text()
      return { 
        success: false, 
        message: `Failed to send webhook. Error: ${errorText}`,
        error: errorText
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return { 
      success: false, 
      message: `An error occurred while sending the webhook: ${errorMessage}`,
      error: errorMessage
    }
  }
} 