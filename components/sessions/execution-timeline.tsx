"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  RotateCcw,
  Clock,
  User,
  Zap,
  Hash,
  Tag,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SessionStatusBadge } from "@/components/shared/session-status-badge"
import { ReasoningStep } from "./steps/reasoning-step"
import { ToolCallStep } from "./steps/tool-call-step"
import { ToolResultStep } from "./steps/tool-result-step"
import { ApprovalStep } from "./steps/approval-step"
import { ResponseStep } from "./steps/response-step"
import { ErrorStep } from "./steps/error-step"
import { formatDuration, formatRelativeTime, lookupTool } from "@/lib/utils"
import type { AgentSession, AgentStep } from "@/lib/types"

interface ExecutionTimelineProps {
  session: AgentSession
}

export function ExecutionTimeline({ session }: ExecutionTimelineProps) {
  const [visibleStepCount, setVisibleStepCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const lastStepRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const steps = session.steps

  const advanceStep = useCallback(() => {
    setVisibleStepCount((prev) => {
      if (prev >= steps.length) {
        setIsPlaying(false)
        return steps.length
      }
      return prev + 1
    })
  }, [steps.length])

  useEffect(() => {
    if (!isPlaying || visibleStepCount >= steps.length) {
      if (visibleStepCount >= steps.length) setIsPlaying(false)
      return
    }

    const nextStep = steps[visibleStepCount]
    const delay = nextStep?.type === "reasoning" ? 1500 : 800

    timeoutRef.current = setTimeout(advanceStep, delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isPlaying, visibleStepCount, steps, advanceStep])

  // Auto-scroll to latest step
  useEffect(() => {
    if (visibleStepCount > 0 && lastStepRef.current) {
      lastStepRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [visibleStepCount])

  function handleReplay() {
    setVisibleStepCount(0)
    setIsPlaying(true)
  }

  // Session duration
  const durationMs = session.completedAt
    ? new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()
    : Date.now() - new Date(session.startedAt).getTime()

  const startTime = new Date(session.startedAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  const endTime = session.completedAt
    ? new Date(session.completedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "In progress"

  return (
    <div className="space-y-6">
      {/* Session metadata card */}
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">{session.summary}</h2>
              <SessionStatusBadge status={session.status} />
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                {session.userId}
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5" />
                {session.trigger.replace("_", " ")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {startTime} → {endTime} ({formatDuration(durationMs)})
              </span>
              <span className="flex items-center gap-1.5">
                <Hash className="size-3.5" />
                {steps.length} steps
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="size-3.5" />
                {session.traceId}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>Tokens: {session.tokenUsage.total.toLocaleString()} ({session.tokenUsage.prompt.toLocaleString()} prompt + {session.tokenUsage.completion.toLocaleString()} completion)</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleReplay}>
            <RotateCcw className="size-4" />
            Replay
          </Button>
        </div>
      </Card>

      {/* Progress indicator */}
      <div className="flex items-center gap-3">
        <div className="h-1 flex-1 rounded-full bg-muted">
          <div
            className="h-1 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${steps.length > 0 ? (visibleStepCount / steps.length) * 100 : 0}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {visibleStepCount} / {steps.length}
        </span>
      </div>

      {/* Vertical timeline */}
      <div className="relative space-y-0">
        {steps.map((step, index) => {
          const isVisible = index < visibleStepCount
          const isLast = index === visibleStepCount - 1

          if (!isVisible) return null

          return (
            <div
              key={step.id}
              ref={isLast ? lastStepRef : undefined}
              className="relative pl-8 pb-6 last:pb-0"
            >
              {/* Timeline line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
              )}
              {/* Timeline dot */}
              <div className="absolute left-1 top-1.5 flex size-5 items-center justify-center rounded-full border bg-background">
                <StepDot type={step.type} />
              </div>
              {/* Timestamp */}
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date(step.timestamp).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <Badge variant="secondary" className="text-[10px]">
                  Step {step.sequence}
                </Badge>
              </div>
              {/* Step content */}
              <StepContent
                step={step}
                domainId={session.domainId}
                isVisible={isVisible}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StepDot({ type }: { type: AgentStep["type"] }) {
  const sizeClass = "size-2 rounded-full"
  switch (type) {
    case "reasoning":
      return <div className={`${sizeClass} bg-blue-500`} />
    case "tool_call":
      return <div className={`${sizeClass} bg-foreground`} />
    case "tool_result":
      return <div className={`${sizeClass} bg-muted-foreground`} />
    case "approval_request":
    case "approval_decision":
      return <div className={`${sizeClass} bg-warning`} />
    case "response":
      return <div className={`${sizeClass} bg-success`} />
    case "error":
      return <div className={`${sizeClass} bg-danger`} />
    case "escalation":
      return <div className={`${sizeClass} bg-purple-500`} />
    default:
      return <div className={`${sizeClass} bg-muted-foreground`} />
  }
}

function StepContent({
  step,
  domainId,
  isVisible,
}: {
  step: AgentStep
  domainId: string
  isVisible: boolean
}) {
  const tool = step.toolName ? lookupTool(domainId, step.toolName) : null
  const isDryRun =
    step.type === "tool_call" &&
    step.policyDecision?.allowed === false &&
    tool?.requiresApproval === true

  switch (step.type) {
    case "reasoning":
      return <ReasoningStep text={step.reasoning ?? ""} isVisible={isVisible} />

    case "tool_call":
      return (
        <ToolCallStep
          toolName={step.toolName ?? "unknown"}
          toolInput={step.toolInput}
          policyDecision={step.policyDecision}
          durationMs={step.durationMs}
          tool={tool}
          isDryRun={isDryRun}
        />
      )

    case "tool_result":
      return (
        <ToolResultStep
          toolName={step.toolName ?? "unknown"}
          toolOutput={step.toolOutput}
          redactedFields={step.redactedFields}
        />
      )

    case "approval_request":
    case "approval_decision":
      return (
        <ApprovalStep
          toolName={step.toolName}
          reasoning={step.reasoning}
          approvalStatus={step.approvalStatus}
          approver={step.approver}
          durationMs={step.durationMs}
        />
      )

    case "response":
      return <ResponseStep responseText={step.responseText ?? ""} />

    case "error":
    case "escalation":
      return <ErrorStep type={step.type} reasoning={step.reasoning} />

    default:
      return null
  }
}
