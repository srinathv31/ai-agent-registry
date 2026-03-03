"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { AGENT_ACTIVITY_CHART_DATA } from "@/lib/mock-data"

const chartConfig = {
  creditCard: {
    label: "Credit Card Servicing",
    color: "var(--color-accent-blue)",
  },
  prodSupport: {
    label: "Production Support",
    color: "var(--color-teal)",
  },
} satisfies ChartConfig

export function AgentActivityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Activity (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={AGENT_ACTIVITY_CHART_DATA}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.replace(/ (AM|PM)/, "")}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="creditCard"
              type="monotone"
              fill="var(--color-creditCard)"
              fillOpacity={0.15}
              stroke="var(--color-creditCard)"
              strokeWidth={2}
            />
            <Area
              dataKey="prodSupport"
              type="monotone"
              fill="var(--color-prodSupport)"
              fillOpacity={0.15}
              stroke="var(--color-prodSupport)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
