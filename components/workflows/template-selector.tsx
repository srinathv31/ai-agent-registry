"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { WorkflowTemplate } from "@/lib/types"

interface TemplateSelectorProps {
  templates: WorkflowTemplate[]
  selectedId: string | null
  onSelect: (templateId: string) => void
}

export function TemplateSelector({ templates, selectedId, onSelect }: TemplateSelectorProps) {
  return (
    <Select value={selectedId ?? ""} onValueChange={onSelect}>
      <SelectTrigger className="w-[260px] h-8 text-xs">
        <SelectValue placeholder="Load a template..." />
      </SelectTrigger>
      <SelectContent>
        {templates.map((t) => (
          <SelectItem key={t.id} value={t.id} className="text-xs">
            <span>{t.name}</span>
            <span className="ml-2 text-muted-foreground">({t.agents.length} agents)</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
