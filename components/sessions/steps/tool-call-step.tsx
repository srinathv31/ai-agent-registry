"use client"

import { Wrench } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModeBadge } from "@/components/shared/mode-badge"
import { DataClassificationBadge } from "@/components/shared/data-classification-badge"
import { StepPolicyRow } from "./step-policy-row"
import { JsonViewer } from "./json-viewer"
import { formatDuration } from "@/lib/utils"
import type { Tool } from "@/lib/types"

interface ToolCallStepProps {
  toolName: string
  toolInput?: Record<string, unknown>
  policyDecision?: {
    allowed: boolean
    reason: string
    scope: string
    ruleId: string
  }
  durationMs?: number
  tool: Tool | null
  isDryRun: boolean
}

export function ToolCallStep({
  toolName,
  toolInput,
  policyDecision,
  durationMs,
  tool,
  isDryRun,
}: ToolCallStepProps) {
  const borderColor = tool?.mode === "write" ? "border-l-warning" : "border-l-blue-500"

  return (
    <Card className={`border-l-4 ${borderColor} p-4`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="size-3.5 text-muted-foreground" />
          <span className="text-sm font-medium">{tool?.displayName ?? toolName}</span>
          {tool && <ModeBadge mode={tool.mode} />}
          {tool && <DataClassificationBadge classification={tool.dataClassification} />}
          {isDryRun && (
            <Badge variant="outline" className="border-warning/25 bg-warning/10 text-xs font-semibold text-warning">
              DRY RUN
            </Badge>
          )}
        </div>
        {durationMs != null && (
          <Badge variant="secondary" className="text-xs">
            {formatDuration(durationMs)}
          </Badge>
        )}
      </div>

      {policyDecision && (
        <div className="mb-3">
          <StepPolicyRow
            allowed={policyDecision.allowed}
            reason={policyDecision.reason}
            scope={policyDecision.scope}
            ruleId={policyDecision.ruleId}
          />
        </div>
      )}

      {toolInput && (
        <div>
          <div className="mb-1 text-xs font-medium text-muted-foreground">Input</div>
          <JsonViewer data={toolInput} />
        </div>
      )}
    </Card>
  )
}
