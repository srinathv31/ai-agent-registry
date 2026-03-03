import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { DomainConfig } from "@/lib/types"

export function DomainConfigTab({ config }: { config: DomainConfig }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">System Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {config.systemPrompt}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Agent Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Max Steps</p>
              <p className="text-sm font-medium">{config.maxSteps}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Azure Deployment</p>
              <p className="text-sm font-mono">{config.azureDeployment}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Policies Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Rate Limit</p>
              <p className="text-sm">{config.policies.maxRequestsPerMinute} req/min</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Token Limit</p>
              <p className="text-sm">{config.policies.maxTokensPerRequest.toLocaleString()} tokens/req</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Required Scopes</p>
              <p className="text-sm">{config.policies.requiredScopes.length} scopes</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Approval Rules</p>
              <p className="text-sm">{config.policies.approvalRules.length} rules</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
