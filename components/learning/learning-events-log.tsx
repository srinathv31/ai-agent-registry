"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight } from "lucide-react"
import { LEARNING_EVENTS } from "@/lib/mock-data"
import { cn, formatRelativeTime } from "@/lib/utils"
import type { LearningEvent } from "@/lib/types"

const CATEGORY_STYLES: Record<string, string> = {
  response_quality: "bg-accent-blue/15 text-accent-blue",
  tool_selection: "bg-teal/15 text-teal",
  escalation_accuracy: "bg-purple/15 text-purple",
  resolution_speed: "bg-success/15 text-success",
}

const CATEGORY_LABELS: Record<string, string> = {
  response_quality: "Response Quality",
  tool_selection: "Tool Selection",
  escalation_accuracy: "Escalation Accuracy",
  resolution_speed: "Resolution Speed",
}

const TYPE_LABELS: Record<string, string> = {
  pattern_learned: "Pattern Learned",
  self_correction: "Self-Correction",
  cross_domain_transfer: "Cross-Domain",
  threshold_adjustment: "Threshold Adj.",
}

export function LearningEventsLog() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [domainFilter, setDomainFilter] = useState<string>("all")

  const categories = Object.keys(CATEGORY_LABELS)

  const filtered = useMemo(() => {
    return LEARNING_EVENTS.filter((e) => {
      if (activeCategory && e.category !== activeCategory) return false
      if (
        domainFilter !== "all" &&
        e.sourceDomain !== domainFilter &&
        e.targetDomain !== domainFilter
      )
        return false
      return true
    })
  }, [activeCategory, domainFilter])

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant={activeCategory === null ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => setActiveCategory(null)}
        >
          All
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={activeCategory === cat ? "default" : "secondary"}
            className={cn(
              "cursor-pointer",
              activeCategory !== cat && CATEGORY_STYLES[cat]
            )}
            onClick={() =>
              setActiveCategory(cat === activeCategory ? null : cat)
            }
          >
            {CATEGORY_LABELS[cat]}
          </Badge>
        ))}
        <div className="ml-auto">
          <Select value={domainFilter} onValueChange={setDomainFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All Domains" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              <SelectItem value="Credit Card Servicing">
                Credit Card Servicing
              </SelectItem>
              <SelectItem value="Production Support">
                Production Support
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events list */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filtered.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No events match the current filters.
          </p>
        )}
      </div>
    </div>
  )
}

function EventCard({ event }: { event: LearningEvent }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={CATEGORY_STYLES[event.category]}>
                {CATEGORY_LABELS[event.category]}
              </Badge>
              <Badge variant="secondary">{TYPE_LABELS[event.type]}</Badge>
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(event.timestamp)}
              </span>
            </div>
            <p className="text-sm font-medium">{event.title}</p>
            <p className="text-sm text-muted-foreground">
              {event.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                {event.sourceDomain}
                {event.sourceDomain !== event.targetDomain && (
                  <>
                    <ArrowRight className="size-3" />
                    {event.targetDomain}
                  </>
                )}
              </span>
              <span>Confidence: {event.confidence}%</span>
            </div>
          </div>
          <Badge
            className={cn(
              "shrink-0 text-sm font-semibold",
              event.impactValue >= 30
                ? "bg-success/15 text-success"
                : "bg-accent-blue/15 text-accent-blue"
            )}
          >
            {event.impact}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
