"use client"

import { ArrowDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { JsonViewer } from "./json-viewer"

interface ToolResultStepProps {
  toolName: string
  toolOutput?: Record<string, unknown>
  redactedFields?: string[]
}

export function ToolResultStep({ toolName, toolOutput, redactedFields = [] }: ToolResultStepProps) {
  return (
    <Card className="border-muted bg-muted/30 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <ArrowDown className="size-3.5" />
        Result from <code className="rounded bg-muted px-1">{toolName}</code>
      </div>
      {toolOutput && (
        <JsonViewer data={toolOutput} redactedFields={redactedFields} defaultExpanded />
      )}
    </Card>
  )
}
