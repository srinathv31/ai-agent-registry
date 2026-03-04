import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DOMAIN_LEARNING_SCORES } from "@/lib/mock-data"

const CATEGORY_LABELS: Record<string, string> = {
  response_quality: "Response Quality",
  tool_selection: "Tool Selection",
  escalation_accuracy: "Escalation Accuracy",
  resolution_speed: "Resolution Speed",
}

export function DomainLearningScores() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {DOMAIN_LEARNING_SCORES.map((domain) => (
        <Card key={domain.domain}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{domain.domain}</CardTitle>
              <div className="flex items-center gap-1 text-sm font-medium text-success">
                <TrendingUp className="size-4" />
                +{domain.improvement}%
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-medium">{domain.accuracyCurrent}%</span>
              </div>
              <div className="relative h-2 rounded-full bg-muted">
                {/* Before marker */}
                <div
                  className="absolute top-0 h-2 rounded-full bg-muted-foreground/30"
                  style={{ width: `${domain.accuracyBefore}%` }}
                />
                {/* Current */}
                <div
                  className="absolute top-0 h-2 rounded-full bg-accent-blue transition-all duration-700"
                  style={{ width: `${domain.accuracyCurrent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Before: {domain.accuracyBefore}%</span>
                <span>Current: {domain.accuracyCurrent}%</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{domain.totalEvents} learning events</span>
              <Badge variant="secondary">
                Top: {CATEGORY_LABELS[domain.topCategory] ?? domain.topCategory}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
