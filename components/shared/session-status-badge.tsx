import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const sessionStatusConfig: Record<string, { label: string; className: string }> = {
  running: {
    label: "Running",
    className: "bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400",
  },
  completed: {
    label: "Completed",
    className: "bg-success/15 text-success border-success/25",
  },
  failed: {
    label: "Failed",
    className: "bg-danger/15 text-danger border-danger/25",
  },
  awaiting_approval: {
    label: "Awaiting Approval",
    className: "bg-warning/15 text-warning border-warning/25",
  },
  escalated: {
    label: "Escalated",
    className: "bg-purple-500/15 text-purple-600 border-purple-500/25 dark:text-purple-400",
  },
}

export function SessionStatusBadge({ status }: { status: string }) {
  const config = sessionStatusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  }

  const hasPulse = status === "running" || status === "awaiting_approval"

  return (
    <Badge variant="outline" className={cn("gap-1.5", config.className)}>
      {hasPulse && (
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-current" />
        </span>
      )}
      {config.label}
    </Badge>
  )
}
