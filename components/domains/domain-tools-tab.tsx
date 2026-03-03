"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { ModeBadge } from "@/components/shared/mode-badge"
import { DataClassificationBadge } from "@/components/shared/data-classification-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn, formatPercent } from "@/lib/utils"
import type { Tool } from "@/lib/types"

const statusDot: Record<string, string> = {
  healthy: "bg-success",
  degraded: "bg-warning",
  down: "bg-danger",
}

export function DomainToolsTab({ tools }: { tools: Tool[] }) {
  const [expandedTool, setExpandedTool] = useState<string | null>(null)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8" />
          <TableHead>Tool Name</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Classification</TableHead>
          <TableHead>Approval</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Success Rate</TableHead>
          <TableHead className="text-right">Avg Latency</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tools.map((tool) => {
          const isExpanded = expandedTool === tool.name
          return (
            <>
              <TableRow
                key={tool.name}
                className="cursor-pointer"
                onClick={() => setExpandedTool(isExpanded ? null : tool.name)}
              >
                <TableCell>
                  {isExpanded ? (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{tool.displayName}</TableCell>
                <TableCell>
                  <ModeBadge mode={tool.mode} />
                </TableCell>
                <TableCell>
                  <DataClassificationBadge classification={tool.dataClassification} />
                </TableCell>
                <TableCell>
                  {tool.requiresApproval ? (
                    <Badge variant="outline" className="bg-warning/15 text-warning border-warning/25">
                      Required
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={cn("size-2 rounded-full", statusDot[tool.status] ?? "bg-muted")} />
                    <span className="capitalize">{tool.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{formatPercent(tool.successRate)}</TableCell>
                <TableCell className="text-right">{tool.avgLatencyMs}ms</TableCell>
              </TableRow>
              {isExpanded && (
                <TableRow key={`${tool.name}-detail`}>
                  <TableCell colSpan={8} className="bg-muted/30 p-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Description</p>
                          <p className="text-sm">{tool.description}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Endpoint</p>
                          <p className="text-sm font-mono">{tool.method} {tool.endpoint}</p>
                        </div>
                        <div className="flex gap-6">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Auth</p>
                            <p className="text-sm">{tool.auth}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Dry Run</p>
                            <p className="text-sm">{tool.dryRunSupported ? "Supported" : "Not supported"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Input Schema</p>
                          <pre className="mt-1 max-h-40 overflow-auto rounded-md border bg-background p-3 text-xs">
                            {JSON.stringify(tool.inputSchema, null, 2)}
                          </pre>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Output Schema</p>
                          <pre className="mt-1 max-h-40 overflow-auto rounded-md border bg-background p-3 text-xs">
                            {JSON.stringify(tool.outputSchema, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )
        })}
      </TableBody>
    </Table>
  )
}
