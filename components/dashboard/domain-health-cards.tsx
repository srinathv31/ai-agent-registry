"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/status-badge"
import { KillSwitch } from "@/components/shared/kill-switch"
import { DOMAINS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export function DomainHealthCards() {
  const [domainStates, setDomainStates] = useState<Record<string, boolean>>(
    Object.fromEntries(DOMAINS.map((d) => [d.id, d.status === "active"]))
  )

  function handleToggle(domainId: string, newState: boolean) {
    setDomainStates((prev) => ({ ...prev, [domainId]: newState }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain Health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {DOMAINS.map((domain) => {
          const isActive = domainStates[domain.id]
          const healthyTools = domain.tools.filter((t) => t.status === "healthy").length
          const totalTools = domain.tools.length

          return (
            <div
              key={domain.id}
              className={cn(
                "rounded-lg border p-4 transition-opacity",
                !isActive && "opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium">{domain.name}</h3>
                  <StatusBadge status={isActive ? "active" : "disabled"} />
                </div>
                <KillSwitch
                  domainName={domain.name}
                  isActive={isActive}
                  onToggle={(newState) => handleToggle(domain.id, newState)}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Active Agents</p>
                  <p className="font-medium">{domain.metrics.activeAgents}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pending Approvals</p>
                  <p className="font-medium">{domain.metrics.pendingApprovals}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tool Health</p>
                  <p className="font-medium">
                    {healthyTools}/{totalTools} healthy
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
