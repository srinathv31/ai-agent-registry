import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/15 text-success border-success/25" },
  healthy: { label: "Healthy", className: "bg-success/15 text-success border-success/25" },
  sandbox: { label: "Sandbox", className: "bg-warning/15 text-warning border-warning/25" },
  degraded: { label: "Degraded", className: "bg-warning/15 text-warning border-warning/25" },
  disabled: { label: "Disabled", className: "bg-muted text-muted-foreground border-border" },
  down: { label: "Down", className: "bg-danger/15 text-danger border-danger/25" },
}

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  }

  return (
    <Badge variant="outline" className={cn(config.className)}>
      {config.label}
    </Badge>
  )
}
