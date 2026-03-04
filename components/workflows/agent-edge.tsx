"use client"

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
  type Edge,
} from "@xyflow/react"
import { cn } from "@/lib/utils"
import type { WorkflowEdgeData } from "@/lib/types"

type AgentEdge = Edge<WorkflowEdgeData, "agent">

export function AgentEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps<AgentEdge>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  const isAnimated = data?.animated ?? false

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        className={cn(
          "!stroke-[2px] transition-colors duration-500",
          isAnimated ? "!stroke-accent-blue" : "!stroke-muted-foreground/40"
        )}
        style={
          isAnimated
            ? {
                strokeDasharray: "8 4",
                animation: "edgeFlow 0.6s linear infinite",
              }
            : { strokeDasharray: "6 4" }
        }
      />
      {data?.dataPassed && (
        <EdgeLabelRenderer>
          <div
            className="nodrag nopan pointer-events-none absolute"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            <div
              className={cn(
                "rounded-md border px-2 py-1 text-[10px] leading-tight max-w-[160px] text-center",
                isAnimated
                  ? "bg-accent-blue/10 border-accent-blue/30 text-accent-blue"
                  : "bg-card border-border text-muted-foreground"
              )}
            >
              <p className="line-clamp-2">
                {data.dataPassed.length > 50
                  ? data.dataPassed.slice(0, 50) + "..."
                  : data.dataPassed}
              </p>
              {data.condition && (
                <p className="mt-0.5 italic text-[9px] text-warning">
                  if: {data.condition.length > 35
                    ? data.condition.slice(0, 35) + "..."
                    : data.condition}
                </p>
              )}
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
