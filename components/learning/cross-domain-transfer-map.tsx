"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeftRight } from "lucide-react"
import { CROSS_DOMAIN_TRANSFERS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function CrossDomainTransferMap() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      {/* Visual domain map */}
      <div className="flex items-center justify-center gap-0">
        {/* Source domain card */}
        <Card className="w-[280px] shrink-0">
          <CardContent className="pt-5 pb-5 text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-accent-blue/15">
              <span className="text-xl font-bold text-accent-blue">CC</span>
            </div>
            <p className="text-sm font-semibold">Credit Card Servicing</p>
            <p className="text-xs text-muted-foreground">
              2 patterns exported, 1 imported
            </p>
          </CardContent>
        </Card>

        {/* Bidirectional arrows */}
        <div
          className={cn(
            "flex flex-col items-center gap-2 px-4 transition-all duration-700",
            visible ? "opacity-100 w-[200px]" : "opacity-0 w-0"
          )}
        >
          {CROSS_DOMAIN_TRANSFERS.map((transfer) => (
            <div key={transfer.id} className="flex items-center gap-1.5">
              {transfer.sourceDomain === "Credit Card Servicing" ? (
                <>
                  <div className="h-px w-12 bg-accent-blue" />
                  <div className="size-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-accent-blue" />
                </>
              ) : (
                <>
                  <div className="size-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-teal" />
                  <div className="h-px w-12 bg-teal" />
                </>
              )}
              <span className="text-[10px] text-muted-foreground whitespace-nowrap mx-1">
                {transfer.patternName}
              </span>
              {transfer.sourceDomain === "Credit Card Servicing" ? (
                <>
                  <div className="h-px w-12 bg-accent-blue" />
                  <div className="size-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-accent-blue" />
                </>
              ) : (
                <>
                  <div className="size-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-teal" />
                  <div className="h-px w-12 bg-teal" />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Target domain card */}
        <Card className="w-[280px] shrink-0">
          <CardContent className="pt-5 pb-5 text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-teal/15">
              <span className="text-xl font-bold text-teal">PS</span>
            </div>
            <p className="text-sm font-semibold">Production Support</p>
            <p className="text-xs text-muted-foreground">
              1 pattern exported, 2 imported
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detail cards */}
      <div className="space-y-3">
        {CROSS_DOMAIN_TRANSFERS.map((transfer) => (
          <Card key={transfer.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ArrowLeftRight className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">
                  {transfer.patternName}
                </CardTitle>
                <Badge
                  className={cn(
                    transfer.status === "active"
                      ? "bg-success/15 text-success"
                      : "bg-warning/15 text-warning"
                  )}
                >
                  {transfer.status}
                </Badge>
                <Badge className="ml-auto bg-success/15 text-success text-sm font-semibold">
                  +{transfer.accuracyGain}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {transfer.description}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">{transfer.sourceDomain}</Badge>
                <ArrowLeftRight className="size-3" />
                {transfer.targetDomains.map((td) => (
                  <Badge key={td} variant="secondary">
                    {td}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
