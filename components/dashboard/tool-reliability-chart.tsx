"use client"

import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { TOOL_RELIABILITY_CHART_DATA } from "@/lib/mock-data"

const chartConfig = {
  successRate: {
    label: "Success Rate",
    color: "var(--color-success)",
  },
} satisfies ChartConfig

function getBarColor(rate: number): string {
  if (rate >= 98) return "var(--color-success)"
  if (rate >= 95) return "var(--color-warning)"
  return "var(--color-danger)"
}

export function ToolReliabilityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tool Reliability</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={TOOL_RELIABILITY_CHART_DATA} layout="vertical">
            <XAxis
              type="number"
              domain={[90, 100]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              dataKey="tool"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={140}
              className="text-xs"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value}%`, "Success Rate"]}
                />
              }
            />
            <Bar dataKey="successRate" radius={[0, 4, 4, 0]}>
              {TOOL_RELIABILITY_CHART_DATA.map((entry) => (
                <Cell key={entry.tool} fill={getBarColor(entry.successRate)} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
