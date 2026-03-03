import { Activity, Clock, CheckCircle, Users } from "lucide-react"
import { MetricCard } from "@/components/shared/metric-card"
import { DASHBOARD_METRICS } from "@/lib/mock-data"
import { formatNumber, formatPercent } from "@/lib/utils"

export function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <MetricCard
        label="Total Sessions"
        value={formatNumber(DASHBOARD_METRICS.totalAgentSessions)}
        trend={DASHBOARD_METRICS.sessionsTrend}
        icon={Activity}
      />
      <MetricCard
        label="Avg Resolution Time"
        value={DASHBOARD_METRICS.avgResolutionTime}
        trend={DASHBOARD_METRICS.resolutionTrend}
        trendInverted
        icon={Clock}
      />
      <MetricCard
        label="Approval Rate"
        value={formatPercent(DASHBOARD_METRICS.approvalRate)}
        trend={DASHBOARD_METRICS.approvalTrend}
        icon={CheckCircle}
      />
      <MetricCard
        label="Active Agents"
        value={DASHBOARD_METRICS.activeAgents}
        trend={DASHBOARD_METRICS.activeTrend}
        icon={Users}
      />
    </div>
  )
}
