import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const modeConfig: Record<string, { label: string; className: string }> = {
  read: { label: "Read", className: "bg-blue-500/15 text-blue-600 border-blue-500/25 dark:text-blue-400" },
  write: { label: "Write", className: "bg-warning/15 text-warning border-warning/25" },
}

export function ModeBadge({ mode }: { mode: string }) {
  const config = modeConfig[mode] ?? {
    label: mode,
    className: "bg-muted text-muted-foreground border-border",
  }

  return (
    <Badge variant="outline" className={cn(config.className)}>
      {config.label}
    </Badge>
  )
}
