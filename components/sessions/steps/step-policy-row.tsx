import { CheckCircle, AlertTriangle } from "lucide-react"

interface StepPolicyRowProps {
  allowed: boolean
  reason: string
  scope: string
  ruleId: string
}

export function StepPolicyRow({ allowed, reason, scope, ruleId }: StepPolicyRowProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {allowed ? (
        <CheckCircle className="size-3.5 text-success" />
      ) : (
        <AlertTriangle className="size-3.5 text-warning" />
      )}
      <span className={allowed ? "text-success" : "text-warning"}>{reason}</span>
      <span className="text-muted-foreground">
        scope: <code className="rounded bg-muted px-1">{scope}</code>
      </span>
      <span className="text-muted-foreground">
        rule: <code className="rounded bg-muted px-1">{ruleId}</code>
      </span>
    </div>
  )
}
