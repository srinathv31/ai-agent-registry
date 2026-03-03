"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface JsonViewerProps {
  data: Record<string, unknown>
  redactedFields?: string[]
  defaultExpanded?: boolean
}

export function JsonViewer({ data, redactedFields = [], defaultExpanded = false }: JsonViewerProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const jsonString = JSON.stringify(data, null, 2)
  const lines = jsonString.split("\n")

  return (
    <div className="rounded-md border bg-muted/50 font-mono text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-1 px-3 py-1.5 text-muted-foreground hover:text-foreground"
      >
        {expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        <span>{expanded ? "Collapse" : "Expand"} JSON</span>
      </button>
      {expanded && (
        <pre className="overflow-x-auto border-t px-3 py-2 leading-relaxed">
          {lines.map((line, i) => {
            const isRedacted = redactedFields.some((field) => line.includes(`"${field}"`))
            return (
              <div key={i} className={cn(isRedacted && "rounded bg-danger/10 px-1")}>
                {isRedacted ? (
                  <>
                    {line.split(":")[0]}:{" "}
                    <span className="inline-flex items-center rounded bg-danger/20 px-1.5 py-0.5 text-[10px] font-semibold text-danger">
                      REDACTED
                    </span>
                  </>
                ) : (
                  line
                )}
              </div>
            )
          })}
        </pre>
      )}
    </div>
  )
}
