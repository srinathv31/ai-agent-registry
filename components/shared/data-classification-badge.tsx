import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const classificationConfig: Record<string, { label: string; className: string }> = {
  PCI: { label: "PCI", className: "bg-danger/15 text-danger border-danger/25" },
  PII: { label: "PII", className: "bg-warning/15 text-warning border-warning/25" },
  CONFIDENTIAL: { label: "Confidential", className: "bg-purple-500/15 text-purple-600 border-purple-500/25 dark:text-purple-400" },
  PUBLIC: { label: "Public", className: "bg-success/15 text-success border-success/25" },
}

export function DataClassificationBadge({ classification }: { classification: string }) {
  const config = classificationConfig[classification] ?? {
    label: classification,
    className: "bg-muted text-muted-foreground border-border",
  }

  return (
    <Badge variant="outline" className={cn(config.className)}>
      {config.label}
    </Badge>
  )
}
