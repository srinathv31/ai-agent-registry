import { WorkflowBuilder } from "@/components/workflows/workflow-builder"
import { WORKFLOW_TEMPLATES, PALETTE_AGENTS, WORKFLOW_CANVAS_LAYOUTS } from "@/lib/mock-data"

export default async function WorkflowsPage(props: {
  searchParams: Promise<{ template?: string }>
}) {
  const { template } = await props.searchParams

  return (
    <WorkflowBuilder
      templates={WORKFLOW_TEMPLATES}
      paletteAgents={PALETTE_AGENTS}
      canvasLayouts={WORKFLOW_CANVAS_LAYOUTS}
      initialTemplateId={template}
    />
  )
}
