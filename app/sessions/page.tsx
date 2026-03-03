import { PageHeader } from "@/components/layout/page-header"
import { SessionsListClient } from "@/components/sessions/sessions-list-client"

export default function SessionsPage() {
  return (
    <>
      <PageHeader title="Agent Sessions" description="All AI agent execution sessions" />
      <SessionsListClient />
    </>
  )
}
