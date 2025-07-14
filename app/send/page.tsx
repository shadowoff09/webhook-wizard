'use client'

import { useActionState, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from 'lucide-react'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { FaDiscord, FaSlack } from "react-icons/fa";
import { CodeEditor } from "@/components/ui/code-editor"
import { sendWebhook } from '@/lib/actions'
import { generateCode } from '@/lib/code-generators'
import { toast } from 'sonner'

export default function TesterPage() {
  const [platform, setPlatform] = useState('discord')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [message, setMessage] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [useEmbed, setUseEmbed] = useState(false)
  const [embedTitle, setEmbedTitle] = useState('')
  const [embedDescription, setEmbedDescription] = useState('')
  const [embedColor, setEmbedColor] = useState('#000000')

  const handlePlatformChange = (value: string) => {
    setPlatform(value)
    setWebhookUrl('')
    setMessage('')
  }

  const webhookAction = async () => {
    let payload;
    if (platform === 'slack') {
      payload = { text: message };
    } else {
      payload = useEmbed
        ? {
          embeds: [
            {
              title: embedTitle,
              description: embedDescription,
              color: parseInt(embedColor.slice(1), 16),
            },
          ],
        }
        : { content: message };
    }

    const response = await sendWebhook({
      platform,
      webhookUrl,
      payload,
    });
    if (response.success) {
      toast.success('Webhook sent successfully')
    } else {
      toast.error(response.message)
    }
    return response;
  }

  const [, action, isPending] = useActionState(webhookAction, null)

  const getCodeSnippet = () => {
    let payload;
    if (platform === 'slack') {
      payload = { text: message };
    } else {
      payload = useEmbed
        ? {
          embeds: [
            {
              title: embedTitle,
              description: embedDescription,
              color: embedColor ? parseInt(embedColor.slice(1), 16) : 0,
            },
          ],
        }
        : { content: message };
    }
    
    return generateCode(language, { webhookUrl, payload, platform });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Webhook Tester</h1>
            <p className="text-muted-foreground">
              Select a platform, configure your message, and send a test webhook.
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="discord" onValueChange={handlePlatformChange} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="discord" className="flex items-center space-x-2">
                    <FaDiscord className="w-4 h-4" />
                    <span>Discord</span>
                  </TabsTrigger>
                  <TabsTrigger value="slack" className="flex items-center space-x-2">
                    <FaSlack className="w-4 h-4" />
                    <span>Slack</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="discord">
                  <WebhookForm
                    platform="Discord"
                    webhookUrl={webhookUrl}
                    setWebhookUrl={setWebhookUrl}
                    message={message}
                    setMessage={setMessage}
                    useEmbed={useEmbed}
                    setUseEmbed={setUseEmbed}
                    embedTitle={embedTitle}
                    setEmbedTitle={setEmbedTitle}
                    embedDescription={embedDescription}
                    setEmbedDescription={setEmbedDescription}
                    embedColor={embedColor}
                    setEmbedColor={setEmbedColor}
                    action={action}
                    isPending={isPending}
                  />
                </TabsContent>
                <TabsContent value="slack">
                  <WebhookForm
                    platform="Slack"
                    webhookUrl={webhookUrl}
                    setWebhookUrl={setWebhookUrl}
                    message={message}
                    setMessage={setMessage}
                    action={action}
                    isPending={isPending}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-20">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Code Generator</h2>
            <p className="text-muted-foreground">
              Live code snippets for your webhook implementation.
            </p>
          </div>
          <CodeEditor
            code={getCodeSnippet()}
            language={language}
            onLanguageChange={setLanguage}
            title={`${platform.charAt(0).toUpperCase() + platform.slice(1)} Webhook`}
          />
        </div>
      </div>
    </div>
  )
}

interface WebhookFormProps {
  platform: string;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  message: string;
  setMessage: (message: string) => void;
  action: () => void;
  isPending: boolean;
  useEmbed?: boolean;
  setUseEmbed?: (use: boolean) => void;
  embedTitle?: string;
  setEmbedTitle?: (title: string) => void;
  embedDescription?: string;
  setEmbedDescription?: (description: string) => void;
  embedColor?: string;
  setEmbedColor?: (color: string) => void;
}

function DiscordEmbedForm({
  embedTitle,
  setEmbedTitle,
  embedDescription,
  setEmbedDescription,
  embedColor,
  setEmbedColor,
}: {
  embedTitle: string;
  setEmbedTitle: (title: string) => void;
  embedDescription: string;
  setEmbedDescription: (description: string) => void;
  embedColor: string;
  setEmbedColor: (color: string) => void;
}) {
  return (
    <div className="space-y-4 pt-4 border-t mt-4">
      <div className="space-y-2">
        <Label htmlFor="embedTitle">Embed Title</Label>
        <Input
          id="embedTitle"
          placeholder="Enter embed title"
          value={embedTitle}
          onChange={(e) => setEmbedTitle(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="embedDescription">Embed Description</Label>
        <Textarea
          id="embedDescription"
          placeholder="Enter embed description"
          value={embedDescription}
          onChange={(e) => setEmbedDescription(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="embedColor">Embed Color</Label>
        <div className="relative">
          <Input
            id="embedColor"
            type="text"
            value={embedColor}
            onChange={(e) => setEmbedColor(e.target.value)}
            required
            className="pl-12 font-mono"
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
            title="Please enter a valid hex color code"
          />
          <div className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-10 rounded-md border" style={{ backgroundColor: embedColor }}>
            <Input
              type="color"
              value={embedColor}
              onChange={(e) => setEmbedColor(e.target.value)}
              className="h-full w-full cursor-pointer opacity-0"
              aria-label="Color picker"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function WebhookForm({
  platform,
  webhookUrl,
  setWebhookUrl,
  message,
  setMessage,
  action,
  isPending,
  useEmbed,
  setUseEmbed,
  embedTitle,
  setEmbedTitle,
  embedDescription,
  setEmbedDescription,
  embedColor,
  setEmbedColor
}: WebhookFormProps) {
  
  const isDiscord = platform === 'Discord';

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="webhookUrl">Webhook URL</Label>
        <Input
          id="webhookUrl"
          placeholder={`${platform} Webhook URL`}
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          required
        />
      </div>
      {isDiscord && setUseEmbed && (
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="use-embed"
            checked={useEmbed}
            onCheckedChange={setUseEmbed}
          />
          <Label htmlFor="use-embed">Use Embed</Label>
        </div>
      )}
      {isDiscord && useEmbed && embedTitle !== undefined && setEmbedTitle && embedDescription !== undefined && setEmbedDescription && embedColor !== undefined && setEmbedColor ? (
        <DiscordEmbedForm
          embedTitle={embedTitle}
          setEmbedTitle={setEmbedTitle}
          embedDescription={embedDescription}
          setEmbedDescription={setEmbedDescription}
          embedColor={embedColor}
          setEmbedColor={setEmbedColor}
        />
      ) : (
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Enter your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required={!isDiscord || !useEmbed}
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        <Send className="mr-2 h-4 w-4" />
        {isPending ? 'Sending...' : 'Send Webhook'}
      </Button>
    </form>
  )
} 