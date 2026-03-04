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

// ── Agent Workflows ──

export interface WorkflowAgent {
  id: string;
  name: string;
  domain: string;
  role: string;
  toolsUsed: string[];
  avgDurationMs: number;
  successRate: number;
}

export interface WorkflowConnection {
  fromAgentId: string;
  toAgentId: string;
  dataPassed: string;
  condition?: string;
}

export interface WorkflowAgentResult {
  agentId: string;
  status: "pending" | "running" | "completed" | "failed";
  inputData: Record<string, unknown>;
  outputData: Record<string, unknown>;
  reasoning: string;
  tokensUsed: number;
  durationMs: number;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  agents: WorkflowAgent[];
  connections: WorkflowConnection[];
  metrics: {
    totalRuns: number;
    successRate: number;
    avgDuration: string;
  };
  runResult: WorkflowAgentResult[];
  weeklyPerformance: { week: string; successRate: number }[];
}

// ── Workflow Builder ──

export interface PaletteAgent {
  id: string;
  name: string;
  domain: "Credit Cards" | "Risk & Compliance" | "Platform Operations" | "Customer Intelligence";
  role: string;
  description: string;
  toolsUsed: string[];
  avgDurationMs: number;
  successRate: number;
}

export interface WorkflowNodeData {
  agent: PaletteAgent;
  simulationStatus: "idle" | "running" | "completed" | "failed";
  [key: string]: unknown;
}

export interface WorkflowEdgeData {
  dataPassed: string;
  condition?: string;
  animated?: boolean;
  [key: string]: unknown;
}

export interface WorkflowCanvasLayout {
  templateId: string;
  positions: Record<string, { x: number; y: number }>;
}

// ── Cross-Domain AI Learning ──

export interface LearningEvent {
  id: string;
  timestamp: string;
  category:
    | "response_quality"
    | "tool_selection"
    | "escalation_accuracy"
    | "resolution_speed";
  sourceDomain: string;
  targetDomain: string;
  title: string;
  description: string;
  impact: string;
  impactValue: number;
  confidence: number;
  type:
    | "pattern_learned"
    | "self_correction"
    | "cross_domain_transfer"
    | "threshold_adjustment";
}

export interface LearningTimeSeriesPoint {
  week: string;
  accuracy: number;
  confidence: number;
  responseQuality: number;
  toolSelectionAccuracy: number;
  escalationAccuracy: number;
  resolutionSpeed: number;
}

export interface BeforeAfterComparison {
  id: string;
  title: string;
  category: string;
  scenario: string;
  beforeResponse: string;
  afterResponse: string;
  beforeMetrics: Record<string, number>;
  afterMetrics: Record<string, number>;
}

export interface CrossDomainTransfer {
  id: string;
  patternName: string;
  sourceDomain: string;
  targetDomains: string[];
  description: string;
  accuracyGain: number;
  status: "active" | "evaluating";
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
