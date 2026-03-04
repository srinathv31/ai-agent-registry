"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Play, RotateCcw, CheckCircle, Loader2, Circle, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { WorkflowTemplate, WorkflowAgentResult } from "@/lib/types"

interface WorkflowRunnerProps {
  workflow: WorkflowTemplate
}

type AgentStatus = "pending" | "running" | "completed" | "failed"

const DOMAIN_COLORS: Record<string, string> = {
  "Credit Cards": "bg-accent-blue/15 text-accent-blue",
  "Risk & Compliance": "bg-danger/15 text-danger",
  "Platform Operations": "bg-teal/15 text-teal",
  "Customer Intelligence": "bg-warning/15 text-warning",
}

export function WorkflowRunner({ workflow }: WorkflowRunnerProps) {
  const { agents, connections, runResult } = workflow
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>(
    agents.map(() => "pending")
  )
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [typedReasoning, setTypedReasoning] = useState<string[]>(
    agents.map(() => "")
  )
  const [showResults, setShowResults] = useState<boolean[]>(
    agents.map(() => false)
  )
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (typingRef.current) clearInterval(typingRef.current)
    setAgentStatuses(agents.map(() => "pending"))
    setActiveIndex(-1)
    setIsRunning(false)
    setTypedReasoning(agents.map(() => ""))
    setShowResults(agents.map(() => false))
  }, [agents])

  const typewriteReasoning = useCallback(
    (index: number, text: string): Promise<void> => {
      return new Promise((resolve) => {
        let charIndex = 0
        const chunkSize = 3
        typingRef.current = setInterval(() => {
          charIndex += chunkSize
          if (charIndex >= text.length) {
            setTypedReasoning((prev) => {
              const next = [...prev]
              next[index] = text
              return next
            })
            if (typingRef.current) clearInterval(typingRef.current)
            resolve()
          } else {
            setTypedReasoning((prev) => {
              const next = [...prev]
              next[index] = text.slice(0, charIndex)
              return next
            })
          }
        }, 20)
      })
    },
    []
  )

  const runWorkflow = useCallback(async () => {
    setIsRunning(true)
    for (let i = 0; i < agents.length; i++) {
      setActiveIndex(i)
      // Set running
      setAgentStatuses((prev) => {
        const next = [...prev]
        next[i] = "running"
        return next
      })

      // Wait then typewrite reasoning
      await new Promise((r) => {
        timeoutRef.current = setTimeout(r, 600)
      })
      const result = runResult[i]
      if (result) {
        await typewriteReasoning(i, result.reasoning)
      }

      // Show results
      setShowResults((prev) => {
        const next = [...prev]
        next[i] = true
        return next
      })

      // Set completed
      await new Promise((r) => {
        timeoutRef.current = setTimeout(r, 400)
      })
      setAgentStatuses((prev) => {
        const next = [...prev]
        next[i] = result?.status === "failed" ? "failed" : "completed"
        return next
      })
    }
    setIsRunning(false)
  }, [agents, runResult, typewriteReasoning])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (typingRef.current) clearInterval(typingRef.current)
    }
  }, [])

  const completedCount = agentStatuses.filter((s) => s === "completed" || s === "failed").length
  const progress = agents.length > 0 ? (completedCount / agents.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-3">
        {!isRunning && activeIndex === -1 && (
          <Button onClick={runWorkflow}>
            <Play className="size-4" />
            Run Workflow
          </Button>
        )}
        {!isRunning && completedCount > 0 && (
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="size-4" />
            Replay
          </Button>
        )}
        {isRunning && (
          <Badge variant="secondary" className="gap-1.5">
            <Loader2 className="size-3 animate-spin" />
            Running agent {activeIndex + 1} of {agents.length}
          </Badge>
        )}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-muted">
          <div
            className="h-1.5 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {completedCount} / {agents.length}
        </span>
      </div>

      {/* Horizontal DAG with live status */}
      <div className="flex items-start gap-0 overflow-x-auto pb-4">
        {agents.map((agent, i) => {
          const status = agentStatuses[i]
          const connection = connections.find((c) => c.fromAgentId === agent.id)

          const borderClass =
            status === "running"
              ? "border-accent-blue ring-2 ring-accent-blue/20"
              : status === "completed"
                ? "border-success"
                : status === "failed"
                  ? "border-danger"
                  : "border-border"

          return (
            <div key={agent.id} className="flex items-start shrink-0">
              <Card className={cn("w-[220px] transition-all duration-500", borderClass)}>
                <CardContent className="pt-4 pb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{agent.name}</p>
                    <StatusIcon status={status} />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge className={DOMAIN_COLORS[agent.domain] ?? "bg-muted text-muted-foreground"}>
                      {agent.domain.split(" ")[0]}
                    </Badge>
                    <Badge variant="secondary">{agent.role}</Badge>
                  </div>
                </CardContent>
              </Card>

              {i < agents.length - 1 && (
                <div className="flex flex-col items-center justify-center pt-6 w-[60px] shrink-0">
                  <div className="relative w-full flex items-center">
                    <div
                      className={cn(
                        "flex-1 border-t-2 border-dashed transition-colors duration-500",
                        status === "completed"
                          ? "border-success"
                          : "border-muted-foreground/30"
                      )}
                    />
                    <div
                      className={cn(
                        "size-0 border-y-[5px] border-y-transparent border-l-[8px] transition-colors duration-500",
                        status === "completed"
                          ? "border-l-success"
                          : "border-l-muted-foreground/30"
                      )}
                    />
                  </div>
                  {connection && (
                    <p className="mt-1 text-center text-[9px] text-muted-foreground px-0.5 line-clamp-2">
                      {connection.dataPassed.length > 30
                        ? connection.dataPassed.slice(0, 30) + "..."
                        : connection.dataPassed}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Vertical timeline of agent results */}
      <div className="space-y-4">
        {agents.map((agent, i) => {
          const status = agentStatuses[i]
          const result = runResult[i]
          const reasoning = typedReasoning[i]
          const hasResults = showResults[i]

          if (status === "pending") return null

          return (
            <Card key={agent.id} className="overflow-hidden">
              <CardContent className="pt-4 pb-4 space-y-3">
                <div className="flex items-center gap-2">
                  <StatusIcon status={status} />
                  <p className="text-sm font-semibold">{agent.name}</p>
                  <Badge variant="secondary">{agent.role}</Badge>
                  {result && hasResults && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {result.tokensUsed} tokens · {(result.durationMs / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>

                {/* Reasoning typewriter */}
                {reasoning && (
                  <blockquote className="border-l-2 border-accent-blue/30 pl-3 text-sm italic text-muted-foreground">
                    {reasoning}
                    {status === "running" && (
                      <span className="inline-block w-1.5 h-4 ml-0.5 bg-accent-blue animate-pulse" />
                    )}
                  </blockquote>
                )}

                {/* Input/Output panels */}
                {result && hasResults && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border bg-muted/50 p-3">
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Input</p>
                      <pre className="text-xs overflow-auto max-h-32">
                        {JSON.stringify(result.inputData, null, 2)}
                      </pre>
                    </div>
                    <div className="rounded-lg border bg-muted/50 p-3">
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">Output</p>
                      <pre className="text-xs overflow-auto max-h-32">
                        {JSON.stringify(result.outputData, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function StatusIcon({ status }: { status: AgentStatus }) {
  switch (status) {
    case "running":
      return <Loader2 className="size-4 animate-spin text-accent-blue" />
    case "completed":
      return <CheckCircle className="size-4 text-success" />
    case "failed":
      return <XCircle className="size-4 text-danger" />
    default:
      return <Circle className="size-4 text-muted-foreground/40" />
  }
}
