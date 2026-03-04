import { redirect } from "next/navigation"
import { WORKFLOW_TEMPLATES } from "@/lib/mock-data"

export default async function WorkflowDetailPage(props: {
  params: Promise<{ workflowId: string }>
}) {
  const { workflowId } = await props.params

  const workflow = WORKFLOW_TEMPLATES.find((w) => w.id === workflowId)
  if (!workflow) redirect("/workflows")

  redirect(`/workflows?template=${workflowId}`)
}
