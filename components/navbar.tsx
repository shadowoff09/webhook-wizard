import { Code2, Github } from 'lucide-react'
import Link from 'next/link'
import { ModeToggle } from './ui/theme-toggle'

export function Navbar() {
  return (
    <header className="border-b bg-background w-full px-4">
      <div className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Code2 className="h-6 w-6" />
          <span className="font-bold text-lg">Webhook Wizard</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="https://github.com/shadowoff09/webhook-wizard" target="_blank" className="flex items-center gap-1 px-3 py-2 text-sm hover:bg-muted rounded-md">
            <Github className="h-4 w-4" />
            GitHub
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
} 