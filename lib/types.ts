// ── Domain Registry ──

export interface Domain {
  id: string;
  name: string;
  description: string;
  owner: string;
  contact: string;
  status: "active" | "sandbox" | "disabled";
  registeredAt: string;
  lastActivity: string;
  tools: Tool[];
  config: DomainConfig;
  metrics: DomainMetrics;
}

export interface Tool {
  name: string;
  displayName: string;
  description: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  mode: "read" | "write";
  dataClassification: "PUBLIC" | "CONFIDENTIAL" | "PCI" | "PII";
  dryRunSupported: boolean;
  requiresApproval: boolean;
  auth: "managed-identity" | "api-key" | "oauth";
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
  status: "healthy" | "degraded" | "down";
  successRate: number;
  avgLatencyMs: number;
}

export interface DomainConfig {
  systemPrompt: string;
  maxSteps: number;
  azureDeployment: string;
  policies: PolicyConfig;
}

export interface PolicyConfig {
  requiredScopes: string[];
  maxRequestsPerMinute: number;
  maxTokensPerRequest: number;
  allowedNetworks: string[];
  approvalRules: ApprovalRule[];
}

export interface ApprovalRule {
  toolPattern: string;
  approvalType: "single" | "dual";
  approverRole: string;
}

export interface DomainMetrics {
  totalSessions: number;
  successRate: number;
  avgResolutionTime: string;
  activeAgents: number;
  pendingApprovals: number;
}

// ── Agent Sessions ──

export interface AgentSession {
  id: string;
  domainId: string;
  domainName: string;
  status: "running" | "completed" | "failed" | "awaiting_approval" | "escalated";
  trigger: "user_chat" | "webhook" | "scheduled";
  userId: string;
  startedAt: string;
  completedAt: string | null;
  summary: string;
  steps: AgentStep[];
  tokenUsage: { prompt: number; completion: number; total: number };
  traceId: string;
}

export interface AgentStep {
  id: string;
  sequence: number;
  type:
    | "reasoning"
    | "tool_call"
    | "tool_result"
    | "approval_request"
    | "approval_decision"
    | "response"
    | "error"
    | "escalation";
  timestamp: string;
  reasoning?: string;
  toolName?: string;
  toolInput?: Record<string, unknown>;
  toolOutput?: Record<string, unknown>;
  redactedFields?: string[];
  policyDecision?: {
    allowed: boolean;
    reason: string;
    scope: string;
    ruleId: string;
  };
  approvalStatus?: "pending" | "approved" | "denied";
  approver?: string;
  responseText?: string;
  durationMs?: number;
}

// ── Approvals ──

export interface PendingApproval {
  id: string;
  sessionId: string;
  domainId: string;
  domainName: string;
  toolName: string;
  toolDisplayName: string;
  requestedAt: string;
  requestedBy: string;
  approvalType: "single" | "dual";
  status: "pending" | "approved" | "denied";
  reasoning: string;
  proposedAction: {
    description: string;
    input: Record<string, unknown>;
    dryRunResult: Record<string, unknown>;
  };
  currentState: Record<string, unknown>;
  proposedState: Record<string, unknown>;
  risk: "low" | "medium" | "high";
}

// ── Dashboard ──

export interface DashboardMetrics {
  totalAgentSessions: number;
  sessionsTrend: number;
  avgResolutionTime: string;
  resolutionTrend: number;
  approvalRate: number;
  approvalTrend: number;
  activeAgents: number;
  activeTrend: number;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  type:
    | "session_started"
    | "session_completed"
    | "session_failed"
    | "approval_requested"
    | "approval_granted"
    | "tool_called"
    | "escalation"
    | "kill_switch";
  domainName: string;
  message: string;
  severity: "info" | "warning" | "error" | "success";
}
