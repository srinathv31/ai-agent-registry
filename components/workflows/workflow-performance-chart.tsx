"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { WorkflowTemplate } from "@/lib/types"

interface WorkflowPerformanceChartProps {
  workflow: WorkflowTemplate
}

const chartConfig = {
  successRate: {
    label: "Success Rate",
    color: "var(--color-accent-blue)",
  },
} satisfies ChartConfig

export function WorkflowPerformanceChart({
  workflow,
}: WorkflowPerformanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Success Rate (12 weeks)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart data={workflow.weeklyPerformance}>
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
              domain={["dataMin - 2", "dataMax + 1"]}
              tickFormatter={(v) => `${v}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value}%`}
                />
              }
            />
            <Line
              dataKey="successRate"
              type="monotone"
              stroke="var(--color-successRate)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
