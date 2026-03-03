import { notFound } from "next/navigation"
import Link from "next/link"
import { PageHeader } from "@/components/layout/page-header"
import { ExecutionTimeline } from "@/components/sessions/execution-timeline"
import { AGENT_SESSIONS } from "@/lib/mock-data"

export default async function SessionDetailPage(props: {
  params: Promise<{ sessionId: string }>
}) {
  const { sessionId } = await props.params

  const session = AGENT_SESSIONS.find((s) => s.id === sessionId)
  if (!session) notFound()

  return (
    <>
      <PageHeader title={`Session ${session.id}`}>
        <nav className="text-sm text-muted-foreground">
          <Link href="/sessions" className="hover:text-foreground">
            Sessions
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{session.id}</span>
        </nav>
      </PageHeader>
      <div className="p-6">
        <ExecutionTimeline session={session} />
      </div>
    </>
  )
}
