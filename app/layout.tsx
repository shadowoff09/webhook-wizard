import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import Link from "next/link";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/ui/theme-toggle";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "WebHook Wizard",
  description: "Master Discord and Slack webhooks with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-full`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
        <main className="flex-grow">
          {children}
        </main>
        <Toaster />
        <footer className="w-full pb-0 mt-auto">
          <div className="max-w-5xl mx-auto text-center text-sm text-muted-foreground bg-card shadow-lg border border-b-0 border-muted rounded-lg p-4">
            Made with <span aria-label="love">❤️</span> by <Link href="https://github.com/shadowoff09" target="_blank" className="text-primary font-bold hover:underline">shadowoff09</Link>
            <ModeToggle />
          </div>
        </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}