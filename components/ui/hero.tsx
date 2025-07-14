import { ArrowRight, Wand2 } from 'lucide-react'
import { Button } from './button'

export function Hero() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex justify-center">
            <Wand2 className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            The Ultimate Webhook Testing Tool
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Effortlessly test, debug, and generate code for your Discord and Slack webhooks.
            Get instant feedback and professional code snippets in seconds.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <a href="/send">
                <span>Start Testing</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 