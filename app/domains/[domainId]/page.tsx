import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Activity,
  CheckCircle,
  Clock,
  ShieldAlert,
  Settings,
  Power,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { MetricCard } from "@/components/shared/metric-card"
import { DomainToolsTab } from "@/components/domains/domain-tools-tab"
import { DomainConfigTab } from "@/components/domains/domain-config-tab"
import { DomainPoliciesTab } from "@/components/domains/domain-policies-tab"
import { DomainActivityTab } from "@/components/domains/domain-activity-tab"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DOMAINS, AGENT_SESSIONS } from "@/lib/mock-data"
import { formatPercent, formatNumber } from "@/lib/utils"

export default async function DomainDetailPage(props: {
  params: Promise<{ domainId: string }>
}) {
  const { domainId } = await props.params

  const domain = DOMAINS.find((d) => d.id === domainId)
  if (!domain) notFound()

  const sessions = AGENT_SESSIONS.filter((s) => s.domainId === domainId)

  return (
    <>
      <PageHeader title={domain.name}>
        <div className="flex items-center gap-2">
          <nav className="mr-4 text-sm text-muted-foreground">
            <Link href="/domains" className="hover:text-foreground">
              Domains
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{domain.name}</span>
          </nav>
          <Button variant="outline" size="sm">
            <Settings className="size-4" />
            Edit Config
          </Button>
          <Button variant="outline" size="sm">
            <Power className="size-4" />
            Disable Domain
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="Total Sessions"
            value={formatNumber(domain.metrics.totalSessions)}
            icon={Activity}
          />
          <MetricCard
            label="Success Rate"
            value={formatPercent(domain.metrics.successRate)}
            icon={CheckCircle}
          />
          <MetricCard
            label="Avg Resolution Time"
            value={domain.metrics.avgResolutionTime}
            icon={Clock}
            trendInverted
          />
          <MetricCard
            label="Pending Approvals"
            value={domain.metrics.pendingApprovals}
            icon={ShieldAlert}
          />
        </div>

        <Tabs defaultValue="tools">
          <TabsList>
            <TabsTrigger value="tools">Tools ({domain.tools.length})</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="activity">Activity ({sessions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="mt-4">
            <DomainToolsTab tools={domain.tools} />
          </TabsContent>
          <TabsContent value="config" className="mt-4">
            <DomainConfigTab config={domain.config} />
          </TabsContent>
          <TabsContent value="policies" className="mt-4">
            <DomainPoliciesTab policies={domain.config.policies} />
          </TabsContent>
          <TabsContent value="activity" className="mt-4">
            <DomainActivityTab sessions={sessions} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
