"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { LEARNING_TIME_SERIES } from "@/lib/mock-data"

const chartConfig = {
  accuracy: {
    label: "Overall Accuracy",
    color: "var(--color-accent-blue)",
  },
  responseQuality: {
    label: "Response Quality",
    color: "var(--color-teal)",
  },
  toolSelectionAccuracy: {
    label: "Tool Selection",
    color: "var(--color-purple)",
  },
  escalationAccuracy: {
    label: "Escalation Accuracy",
    color: "var(--color-warning)",
  },
} satisfies ChartConfig

export function LearningTrendChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Metrics Over Time (16 weeks)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <LineChart data={LEARNING_TIME_SERIES}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[75, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value}%`}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="accuracy"
              type="monotone"
              stroke="var(--color-accuracy)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="responseQuality"
              type="monotone"
              stroke="var(--color-responseQuality)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="toolSelectionAccuracy"
              type="monotone"
              stroke="var(--color-toolSelectionAccuracy)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="escalationAccuracy"
              type="monotone"
              stroke="var(--color-escalationAccuracy)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
