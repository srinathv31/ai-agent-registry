import { AlertTriangle, ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ErrorStepProps {
  type: "error" | "escalation"
  reasoning?: string
}

export function ErrorStep({ type, reasoning }: ErrorStepProps) {
  const isEscalation = type === "escalation"

  return (
    <Card
      className={
        isEscalation
          ? "border-purple-500/50 bg-purple-50/50 p-4 dark:bg-purple-950/20"
          : "border-danger/50 bg-danger/5 p-4"
      }
    >
      <div
        className={`mb-2 flex items-center gap-2 text-xs font-medium ${
          isEscalation ? "text-purple-600 dark:text-purple-400" : "text-danger"
        }`}
      >
        {isEscalation ? (
          <ArrowUpRight className="size-3.5" />
        ) : (
          <AlertTriangle className="size-3.5" />
        )}
        {isEscalation ? "Escalation" : "Error"}
      </div>
      {reasoning && (
        <p className="text-sm leading-relaxed">{reasoning}</p>
      )}
    </Card>
  )
}
