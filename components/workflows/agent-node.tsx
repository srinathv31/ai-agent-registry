"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { WorkflowNodeData } from "@/lib/types"

const DOMAIN_COLORS: Record<string, string> = {
  "Credit Cards": "bg-accent-blue/15 text-accent-blue",
  "Risk & Compliance": "bg-danger/15 text-danger",
  "Platform Operations": "bg-teal/15 text-teal",
  "Customer Intelligence": "bg-warning/15 text-warning",
}

type AgentNode = Node<WorkflowNodeData, "agent">

function AgentNodeComponent({ data }: NodeProps<AgentNode>) {
  const { agent, simulationStatus } = data

  const borderClass =
    simulationStatus === "running"
      ? "border-accent-blue ring-2 ring-accent-blue/30"
      : simulationStatus === "completed"
        ? "border-success ring-1 ring-success/20"
        : simulationStatus === "failed"
          ? "border-danger ring-1 ring-danger/20"
          : "border-border"

  return (
    <div
      className={cn(
        "w-[220px] rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-500",
        borderClass
      )}
    >
      {/* Pulse ring for running state */}
      {simulationStatus === "running" && (
        <div className="absolute inset-0 rounded-xl ring-2 ring-accent-blue/40 animate-pulse" />
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-accent-blue !border-2 !border-background"
      />

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between gap-1">
          <p className="text-sm font-semibold leading-tight truncate">{agent.name}</p>
          <SimStatusDot status={simulationStatus} />
        </div>

        <div className="flex flex-wrap gap-1">
          <Badge
            className={cn(
              "text-[10px] px-1.5 py-0",
              DOMAIN_COLORS[agent.domain] ?? "bg-muted text-muted-foreground"
            )}
          >
            {agent.domain.split(" ")[0]}
          </Badge>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            {agent.role}
          </Badge>
        </div>

        <div className="space-y-0.5 text-[11px] text-muted-foreground">
          <p className="truncate">
            {agent.toolsUsed.length > 2
              ? `${agent.toolsUsed.slice(0, 2).join(", ")} +${agent.toolsUsed.length - 2}`
              : agent.toolsUsed.join(", ")}
          </p>
          <div className="flex gap-3">
            <span>{(agent.avgDurationMs / 1000).toFixed(1)}s avg</span>
            <span>{agent.successRate}%</span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-accent-blue !border-2 !border-background"
      />
    </div>
  )
}

function SimStatusDot({ status }: { status: WorkflowNodeData["simulationStatus"] }) {
  if (status === "idle") return null

  const color =
    status === "running"
      ? "bg-accent-blue"
      : status === "completed"
        ? "bg-success"
        : "bg-danger"

  return (
    <span className="relative flex size-2.5 shrink-0">
      {status === "running" && (
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-blue/60" />
      )}
      <span className={cn("relative inline-flex size-2.5 rounded-full", color)} />
    </span>
  )
}

export const AgentNode = memo(AgentNodeComponent)
