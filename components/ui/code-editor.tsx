'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CopyButton } from "@/components/ui/copy-button"
import Editor from '@monaco-editor/react'
import { useTheme } from "next-themes"

interface CodeEditorProps {
  code: string;
  language: string;
  onLanguageChange: (language: string) => void;
  title: string;
}

export function CodeEditor({ code, language, onLanguageChange, title }: CodeEditorProps) {
  const { theme } = useTheme()

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-muted/50 border-b">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[150px] h-8 text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
              <SelectItem value="php">PHP</SelectItem>
            </SelectContent>
          </Select>
          <CopyButton text={code} />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Editor
          height="500px"
          language={language}
          value={code}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            readOnly: true,
            scrollBeyondLastLine: false,
            wordWrap: "on"
          }}
        />
      </CardContent>
    </Card>
  )
} 