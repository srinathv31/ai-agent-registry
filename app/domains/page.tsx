import Link from "next/link"
import { Plus, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DOMAINS } from "@/lib/mock-data"
import { formatRelativeTime, formatPercent } from "@/lib/utils"

export default function DomainsPage() {
  return (
    <>
      <PageHeader title="Domain Registry" description="Registered AI agent domains">
        <Button asChild size="sm">
          <Link href="/domains/register">
            <Plus className="size-4" />
            Register New Domain
          </Link>
        </Button>
      </PageHeader>
      <div className="p-6">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tools</TableHead>
                <TableHead className="text-right">Success Rate</TableHead>
                <TableHead className="text-right">Active Agents</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {DOMAINS.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell>
                    <div>
                      <Link
                        href={`/domains/${domain.id}`}
                        className="font-medium hover:underline"
                      >
                        {domain.name}
                      </Link>
                      <p className="max-w-[300px] truncate text-xs text-muted-foreground">
                        {domain.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {domain.owner}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={domain.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {domain.tools.length}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPercent(domain.metrics.successRate)}
                  </TableCell>
                  <TableCell className="text-right">
                    {domain.metrics.activeAgents}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatRelativeTime(domain.lastActivity)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/domains/${domain.id}`}>
                        View
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </>
  )
}
