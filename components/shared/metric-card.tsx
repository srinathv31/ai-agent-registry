import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"

interface MetricCardProps {
  label: string
  value: string | number
  trend?: number
  trendInverted?: boolean
  icon: LucideIcon
}

export function MetricCard({ label, value, trend, trendInverted = false, icon: Icon }: MetricCardProps) {
  const isPositive = trend !== undefined && trend > 0
  const isNegative = trend !== undefined && trend < 0
  const isNeutral = trend === undefined || trend === 0

  // For inverted metrics (like resolution time), down is good
  const trendIsGood = trendInverted ? isNegative : isPositive
  const trendIsBad = trendInverted ? isPositive : isNegative

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
          </div>
          <div className="rounded-lg bg-muted p-2.5">
            <Icon className="size-5 text-muted-foreground" />
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-3 flex items-center gap-1 text-sm">
            {isNeutral ? (
              <Minus className="size-4 text-muted-foreground" />
            ) : trendIsGood ? (
              <TrendingUp className="size-4 text-success" />
            ) : (
              <TrendingDown className="size-4 text-danger" />
            )}
            <span
              className={cn(
                "font-medium",
                isNeutral && "text-muted-foreground",
                trendIsGood && "text-success",
                trendIsBad && "text-danger"
              )}
            >
              {isNeutral ? "No change" : `${Math.abs(trend)}%`}
            </span>
            <span className="text-muted-foreground">vs last week</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
