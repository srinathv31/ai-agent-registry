import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { PolicyConfig } from "@/lib/types"

export function DomainPoliciesTab({ policies }: { policies: PolicyConfig }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Required Scopes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {policies.requiredScopes.map((scope) => (
              <Badge key={scope} variant="secondary">
                {scope}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Rate Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Max Requests</p>
                <p className="text-lg font-semibold">{policies.maxRequestsPerMinute} <span className="text-sm font-normal text-muted-foreground">per minute</span></p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Max Tokens</p>
                <p className="text-lg font-semibold">{policies.maxTokensPerRequest.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">per request</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Allowed Networks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {policies.allowedNetworks.map((network) => (
                <Badge key={network} variant="outline" className="font-mono">
                  {network}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Approval Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool Pattern</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Approver Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.approvalRules.map((rule) => (
                <TableRow key={rule.toolPattern}>
                  <TableCell className="font-mono text-sm">{rule.toolPattern}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={rule.approvalType === "dual" ? "bg-danger/15 text-danger border-danger/25" : "bg-warning/15 text-warning border-warning/25"}>
                      {rule.approvalType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{rule.approverRole}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
