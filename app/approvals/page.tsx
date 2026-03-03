import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { ApprovalsClient } from "@/components/approvals/approvals-client"
import { PENDING_APPROVALS } from "@/lib/mock-data"

export default function ApprovalsPage() {
  return (
    <>
      <PageHeader title="Pending Approvals" description="Review and action AI agent approval requests">
        <Badge variant="outline" className="border-warning text-warning">
          {PENDING_APPROVALS.length} pending
        </Badge>
      </PageHeader>
      <ApprovalsClient approvals={PENDING_APPROVALS} />
    </>
  )
}
