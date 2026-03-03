import { ShieldAlert, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { formatDuration } from "@/lib/utils"

interface ApprovalStepProps {
  toolName?: string
  reasoning?: string
  approvalStatus?: "pending" | "approved" | "denied"
  approver?: string
  durationMs?: number
}

export function ApprovalStep({
  toolName,
  reasoning,
  approvalStatus,
  approver,
  durationMs,
}: ApprovalStepProps) {
  return (
    <Card className="border-warning/50 bg-warning/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-warning">
        <ShieldAlert className="size-3.5" />
        Approval Request
        {toolName && (
          <code className="rounded bg-warning/10 px-1">{toolName}</code>
        )}
      </div>

      {reasoning && (
        <blockquote className="mb-3 border-l-2 border-warning/30 pl-3 text-sm italic text-muted-foreground">
          {reasoning}
        </blockquote>
      )}

      <div className="flex items-center gap-2 text-sm">
        {approvalStatus === "pending" && (
          <>
            <Loader2 className="size-4 animate-spin text-warning" />
            <span className="font-medium text-warning">Awaiting approval...</span>
          </>
        )}
        {approvalStatus === "approved" && (
          <>
            <CheckCircle className="size-4 text-success" />
            <span className="font-medium text-success">Approved</span>
            {approver && (
              <span className="text-muted-foreground">by {approver}</span>
            )}
            {durationMs != null && (
              <span className="text-muted-foreground">
                (wait: {formatDuration(durationMs)})
              </span>
            )}
          </>
        )}
        {approvalStatus === "denied" && (
          <>
            <XCircle className="size-4 text-danger" />
            <span className="font-medium text-danger">Denied</span>
            {approver && (
              <span className="text-muted-foreground">by {approver}</span>
            )}
          </>
        )}
      </div>
    </Card>
  )
}
