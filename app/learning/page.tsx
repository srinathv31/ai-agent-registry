import {
  TrendingUp,
  BookOpen,
  ArrowLeftRight,
  Target,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { MetricCard } from "@/components/shared/metric-card"
import { LearningTrendChart } from "@/components/learning/learning-trend-chart"
import { DomainLearningScores } from "@/components/learning/domain-learning-scores"
import { LearningEventsLog } from "@/components/learning/learning-events-log"
import { CrossDomainTransferMap } from "@/components/learning/cross-domain-transfer-map"
import { BeforeAfterComparisons } from "@/components/learning/before-after-comparisons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LEARNING_METRICS } from "@/lib/mock-data"

export default function LearningPage() {
  return (
    <>
      <PageHeader
        title="Cross-Domain AI Learning"
        description="How AI agents learn, self-correct, and transfer knowledge across domains"
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-4 gap-4">
          <MetricCard
            label="Accuracy Improvement"
            value={`+${LEARNING_METRICS.accuracyImprovement}%`}
            icon={TrendingUp}
          />
          <MetricCard
            label="Learning Events"
            value={LEARNING_METRICS.totalEvents}
            icon={BookOpen}
          />
          <MetricCard
            label="Cross-Domain Transfers"
            value={LEARNING_METRICS.crossDomainTransfers}
            icon={ArrowLeftRight}
          />
          <MetricCard
            label="Avg Confidence"
            value={`${LEARNING_METRICS.avgConfidence}%`}
            icon={Target}
          />
        </div>

        <Tabs defaultValue="trends">
          <TabsList>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="events">Learning Events</TabsTrigger>
            <TabsTrigger value="transfer">Knowledge Transfer</TabsTrigger>
            <TabsTrigger value="before-after">Before & After</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="mt-4 space-y-6">
            <LearningTrendChart />
            <DomainLearningScores />
          </TabsContent>
          <TabsContent value="events" className="mt-4">
            <LearningEventsLog />
          </TabsContent>
          <TabsContent value="transfer" className="mt-4">
            <CrossDomainTransferMap />
          </TabsContent>
          <TabsContent value="before-after" className="mt-4">
            <BeforeAfterComparisons />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
