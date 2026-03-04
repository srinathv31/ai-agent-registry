"use client"

import { Panel } from "@xyflow/react"
import {
  Play,
  RotateCcw,
  Maximize2,
  Trash2,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TemplateSelector } from "./template-selector"
import type { WorkflowTemplate } from "@/lib/types"

interface WorkflowToolbarProps {
  templates: WorkflowTemplate[]
  selectedTemplateId: string | null
  onSelectTemplate: (templateId: string) => void
  onClear: () => void
  onRunSimulation: () => void
  onFitView: () => void
  isSimulating: boolean
  canSimulate: boolean
  nodeCount: number
}

export function WorkflowToolbar({
  templates,
  selectedTemplateId,
  onSelectTemplate,
  onClear,
  onRunSimulation,
  onFitView,
  isSimulating,
  canSimulate,
  nodeCount,
}: WorkflowToolbarProps) {
  return (
    <Panel
      position="top-center"
      className="!m-0 !top-3"
    >
      <div className="flex items-center gap-2 rounded-xl border bg-card/95 backdrop-blur-sm shadow-lg px-3 py-2">
        <TemplateSelector
          templates={templates}
          selectedId={selectedTemplateId}
          onSelect={onSelectTemplate}
        />

        <div className="h-5 w-px bg-border" />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2.5 text-xs"
          onClick={onClear}
          disabled={isSimulating || nodeCount === 0}
        >
          <Trash2 className="size-3.5" />
          Clear
        </Button>

        <Button
          variant={canSimulate ? "default" : "ghost"}
          size="sm"
          className="h-8 px-2.5 text-xs"
          onClick={onRunSimulation}
          disabled={isSimulating || !canSimulate}
        >
          {isSimulating ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="size-3.5" />
              Run Simulation
            </>
          )}
        </Button>

        {isSimulating && (
          <Badge variant="secondary" className="text-[10px] gap-1">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-blue/60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent-blue" />
            </span>
            Simulating
          </Badge>
        )}

        <div className="h-5 w-px bg-border" />

        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={onFitView}
          title="Fit view"
        >
          <Maximize2 className="size-3.5" />
        </Button>

        {!isSimulating && nodeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={onRunSimulation}
            disabled={!canSimulate}
            title="Reset simulation"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        )}
      </div>
    </Panel>
  )
}
