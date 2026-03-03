import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SessionStatusBadge } from "@/components/shared/session-status-badge"
import { formatRelativeTime, formatDuration } from "@/lib/utils"
import type { AgentSession } from "@/lib/types"

export function DomainActivityTab({ sessions }: { sessions: AgentSession[] }) {
  if (sessions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        No sessions found for this domain.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Session ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Trigger</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Started</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Summary</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => {
          const durationMs =
            session.completedAt
              ? new Date(session.completedAt).getTime() - new Date(session.startedAt).getTime()
              : Date.now() - new Date(session.startedAt).getTime()

          return (
            <TableRow key={session.id}>
              <TableCell className="font-mono text-xs">{session.id}</TableCell>
              <TableCell>
                <SessionStatusBadge status={session.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">{session.trigger.replace("_", " ")}</TableCell>
              <TableCell className="text-muted-foreground">{session.userId}</TableCell>
              <TableCell className="text-muted-foreground">{formatRelativeTime(session.startedAt)}</TableCell>
              <TableCell className="text-muted-foreground">{formatDuration(durationMs)}</TableCell>
              <TableCell className="max-w-[250px] truncate text-muted-foreground">
                {session.summary}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
