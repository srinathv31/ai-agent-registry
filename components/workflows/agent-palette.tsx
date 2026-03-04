"use client"

import { useState, type DragEvent } from "react"
import { Search, GripVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PaletteAgent } from "@/lib/types"

interface AgentPaletteProps {
  agents: PaletteAgent[]
  collapsed: boolean
  onToggle: () => void
}

const DOMAIN_COLORS: Record<string, string> = {
  "Credit Cards": "bg-accent-blue/15 text-accent-blue",
  "Risk & Compliance": "bg-danger/15 text-danger",
  "Platform Operations": "bg-teal/15 text-teal",
  "Customer Intelligence": "bg-warning/15 text-warning",
}

export function AgentPalette({ agents, collapsed, onToggle }: AgentPaletteProps) {
  const [search, setSearch] = useState("")

  const filtered = search
    ? agents.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.role.toLowerCase().includes(search.toLowerCase()) ||
          a.description.toLowerCase().includes(search.toLowerCase())
      )
    : agents

  const grouped = Object.groupBy(filtered, (a) => a.domain) as Record<string, PaletteAgent[]>

  const onDragStart = (e: DragEvent, agent: PaletteAgent) => {
    e.dataTransfer.setData("application/reactflow-agent", JSON.stringify(agent))
    e.dataTransfer.effectAllowed = "move"
  }

  if (collapsed) {
    return (
      <div className="flex flex-col items-center w-10 border-r bg-card py-3 gap-2 shrink-0">
        <button
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
          title="Expand agent palette"
        >
          <GripVertical className="size-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="w-[280px] border-r bg-card flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-3 border-b space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Agent Palette</h3>
          <button
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
            title="Collapse"
          >
            <GripVertical className="size-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>
      </div>

      {/* Agent list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {Object.entries(grouped).map(([domain, domainAgents]) =>
          domainAgents.length > 0 ? (
            <div key={domain} className="space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1">
                {domain}
              </p>
              {domainAgents.map((agent) => (
                <div
                  key={agent.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, agent)}
                  className={cn(
                    "group cursor-grab active:cursor-grabbing rounded-lg border bg-background p-2.5 space-y-1.5",
                    "hover:border-accent-blue/40 hover:shadow-sm transition-all"
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <GripVertical className="size-3 text-muted-foreground/40 group-hover:text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium leading-tight">{agent.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 pl-4">
                    <Badge
                      className={cn(
                        "text-[9px] px-1 py-0",
                        DOMAIN_COLORS[agent.domain]
                      )}
                    >
                      {agent.role}
                    </Badge>
                    <span className="text-[9px] text-muted-foreground">
                      {agent.successRate}%
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-snug pl-4 line-clamp-2">
                    {agent.description}
                  </p>
                </div>
              ))}
            </div>
          ) : null
        )}
        {filtered.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            No agents match &quot;{search}&quot;
          </p>
        )}
      </div>
    </div>
  )
}
