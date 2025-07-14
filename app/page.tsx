'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Code2, Copy, Send, Wand2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { FaDiscord, FaSlack } from "react-icons/fa";
import CodeComparison from '@/components/ui/code-comparison'
import { ModeToggle } from '@/components/ui/theme-toggle'


const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'curl', label: 'cURL' },
]

export default function WebhookWizard() {
  const [platform, setPlatform] = useState('discord')
  const [webhookUrl, setWebhookUrl] = useState('')
  const [message, setMessage] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [response, setResponse] = useState<{ success: boolean; message: string; error?: string } | null>(null)
  const [useEmbed, setUseEmbed] = useState(false)
  const [embedTitle, setEmbedTitle] = useState('')
  const [embedDescription, setEmbedDescription] = useState('')
  const [embedColor, setEmbedColor] = useState('#000000')
  const [isSending, setIsSending] = useState(false)

  const handlePlatformChange = (value: string) => {
    setPlatform(value)
    setWebhookUrl('')
    setMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    try {
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

      const body = {
        platform,
        webhookUrl,
        payload,
      };

      const res = await fetch('/api/send-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      setResponse({ success: res.ok, message: data.message, error: res.ok ? undefined : data.message })
    } catch (error) {
      setResponse({ success: false, message: 'An error occurred while sending the webhook.', error: error instanceof Error ? error.message : String(error) })
    } finally {
      setIsSending(false)
    }
  }

  let codeSnippet;

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
              color: parseInt(embedColor.slice(1), 16),
            },
          ],
        }
        : { content: message };
    }
    switch (language) {
      case 'javascript':
        codeSnippet = `fetch('${webhookUrl}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${JSON.stringify(payload, null, 2)}),
})
.then(response => console.log('Webhook sent successfully'))
.catch(error => console.error('Error:', error));
`
        break;
      case 'python':
        codeSnippet = `import requests

webhook_url = '${webhookUrl}'
data = ${JSON.stringify(payload, null, 2)}

response = requests.post(webhook_url, json=data)
print(f'Webhook sent with status code: {response.status_code}')
`
        break;
      case 'curl':
        codeSnippet = `curl -X POST "${webhookUrl}" \\
     -H "Content-Type: application/json" \\
     -d '${JSON.stringify(payload)}'
`
        break;
      default:
        codeSnippet = '';
    }
    return codeSnippet;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCodeSnippet()).then(() => {
      toast.success("Copied to clipboard")
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 via-primary/5 to-background dark:from-primary/5 dark:via-primary/2 dark:to-background">
      <div className="container mx-auto px-4 py-16 space-y-4 max-w-5xl">
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Wand2 className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold text-primary">WebHook Wizard</h1>
          </div>
          <p className="text-xl text-muted-foreground">Master Discord and Slack webhooks with ease</p>
          <ModeToggle />
        </header>

        {response && (
          <Alert variant={response.success ? "default" : "destructive"} className="animate-in fade-in-50 duration-300">
            {response.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertTitle>{response.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {response.message}
              {response.error && (
                <details className="mt-2 text-sm">
                  <summary className="cursor-pointer font-medium">Error details</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words bg-secondary/50 p-2 rounded">{response.error}</pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle>Test Your Webhook</CardTitle>
            <CardDescription>Choose a platform and send a test message</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="discord" onValueChange={handlePlatformChange} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="discord" className="flex items-center space-x-2">
                  <FaDiscord className="w-5 h-5 text-blue-600" />
                  <span>Discord</span>
                </TabsTrigger>
                <TabsTrigger value="slack" className="flex items-center space-x-2">
                  <FaSlack className="w-5 h-5 text-black dark:text-white" />
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
                  handleSubmit={handleSubmit}
                  isSending={isSending}
                />
              </TabsContent>
              <TabsContent value="slack">
                <WebhookForm
                  platform="Slack"
                  webhookUrl={webhookUrl}
                  setWebhookUrl={setWebhookUrl}
                  message={message}
                  setMessage={setMessage}
                  handleSubmit={handleSubmit}
                  isSending={isSending}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        

        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code2 className="h-6 w-6 text-primary" />
                <span>Code Example</span>
              </div>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </CardTitle>
            <CardDescription>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeComparison
              filename={`${platform} Webhook`}
              beforeCode={getCodeSnippet()}
              afterCode={getCodeSnippet()}
              language={language}
              lightTheme="github-light"
              darkTheme="github-dark"
              singleView={true}
            />
          </CardContent>
        </Card>
        
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
  handleSubmit: (e: React.FormEvent) => void;
  isSending: boolean;
  useEmbed?: boolean;
  setUseEmbed?: (use: boolean) => void;
  embedTitle?: string;
  setEmbedTitle?: (title: string) => void;
  embedDescription?: string;
  setEmbedDescription?: (description: string) => void;
  embedColor?: string;
  setEmbedColor?: (color: string) => void;
}


function WebhookForm({
  platform,
  webhookUrl,
  setWebhookUrl,
  message,
  setMessage,
  handleSubmit,
  isSending,
  useEmbed,
  setUseEmbed,
  embedTitle,
  setEmbedTitle,
  embedDescription,
  setEmbedDescription,
  embedColor,
  setEmbedColor
}: WebhookFormProps) {
  console.log("Current platform:", platform);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="webhookUrl">Webhook URL</Label>
        <Input
          id="webhookUrl"
          placeholder={`${platform} Webhook URL`}
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          required
          className="bg-background"
        />
      </div>
      {platform === 'Discord' && (
        <div className="flex items-center space-x-2">
          <Switch
            id="use-embed"
            checked={useEmbed}
            onCheckedChange={setUseEmbed}
          />
          <Label htmlFor="use-embed">Use Embed</Label>
        </div>
      )}
      {platform === 'Discord' && useEmbed && setEmbedTitle && setEmbedDescription && setEmbedColor ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="embedTitle">Embed Title</Label>
            <Input
              id="embedTitle"
              placeholder="Enter embed title"
              value={embedTitle}
              onChange={(e) => setEmbedTitle(e.target.value)}
              required
              className="bg-background"
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
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="embedColor">Embed Color</Label>
            <Input
              id="embedColor"
              type="color"
              value={embedColor}
              onChange={(e) => setEmbedColor(e.target.value)}
              required
              className="bg-background h-10 w-full"
            />
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Enter your message here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="bg-background"
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isSending}>
        <Send className="mr-2 h-4 w-4" />
        {isSending ? 'Sending...' : 'Send Webhook'}
      </Button>
    </form>
  )
}