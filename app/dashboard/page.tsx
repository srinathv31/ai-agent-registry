import { PageHeader } from "@/components/layout/page-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { AgentActivityChart } from "@/components/dashboard/agent-activity-chart"
import { ToolReliabilityChart } from "@/components/dashboard/tool-reliability-chart"
import { LiveFeed } from "@/components/dashboard/live-feed"
import { DomainHealthCards } from "@/components/dashboard/domain-health-cards"

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Control Room Overview"
        description="Real-time monitoring of AI agent operations"
      />
      <div className="space-y-6 p-6">
        <StatsCards />

        <div className="grid grid-cols-2 gap-6">
          <AgentActivityChart />
          <ToolReliabilityChart />
        </div>

        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <LiveFeed />
          </div>
          <div className="col-span-2">
            <DomainHealthCards />
          </div>
        </div>
      </div>
    </>
  )
}
