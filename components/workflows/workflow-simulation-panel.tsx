"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronDown, ChevronUp, CheckCircle, Loader2, Circle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { WorkflowTemplate, WorkflowAgentResult } from "@/lib/types"

type AgentSimStatus = "pending" | "running" | "completed" | "failed"
type NodeSimStatus = "idle" | "running" | "completed" | "failed"

interface WorkflowSimulationPanelProps {
  workflow: WorkflowTemplate | null
  isSimulating: boolean
  onSimulationStart: () => void
  onSimulationEnd: () => void
  onAgentStatusChange: (agentId: string, status: NodeSimStatus) => void
  onEdgeAnimate: (fromId: string, toId: string, animated: boolean) => void
  triggerRun: number
}

export function WorkflowSimulationPanel({
  workflow,
  isSimulating,
  onSimulationStart,
  onSimulationEnd,
  onAgentStatusChange,
  onEdgeAnimate,
  triggerRun,
}: WorkflowSimulationPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentSimStatus>>({})
  const [typedReasoning, setTypedReasoning] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState<Record<string, boolean>>({})
  const [progress, setProgress] = useState(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef = useRef(false)

  const cleanup = useCallback(() => {
    abortRef.current = true
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (typingRef.current) clearInterval(typingRef.current)
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  const typewriteReasoning = useCallback(
    (agentId: string, text: string): Promise<void> => {
      return new Promise((resolve) => {
        let charIndex = 0
        const chunkSize = 3
        typingRef.current = setInterval(() => {
          if (abortRef.current) {
            if (typingRef.current) clearInterval(typingRef.current)
            resolve()
            return
          }
          charIndex += chunkSize
          if (charIndex >= text.length) {
            setTypedReasoning((prev) => ({ ...prev, [agentId]: text }))
            if (typingRef.current) clearInterval(typingRef.current)
            resolve()
          } else {
            setTypedReasoning((prev) => ({
              ...prev,
              [agentId]: text.slice(0, charIndex),
            }))
          }
        }, 20)
      })
    },
    []
  )

  const runSimulation = useCallback(async () => {
    if (!workflow) return
    abortRef.current = false

    const { agents, connections, runResult } = workflow
    const statusMap: Record<string, AgentSimStatus> = {}
    agents.forEach((a) => { statusMap[a.id] = "pending" })

    setAgentStatuses(statusMap)
    setTypedReasoning({})
    setShowResults({})
    setProgress(0)
    setExpanded(true)
    onSimulationStart()

    for (let i = 0; i < agents.length; i++) {
      if (abortRef.current) break
      const agent = agents[i]
      const result = runResult[i] as WorkflowAgentResult | undefined

      // Animate incoming edge
      const incomingConn = connections.find((c) => c.toAgentId === agent.id)
      if (incomingConn) {
        onEdgeAnimate(incomingConn.fromAgentId, incomingConn.toAgentId, true)
      }

      // Set running
      setAgentStatuses((prev) => ({ ...prev, [agent.id]: "running" }))
      onAgentStatusChange(agent.id, "running")

      await new Promise<void>((r) => {
        timeoutRef.current = setTimeout(r, 600)
      })
      if (abortRef.current) break

      // Typewrite reasoning
      if (result) {
        await typewriteReasoning(agent.id, result.reasoning)
      }
      if (abortRef.current) break

      // Show results
      setShowResults((prev) => ({ ...prev, [agent.id]: true }))

      await new Promise<void>((r) => {
        timeoutRef.current = setTimeout(r, 400)
      })
      if (abortRef.current) break

      // Set completed
      const finalStatus: AgentSimStatus = result?.status === "failed" ? "failed" : "completed"
      setAgentStatuses((prev) => ({ ...prev, [agent.id]: finalStatus }))
      onAgentStatusChange(agent.id, finalStatus)

      // Stop edge animation
      if (incomingConn) {
        onEdgeAnimate(incomingConn.fromAgentId, incomingConn.toAgentId, false)
      }

      setProgress(Math.round(((i + 1) / agents.length) * 100))
    }

    onSimulationEnd()
  }, [workflow, onSimulationStart, onSimulationEnd, onAgentStatusChange, onEdgeAnimate, typewriteReasoning])

  // Trigger run when triggerRun changes
  const prevTrigger = useRef(triggerRun)
  useEffect(() => {
    if (triggerRun > prevTrigger.current) {
      prevTrigger.current = triggerRun
      runSimulation()
    }
  }, [triggerRun, runSimulation])

  if (!workflow) return null

  const { agents, runResult } = workflow
  const completedCount = Object.values(agentStatuses).filter(
    (s) => s === "completed" || s === "failed"
  ).length
  const hasResults = completedCount > 0 || isSimulating

  if (!hasResults && !expanded) return null

  return (
    <div
      className={cn(
        "border-t bg-card transition-all duration-300",
        expanded ? "max-h-[400px]" : "max-h-10"
      )}
    >
      {/* Toggle bar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-2 text-xs font-medium hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span>Simulation Results</span>
          {isSimulating && (
            <Badge variant="secondary" className="text-[10px] gap-1">
              <Loader2 className="size-3 animate-spin" />
              Running
            </Badge>
          )}
          {!isSimulating && completedCount > 0 && (
            <span className="text-muted-foreground">
              {completedCount}/{agents.length} agents completed
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Progress bar */}
          {hasResults && (
            <div className="flex items-center gap-2">
              <div className="h-1 w-24 rounded-full bg-muted">
                <div
                  className="h-1 rounded-full bg-accent-blue transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
          )}
          {expanded ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
        </div>
      </button>

      {/* Results */}
      {expanded && (
        <div className="overflow-y-auto max-h-[356px] px-4 pb-4 space-y-3">
          {agents.map((agent) => {
            const status = agentStatuses[agent.id]
            const result = runResult.find((r) => r.agentId === agent.id)
            const reasoning = typedReasoning[agent.id]
            const hasResult = showResults[agent.id]

            if (!status || status === "pending") return null

            return (
              <div
                key={agent.id}
                className="rounded-lg border bg-background p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <StatusIcon status={status} />
                  <span className="text-sm font-medium">{agent.name}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {agent.role}
                  </Badge>
                  {result && hasResult && (
                    <span className="ml-auto text-[10px] text-muted-foreground">
                      {result.tokensUsed} tokens &middot; {(result.durationMs / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>

                {reasoning && (
                  <blockquote className="border-l-2 border-accent-blue/30 pl-3 text-xs italic text-muted-foreground">
                    {reasoning}
                    {status === "running" && (
                      <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-accent-blue animate-pulse" />
                    )}
                  </blockquote>
                )}

                {result && hasResult && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-md border bg-muted/50 p-2">
                      <p className="mb-1 text-[10px] font-medium text-muted-foreground">Input</p>
                      <pre className="text-[10px] overflow-auto max-h-20 leading-relaxed">
                        {JSON.stringify(result.inputData, null, 2)}
                      </pre>
                    </div>
                    <div className="rounded-md border bg-muted/50 p-2">
                      <p className="mb-1 text-[10px] font-medium text-muted-foreground">Output</p>
                      <pre className="text-[10px] overflow-auto max-h-20 leading-relaxed">
                        {JSON.stringify(result.outputData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatusIcon({ status }: { status: AgentSimStatus }) {
  switch (status) {
    case "running":
      return <Loader2 className="size-3.5 animate-spin text-accent-blue" />
    case "completed":
      return <CheckCircle className="size-3.5 text-success" />
    case "failed":
      return <XCircle className="size-3.5 text-danger" />
    default:
      return <Circle className="size-3.5 text-muted-foreground/40" />
  }
}
