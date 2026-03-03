"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SessionStatusBadge } from "@/components/shared/session-status-badge"
import { AGENT_SESSIONS, DOMAINS } from "@/lib/mock-data"
import { formatRelativeTime, formatDuration, cn } from "@/lib/utils"

const STATUSES = [
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "awaiting_approval", label: "Awaiting" },
  { value: "escalated", label: "Escalated" },
] as const

const TRIGGERS = [
  { value: "user_chat", label: "User Chat" },
  { value: "webhook", label: "Webhook" },
  { value: "scheduled", label: "Scheduled" },
] as const

const TIME_RANGES = [
  { value: "all", label: "All Time" },
  { value: "1h", label: "Last Hour" },
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
] as const

function getTimeRangeMs(range: string): number {
  switch (range) {
    case "1h": return 60 * 60 * 1000
    case "24h": return 24 * 60 * 60 * 1000
    case "7d": return 7 * 24 * 60 * 60 * 1000
    default: return Infinity
  }
}

export function SessionsListClient() {
  const [domainFilter, setDomainFilter] = useState<string>("all")
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set())
  const [triggerFilters, setTriggerFilters] = useState<Set<string>>(new Set())
  const [timeRange, setTimeRange] = useState("all")

  function toggleFilter(set: Set<string>, value: string, setter: (s: Set<string>) => void) {
    const next = new Set(set)
    if (next.has(value)) {
      next.delete(value)
    } else {
      next.add(value)
    }
    setter(next)
  }

  const filtered = useMemo(() => {
    const now = Date.now()
    const rangeMs = getTimeRangeMs(timeRange)

    return AGENT_SESSIONS.filter((s) => {
      if (domainFilter !== "all" && s.domainId !== domainFilter) return false
      if (statusFilters.size > 0 && !statusFilters.has(s.status)) return false
      if (triggerFilters.size > 0 && !triggerFilters.has(s.trigger)) return false
      if (rangeMs !== Infinity) {
        const age = now - new Date(s.startedAt).getTime()
        if (age > rangeMs) return false
      }
      return true
    })
  }, [domainFilter, statusFilters, triggerFilters, timeRange])

  return (
    <div className="space-y-4 p-6">
      {/* Filter bar */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Domain dropdown */}
          <Select value={domainFilter} onValueChange={setDomainFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Domains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {DOMAINS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status chips */}
          <div className="flex items-center gap-1.5">
            {STATUSES.map(({ value, label }) => (
              <Badge
                key={value}
                variant="outline"
                className={cn(
                  "cursor-pointer select-none transition-colors",
                  statusFilters.has(value)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => toggleFilter(statusFilters, value, setStatusFilters)}
              >
                {label}
              </Badge>
            ))}
          </div>

          <div className="h-5 w-px bg-border" />

          {/* Trigger chips */}
          <div className="flex items-center gap-1.5">
            {TRIGGERS.map(({ value, label }) => (
              <Badge
                key={value}
                variant="outline"
                className={cn(
                  "cursor-pointer select-none transition-colors",
                  triggerFilters.has(value)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => toggleFilter(triggerFilters, value, setTriggerFilters)}
              >
                {label}
              </Badge>
            ))}
          </div>

          <div className="h-5 w-px bg-border" />

          {/* Time range */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_RANGES.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Sessions table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Trigger</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead className="max-w-[200px]">Summary</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                  No sessions match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((session) => {
                const durationMs = session.completedAt
                  ? new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()
                  : Date.now() - new Date(session.startedAt).getTime()

                return (
                  <TableRow key={session.id}>
                    <TableCell className="font-mono text-xs">{session.id}</TableCell>
                    <TableCell className="text-muted-foreground">{session.domainName}</TableCell>
                    <TableCell>
                      <SessionStatusBadge status={session.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground capitalize">
                      {session.trigger.replace("_", " ")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{session.userId}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatRelativeTime(session.startedAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDuration(durationMs)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {session.steps.length}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {session.summary}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/sessions/${session.id}`}>
                          View
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
