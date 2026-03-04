"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BEFORE_AFTER_COMPARISONS } from "@/lib/mock-data"
import { cn, formatKey } from "@/lib/utils"

export function BeforeAfterComparisons() {
  return (
    <div className="space-y-6">
      {BEFORE_AFTER_COMPARISONS.map((comparison) => {
        const metricKeys = Object.keys(comparison.beforeMetrics)
        return (
          <Card key={comparison.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{comparison.title}</CardTitle>
                <Badge variant="secondary">{comparison.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {comparison.scenario}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Response comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-danger/20 bg-danger/5 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-danger">
                    Before Learning
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {comparison.beforeResponse}
                  </p>
                </div>
                <div className="rounded-lg border border-success/20 bg-success/5 p-4">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-success">
                    After Learning
                  </p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {comparison.afterResponse}
                  </p>
                </div>
              </div>

              {/* Metrics comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Before Metrics
                  </p>
                  <dl className="space-y-1">
                    {metricKeys.map((key) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm"
                      >
                        <dt className="text-muted-foreground">
                          {formatKey(key)}
                        </dt>
                        <dd className="font-mono text-xs text-muted-foreground">
                          {comparison.beforeMetrics[key]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    After Metrics
                  </p>
                  <dl className="space-y-1">
                    {metricKeys.map((key) => {
                      const before = comparison.beforeMetrics[key]
                      const after = comparison.afterMetrics[key]
                      const improved = after > before
                      return (
                        <div
                          key={key}
                          className="flex justify-between text-sm"
                        >
                          <dt className="text-muted-foreground">
                            {formatKey(key)}
                          </dt>
                          <dd
                            className={cn(
                              "font-mono text-xs",
                              improved
                                ? "rounded bg-success/15 px-1 text-success"
                                : "rounded bg-danger/15 px-1 text-danger"
                            )}
                          >
                            {after}
                          </dd>
                        </div>
                      )
                    })}
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
