export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-6 w-full">
      <div className="container flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          © {currentYear} Webhook Wizard. All rights reserved.
        </p>
      </div>
    </footer>
  )
} 