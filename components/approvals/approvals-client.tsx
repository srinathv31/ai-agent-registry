"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Clock,
} from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { PendingApproval } from "@/lib/types"
import { cn, formatRelativeTime, formatKey, delay } from "@/lib/utils"

// ── Types ──

interface CardUIState {
  isProcessing: boolean
  showDenyForm: boolean
  decision: {
    action: "approved" | "denied"
    decidedAt: string
    decidedBy: string
    denialReason?: string
  } | null
}

interface ApprovalsClientProps {
  approvals: PendingApproval[]
}

// ── Constants ──

const DEFAULT_CARD_STATE: CardUIState = {
  isProcessing: false,
  showDenyForm: false,
  decision: null,
}

const RISK_STYLES: Record<string, string> = {
  high: "bg-danger/15 text-danger",
  medium: "bg-warning/15 text-warning",
  low: "bg-success/15 text-success",
}

const RISK_ORDER: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

// ── Main Component ──

export function ApprovalsClient({ approvals }: ApprovalsClientProps) {
  const [cardStates, setCardStates] = useState<Record<string, CardUIState>>({})

  function getState(id: string): CardUIState {
    return cardStates[id] ?? DEFAULT_CARD_STATE
  }

  function updateState(id: string, patch: Partial<CardUIState>) {
    setCardStates((prev) => ({
      ...prev,
      [id]: { ...getState(id), ...patch },
    }))
  }

  async function handleApprove(id: string) {
    updateState(id, { isProcessing: true })
    await delay(1000)
    updateState(id, {
      isProcessing: false,
      decision: {
        action: "approved",
        decidedAt: new Date().toISOString(),
        decidedBy: "ops.manager@bank.com",
      },
    })
  }

  async function handleDeny(id: string, reason: string) {
    updateState(id, { isProcessing: true, showDenyForm: false })
    await delay(1000)
    updateState(id, {
      isProcessing: false,
      decision: {
        action: "denied",
        decidedAt: new Date().toISOString(),
        decidedBy: "ops.manager@bank.com",
        denialReason: reason,
      },
    })
  }

  const sorted = useMemo(() => {
    return [...approvals].sort((a, b) => {
      const aDecided = getState(a.id).decision !== null ? 1 : 0
      const bDecided = getState(b.id).decision !== null ? 1 : 0
      if (aDecided !== bDecided) return aDecided - bDecided
      return (RISK_ORDER[a.risk] ?? 2) - (RISK_ORDER[b.risk] ?? 2)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approvals, cardStates])

  return (
    <div className="space-y-4 p-6">
      {sorted.map((approval) => (
        <ApprovalCard
          key={approval.id}
          approval={approval}
          state={getState(approval.id)}
          onApprove={() => handleApprove(approval.id)}
          onDenyClick={() => updateState(approval.id, { showDenyForm: true })}
          onDenyCancel={() => updateState(approval.id, { showDenyForm: false })}
          onDenySubmit={(reason) => handleDeny(approval.id, reason)}
        />
      ))}
    </div>
  )
}

// ── Diff Column ──

function DiffColumn({
  label,
  keys,
  current,
  proposed,
  side,
}: {
  label: string
  keys: string[]
  current: Record<string, unknown>
  proposed: Record<string, unknown>
  side: "current" | "proposed"
}) {
  return (
    <div className="rounded-lg border p-3">
      <p className="mb-2 text-xs font-medium text-muted-foreground">{label}</p>
      <dl className="space-y-1">
        {keys.map((key) => {
          const val = side === "current" ? current[key] : proposed[key]
          if (val === undefined) return null

          const isChanged = current[key] !== proposed[key]
          const highlightClass =
            side === "current"
              ? isChanged
                ? "line-through text-muted-foreground/50"
                : "text-muted-foreground"
              : isChanged
                ? "rounded bg-success/15 px-1 text-success"
                : "text-muted-foreground/60"

          return (
            <div key={key} className="flex justify-between text-sm">
              <dt className="text-muted-foreground">{formatKey(key)}</dt>
              <dd className={cn("font-mono text-xs", highlightClass)}>
                {String(val)}
              </dd>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

// ── Card Component ──

interface ApprovalCardProps {
  approval: PendingApproval
  state: CardUIState
  onApprove: () => void
  onDenyClick: () => void
  onDenyCancel: () => void
  onDenySubmit: (reason: string) => void
}

function ApprovalCard({
  approval,
  state,
  onApprove,
  onDenyClick,
  onDenyCancel,
  onDenySubmit,
}: ApprovalCardProps) {
  const [denyReason, setDenyReason] = useState("")
  const { decision, isProcessing, showDenyForm } = state

  const cardBorderClass = decision
    ? decision.action === "approved"
      ? "border-success/50 bg-success/5"
      : "border-danger/50 bg-danger/5"
    : ""

  // Gather all keys from both states
  const currentKeys = Object.keys(approval.currentState)
  const proposedKeys = Object.keys(approval.proposedState)
  const allKeys = Array.from(new Set([...currentKeys, ...proposedKeys]))

  return (
    <Card className={cn("transition-all duration-500", cardBorderClass)}>
      {/* Header */}
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardTitle>{approval.toolDisplayName}</CardTitle>
          <Badge variant="secondary">{approval.domainName}</Badge>
          <Badge className={RISK_STYLES[approval.risk]}>
            {approval.risk} risk
          </Badge>
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {formatRelativeTime(approval.requestedAt)}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Reasoning */}
        <blockquote className="border-l-2 border-warning/30 pl-3 text-sm italic text-muted-foreground">
          {approval.reasoning}
        </blockquote>

        {/* Proposed Action */}
        <div>
          <h4 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Proposed Action
          </h4>
          <p className="mb-2 text-sm">{approval.proposedAction.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(approval.proposedAction.input).map(([k, v]) => (
              <Badge key={k} variant="secondary" className="font-mono">
                {k}: {String(v)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Diff View */}
        <div>
          <h4 className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            State Diff
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <DiffColumn
              label="Current State"
              keys={allKeys}
              current={approval.currentState}
              proposed={approval.proposedState}
              side="current"
            />
            <DiffColumn
              label="Proposed State"
              keys={allKeys}
              current={approval.currentState}
              proposed={approval.proposedState}
              side="proposed"
            />
          </div>
        </div>

        {/* Dual approval indicator */}
        {approval.approvalType === "dual" && (
          <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-sm text-warning">
            <ShieldAlert className="size-4 shrink-0" />
            Dual approval required — 1 of 2 approvals needed
          </div>
        )}
      </CardContent>

      {/* Footer — decision states */}
      <CardFooter>
        {decision ? (
          decision.action === "approved" ? (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle className="size-4" />
              <span className="font-medium">Approved</span>
              <span className="text-muted-foreground">
                by {decision.decidedBy} at{" "}
                {new Date(decision.decidedAt).toLocaleTimeString()}
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-danger">
                <XCircle className="size-4" />
                <span className="font-medium">Denied</span>
                <span className="text-muted-foreground">
                  by {decision.decidedBy}
                </span>
              </div>
              {decision.denialReason && (
                <p className="pl-6 text-sm text-muted-foreground">
                  {decision.denialReason}
                </p>
              )}
            </div>
          )
        ) : showDenyForm ? (
          <div className="flex w-full flex-col gap-2">
            <Textarea
              placeholder="Reason for denial..."
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              className="min-h-[60px]"
            />
            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                disabled={denyReason.trim().length === 0 || isProcessing}
                onClick={() => {
                  onDenySubmit(denyReason.trim())
                  setDenyReason("")
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Submit Denial"
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={onDenyCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/sessions/${approval.sessionId}`}>
                View Full Session
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isProcessing}
                onClick={onDenyClick}
              >
                Deny
              </Button>
              <Button
                size="sm"
                className="bg-success text-white hover:bg-success/90"
                disabled={isProcessing}
                onClick={onApprove}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Approve"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
