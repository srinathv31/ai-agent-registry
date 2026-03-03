"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ACTIVITY_FEED_ITEMS } from "@/lib/mock-data"
import { cn, formatRelativeTime, randomBetween } from "@/lib/utils"
import type { ActivityFeedItem } from "@/lib/types"

const severityIcons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
}

const severityColors = {
  success: "text-success",
  warning: "text-warning",
  error: "text-danger",
  info: "text-accent-blue",
}

const feedTemplates: Omit<ActivityFeedItem, "id" | "timestamp">[] = [
  { type: "session_completed", domainName: "Credit Card Servicing", message: "Agent completed session: Balance inquiry for account ****8391", severity: "success" },
  { type: "tool_called", domainName: "Production Support", message: "Tool called: getDynatraceSnapshot for payment-gateway", severity: "info" },
  { type: "session_started", domainName: "Credit Card Servicing", message: "Agent started: Card status inquiry from alex.thompson", severity: "info" },
  { type: "session_completed", domainName: "Production Support", message: "Agent completed session: CPU alert on auth-service — scaled up", severity: "success" },
  { type: "tool_called", domainName: "Credit Card Servicing", message: "Tool called: getShipmentStatus for account ****2847", severity: "info" },
  { type: "session_started", domainName: "Production Support", message: "Agent started: Webhook alert — memory spike on cache-service", severity: "warning" },
  { type: "session_completed", domainName: "Credit Card Servicing", message: "Agent completed session: Payment date inquiry for account ****6103", severity: "success" },
  { type: "session_failed", domainName: "Production Support", message: "Agent session failed: Timeout connecting to Datadog API", severity: "error" },
]

export function LiveFeed() {
  const [items, setItems] = useState<ActivityFeedItem[]>(ACTIVITY_FEED_ITEMS)
  const [newestId, setNewestId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef(100)

  const addItem = useCallback(() => {
    const template = feedTemplates[Math.floor(Math.random() * feedTemplates.length)]
    const newItem: ActivityFeedItem = {
      ...template,
      id: `feed-gen-${counterRef.current++}`,
      timestamp: new Date().toISOString(),
    }

    setItems((prev) => [newItem, ...prev].slice(0, 50))
    setNewestId(newItem.id)

    // Clear highlight after 2s
    setTimeout(() => {
      setNewestId((current) => (current === newItem.id ? null : current))
    }, 2000)
  }, [])

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    function scheduleNext() {
      timeoutId = setTimeout(() => {
        addItem()
        scheduleNext()
      }, randomBetween(3000, 8000))
    }

    scheduleNext()
    return () => clearTimeout(timeoutId)
  }, [addItem])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [items])

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Live Activity Feed
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div ref={scrollRef} className="h-[400px] space-y-1 overflow-y-auto pr-2">
          {items.map((item) => {
            const Icon = severityIcons[item.severity]
            const isNew = item.id === newestId

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-2 rounded-md px-2 py-1.5 transition-colors",
                  isNew && "animate-pulse bg-accent"
                )}
              >
                <Icon className={cn("mt-0.5 size-4 shrink-0", severityColors[item.severity])} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-tight">{item.message}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.domainName}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(item.timestamp)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
