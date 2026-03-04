import type {
  Domain,
  AgentSession,
  PendingApproval,
  DashboardMetrics,
  ActivityFeedItem,
  WorkflowTemplate,
  PaletteAgent,
  WorkflowCanvasLayout,
  LearningEvent,
  LearningTimeSeriesPoint,
  BeforeAfterComparison,
  CrossDomainTransfer,
} from "./types";

// ── Domains ──

export const DOMAINS: Domain[] = [
  {
    id: "credit-card-servicing",
    name: "Credit Card Servicing",
    description:
      "AI-assisted credit card support for balance inquiries, card status, payment management, and emergency card actions.",
    owner: "Credit Card Technology",
    contact: "cc-tech@bank.com",
    status: "active",
    registeredAt: "2025-11-15T09:00:00Z",
    lastActivity: "2026-03-02T14:45:00Z",
    tools: [
      {
        name: "getShipmentStatus",
        displayName: "Get Shipment Status",
        description:
          "Retrieves the current shipping status and tracking details for a customer's credit card.",
        endpoint: "https://cc-api.internal.bank.com/ai-tools/shipment-status",
        method: "POST",
        mode: "read",
        dataClassification: "PII",
        dryRunSupported: false,
        requiresApproval: false,
        auth: "managed-identity",
        inputSchema: {
          type: "object",
          properties: {
            accountId: { type: "string" },
            last4: { type: "string" },
          },
          required: ["accountId", "last4"],
        },
        outputSchema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              enum: ["shipped", "processing", "delivered"],
            },
            trackingNumber: { type: "string" },
            estimatedDelivery: { type: "string" },
            carrier: { type: "string" },
          },
        },
        status: "healthy",
        successRate: 99.2,
        avgLatencyMs: 145,
      },
      {
        name: "getBalanceDetails",
        displayName: "Get Balance Details",
        description:
          "Returns current balance, available credit, statement balance, minimum payment, and due date for an account.",
        endpoint: "https://cc-api.internal.bank.com/ai-tools/balance",
        method: "POST",
        mode: "read",
        dataClassification: "PCI",
        dryRunSupported: false,
        requiresApproval: false,
        auth: "managed-identity",
        inputSchema: {
          type: "object",
          properties: {
            accountId: { type: "string" },
          },
          required: ["accountId"],
        },
        outputSchema: {
          type: "object",
          properties: {
            currentBalance: { type: "number" },
            availableCredit: { type: "number" },
            statementBalance: { type: "number" },
            minimumPayment: { type: "number" },
            dueDate: { type: "string" },
          },
        },
        status: "healthy",
        successRate: 99.8,
        avgLatencyMs: 89,
      },
      {
        name: "updatePaymentDate",
        displayName: "Update Payment Date",
        description:
          "Changes the monthly payment due date for a credit card account. Requires approval for execution.",
        endpoint: "https://cc-api.internal.bank.com/ai-tools/payment-date",
        method: "POST",
        mode: "write",
        dataClassification: "PCI",
        dryRunSupported: true,
        requiresApproval: true,
        auth: "managed-identity",
        inputSchema: {
          type: "object",
          properties: {
            accountId: { type: "string" },
            newDueDate: { type: "number", minimum: 1, maximum: 28 },
            reason: { type: "string" },
          },
          required: ["accountId", "newDueDate", "reason"],
        },
        outputSchema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            previousDate: { type: "number" },
            newDate: { type: "number" },
            effectiveDate: { type: "string" },
          },
        },
        status: "healthy",
        successRate: 98.5,
        avgLatencyMs: 230,
      },
      {
        name: "freezeCard",
        displayName: "Freeze Card",
        description:
          "Immediately freezes a credit card to prevent further transactions. Requires dual approval.",
        endpoint: "https://cc-api.internal.bank.com/ai-tools/freeze",
        method: "POST",
        mode: "write",
        dataClassification: "PCI",
        dryRunSupported: true,
        requiresApproval: true,
        auth: "managed-identity",
        inputSchema: {
          type: "object",
          properties: {
            accountId: { type: "string" },
            reason: { type: "string" },
            requestedBy: { type: "string" },
          },
          required: ["accountId", "reason", "requestedBy"],
        },
        outputSchema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            cardLast4: { type: "string" },
            frozenAt: { type: "string" },
            caseId: { type: "string" },
          },
        },
        status: "healthy",
        successRate: 99.9,
        avgLatencyMs: 67,
      },
    ],
    config: {
      systemPrompt:
        "You are a credit card servicing assistant for [Bank]. You help customers with card status, balance inquiries, and account management. Never reveal full account numbers. Always verify identity before accessing PCI data. For write operations, explain what you're about to do and why before requesting approval.",
      maxSteps: 8,
      azureDeployment: "gpt-4o-banking-prod",
      policies: {
        requiredScopes: ["cc:read", "cc:write"],
        maxRequestsPerMinute: 30,
        maxTokensPerRequest: 4000,
        allowedNetworks: ["*.internal.bank.com"],
        approvalRules: [
          {
            toolPattern: "updatePaymentDate",
            approvalType: "single",
            approverRole: "cc-ops-manager",
          },
          {
            toolPattern: "freezeCard",
            approvalType: "dual",
            approverRole: "cc-ops-senior",
          },
        ],
      },
    },
    metrics: {
      totalSessions: 1247,
      successRate: 96.2,
      avgResolutionTime: "1m 48s",
      activeAgents: 2,
      pendingApprovals: 1,
    },
  },
  {
    id: "production-support",
    name: "Production Support",
    description:
      "Automated incident response and diagnostics for production infrastructure. Gathers telemetry, matches runbooks, and executes approved remediations.",
    owner: "Platform Engineering",
    contact: "platform-eng@bank.com",
    status: "active",
    registeredAt: "2025-12-01T10:00:00Z",
    lastActivity: "2026-03-02T14:32:00Z",
    tools: [
      {
        name: "getDynatraceSnapshot",
        displayName: "Get Dynatrace Snapshot",
        description:
          "Fetches real-time performance metrics and active alerts from Dynatrace for a given service.",
        endpoint:
          "https://ops-api.internal.bank.com/ai-tools/dynatrace-snapshot",
        method: "POST",
        mode: "read",
        dataClassification: "CONFIDENTIAL",
        dryRunSupported: false,
        requiresApproval: false,
        auth: "managed-identity",
        inputSchema: {
          type: "object",
          properties: {
            serviceId: { type: "string" },
            timeRange: { type: "string" },
          },
          required: ["serviceId", "timeRange"],
        },
        outputSchema: {
          type: "object",
          properties: {
            errorRate: { type: "number" },
            responseTime: { type: "number" },
            throughput: { type: "number" },
            activeAlerts: { type: "array" },
          },
        },
        status: "healthy",
        successRate: 97.8,
        avgLatencyMs: 312,
      },
      {
        name: "searchDatadogLogs",
        displayName: "Search Datadog Logs",
        description:
          "Queries Datadog for log entries matching a given filter, returning hits, sample logs, and facets.",
        endpoint: "https://ops-api.internal.bank.com/ai-tools/datadog-search",
        method: "POST",
        mode: "read",
        dataClassification: "CONFIDENTIAL",
        dryRunSupported: false,
        requiresApproval: false,
        auth: "managed-identity",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            timeRange: { type: "string" },
            service: { type: "string" },
          },
          required: ["query", "timeRange", "service"],
        },
        outputSchema: {
          type: "object",
          properties: {
            totalHits: { type: "number" },
            logs: { type: "array" },
            facets: { type: "object" },
          },
        },
        status: "healthy",
        successRate: 99.1,
        avgLatencyMs: 445,
      },
      {
        name: "restartService",
        displayName: "Restart Service",
        description:
          "Performs a rolling restart of a production service. Requires approval and a runbook reference.",
        endpoint: "https://ops-api.internal.bank.com/ai-tools/restart",
        method: "POST",
        mode: "write",
        dataClassification: "CONFIDENTIAL",
        dryRunSupported: true,
        requiresApproval: true,
        auth: "managed-identity",
        inputSchema: {
          type: "object",
          properties: {
            serviceId: { type: "string" },
            environment: { type: "string" },
            reason: { type: "string" },
            runbookRef: { type: "string" },
          },
          required: ["serviceId", "environment", "reason", "runbookRef"],
        },
        outputSchema: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            previousState: { type: "string" },
            currentState: { type: "string" },
            restartDuration: { type: "string" },
          },
        },
        status: "healthy",
        successRate: 96.2,
        avgLatencyMs: 1850,
      },
      {
        name: "createPagerDutyNote",
        displayName: "Create PagerDuty Note",
        description:
          "Adds an investigative note to an existing PagerDuty incident for audit trail and collaboration.",
        endpoint: "https://ops-api.internal.bank.com/ai-tools/pagerduty-note",
        method: "POST",
        mode: "write",
        dataClassification: "CONFIDENTIAL",
        dryRunSupported: false,
        requiresApproval: true,
        auth: "managed-identity",
        inputSchema: {
          type: "object",
          properties: {
            incidentId: { type: "string" },
            note: { type: "string" },
            author: { type: "string" },
          },
          required: ["incidentId", "note", "author"],
        },
        outputSchema: {
          type: "object",
          properties: {
            noteId: { type: "string" },
            addedAt: { type: "string" },
          },
        },
        status: "healthy",
        successRate: 99.5,
        avgLatencyMs: 180,
      },
    ],
    config: {
      systemPrompt:
        "You are an on-call support agent for [Bank] platform engineering. When an alert fires, your job is to: 1) Gather diagnostic data from Dynatrace and Datadog, 2) Determine if the issue matches a known runbook, 3) Attempt safe remediation steps (restart, scale, failover) with approval, 4) Escalate to a human operator if confidence is low or the issue is unfamiliar. Always log your reasoning.",
      maxSteps: 12,
      azureDeployment: "gpt-4o-banking-prod",
      policies: {
        requiredScopes: ["ops:read", "ops:write", "ops:restart"],
        maxRequestsPerMinute: 20,
        maxTokensPerRequest: 8000,
        allowedNetworks: ["*.internal.bank.com"],
        approvalRules: [
          {
            toolPattern: "restartService",
            approvalType: "single",
            approverRole: "oncall-lead",
          },
          {
            toolPattern: "createPagerDutyNote",
            approvalType: "single",
            approverRole: "oncall-lead",
          },
        ],
      },
    },
    metrics: {
      totalSessions: 600,
      successRate: 92.1,
      avgResolutionTime: "4m 12s",
      activeAgents: 1,
      pendingApprovals: 0,
    },
  },
];

// ── Agent Sessions ──

export const AGENT_SESSIONS: AgentSession[] = [
  // Session 1: "Where is my credit card?" (completed, read-only)
  {
    id: "session-001",
    domainId: "credit-card-servicing",
    domainName: "Credit Card Servicing",
    status: "completed",
    trigger: "user_chat",
    userId: "sarah.chen@bank.com",
    startedAt: "2026-03-02T14:42:00Z",
    completedAt: "2026-03-02T14:42:03Z",
    summary: "Card shipment status inquiry — card shipped via UPS, ETA March 4",
    steps: [
      {
        id: "s1-step-1",
        sequence: 1,
        type: "reasoning",
        timestamp: "2026-03-02T14:42:00Z",
        reasoning:
          "Customer is asking about card delivery status. I need to look up their shipment information. Let me call getShipmentStatus with their account.",
      },
      {
        id: "s1-step-2",
        sequence: 2,
        type: "tool_call",
        timestamp: "2026-03-02T14:42:01Z",
        toolName: "getShipmentStatus",
        toolInput: { accountId: "****7842", last4: "7842" },
        policyDecision: {
          allowed: true,
          reason: "Authorized via RBAC",
          scope: "cc:read",
          ruleId: "read-tools-open",
        },
        durationMs: 145,
      },
      {
        id: "s1-step-3",
        sequence: 3,
        type: "tool_result",
        timestamp: "2026-03-02T14:42:01Z",
        toolName: "getShipmentStatus",
        toolOutput: {
          status: "shipped",
          trackingNumber: "1Z999AA10123456784",
          estimatedDelivery: "2026-03-04",
          carrier: "UPS",
        },
        redactedFields: ["accountId"],
      },
      {
        id: "s1-step-4",
        sequence: 4,
        type: "reasoning",
        timestamp: "2026-03-02T14:42:02Z",
        reasoning:
          "I have the shipment details. The card has been shipped via UPS with an estimated delivery of March 4th. I'll compose a clear response for the customer.",
      },
      {
        id: "s1-step-5",
        sequence: 5,
        type: "response",
        timestamp: "2026-03-02T14:42:03Z",
        responseText:
          "Great news! Your new credit card has been shipped and is on its way. It's being delivered by UPS with tracking number ending in 6784. The estimated delivery date is March 4th, 2026. You'll receive an email notification when it arrives. Is there anything else I can help you with?",
      },
    ],
    tokenUsage: { prompt: 1247, completion: 389, total: 1636 },
    traceId: "TR-20260302-B1C4",
  },

  // Session 2: "Update payment date" (completed, write with approval)
  {
    id: "session-002",
    domainId: "credit-card-servicing",
    domainName: "Credit Card Servicing",
    status: "completed",
    trigger: "user_chat",
    userId: "james.wilson@bank.com",
    startedAt: "2026-03-02T13:50:00Z",
    completedAt: "2026-03-02T13:50:52Z",
    summary:
      "Payment due date changed from 10th to 15th — approved by ops manager",
    steps: [
      {
        id: "s2-step-1",
        sequence: 1,
        type: "reasoning",
        timestamp: "2026-03-02T13:50:00Z",
        reasoning:
          "Customer wants to change their payment due date. This is a write operation that requires approval. First, let me get their current balance details to understand their account state, then I'll prepare the update.",
      },
      {
        id: "s2-step-2",
        sequence: 2,
        type: "tool_call",
        timestamp: "2026-03-02T13:50:01Z",
        toolName: "getBalanceDetails",
        toolInput: { accountId: "****4829" },
        policyDecision: {
          allowed: true,
          reason: "Authorized via RBAC",
          scope: "cc:read",
          ruleId: "read-tools-open",
        },
        durationMs: 89,
      },
      {
        id: "s2-step-3",
        sequence: 3,
        type: "tool_result",
        timestamp: "2026-03-02T13:50:01Z",
        toolName: "getBalanceDetails",
        toolOutput: {
          currentBalance: 2847.32,
          availableCredit: 7152.68,
          statementBalance: 1923.45,
          minimumPayment: 48.0,
          dueDate: "2026-03-10",
        },
        redactedFields: ["accountId"],
      },
      {
        id: "s2-step-4",
        sequence: 4,
        type: "reasoning",
        timestamp: "2026-03-02T13:50:02Z",
        reasoning:
          "Current due date is the 10th. Customer wants it moved to the 15th. This is a valid change within the allowed range (1-28). I'll initiate a dry-run first, then request approval.",
      },
      {
        id: "s2-step-5",
        sequence: 5,
        type: "tool_call",
        timestamp: "2026-03-02T13:50:03Z",
        toolName: "updatePaymentDate",
        toolInput: {
          accountId: "****4829",
          newDueDate: 15,
          reason: "Customer requested via chat",
        },
        policyDecision: {
          allowed: false,
          reason: "Approval Required",
          scope: "cc:write",
          ruleId: "write-requires-approval",
        },
        durationMs: 230,
      },
      {
        id: "s2-step-6",
        sequence: 6,
        type: "tool_result",
        timestamp: "2026-03-02T13:50:03Z",
        toolName: "updatePaymentDate",
        toolOutput: {
          success: true,
          previousDate: 10,
          newDate: 15,
          effectiveDate: "2026-04-01",
        },
      },
      {
        id: "s2-step-7",
        sequence: 7,
        type: "approval_request",
        timestamp: "2026-03-02T13:50:04Z",
        toolName: "updatePaymentDate",
        reasoning:
          "Change payment due date from 10th to 15th for account ****4829. Effective next billing cycle (April 1, 2026).",
        approvalStatus: "approved",
        approver: "ops.manager@bank.com",
        durationMs: 45000,
      },
      {
        id: "s2-step-8",
        sequence: 8,
        type: "tool_call",
        timestamp: "2026-03-02T13:50:49Z",
        toolName: "updatePaymentDate",
        toolInput: {
          accountId: "****4829",
          newDueDate: 15,
          reason: "Customer requested via chat",
        },
        policyDecision: {
          allowed: true,
          reason: "Approved by ops.manager@bank.com",
          scope: "cc:write",
          ruleId: "write-requires-approval",
        },
        durationMs: 230,
      },
      {
        id: "s2-step-9",
        sequence: 9,
        type: "tool_result",
        timestamp: "2026-03-02T13:50:50Z",
        toolName: "updatePaymentDate",
        toolOutput: {
          success: true,
          previousDate: 10,
          newDate: 15,
          effectiveDate: "2026-04-01",
        },
      },
      {
        id: "s2-step-10",
        sequence: 10,
        type: "response",
        timestamp: "2026-03-02T13:50:52Z",
        responseText:
          "Done! Your payment due date has been updated from the 10th to the 15th of each month. This change takes effect starting your next billing cycle on April 1st, 2026. Your current statement balance of $1,923.45 with minimum payment of $48.00 is still due on March 10th. Is there anything else I can help with?",
      },
    ],
    tokenUsage: { prompt: 3891, completion: 1247, total: 5138 },
    traceId: "TR-20260302-D7E2",
  },

  // Session 3: Production alert — automated remediation (completed)
  {
    id: "session-003",
    domainId: "production-support",
    domainName: "Production Support",
    status: "completed",
    trigger: "webhook",
    userId: "system",
    startedAt: "2026-03-01T14:18:00Z",
    completedAt: "2026-03-01T14:22:12Z",
    summary:
      "Incident PD-2026-4891 resolved — connection pool exhaustion on cc-payment-service, rolling restart applied",
    steps: [
      {
        id: "s3-step-1",
        sequence: 1,
        type: "reasoning",
        timestamp: "2026-03-01T14:18:00Z",
        reasoning:
          "Received Datadog alert: High error rate on credit-card-payment-service in production (error rate 23%, threshold 5%). Let me gather diagnostic data to understand the scope and determine if this matches a known runbook.",
      },
      {
        id: "s3-step-2",
        sequence: 2,
        type: "tool_call",
        timestamp: "2026-03-01T14:18:02Z",
        toolName: "getDynatraceSnapshot",
        toolInput: {
          serviceId: "credit-card-payment-service",
          timeRange: "last-15m",
        },
        policyDecision: {
          allowed: true,
          reason: "Authorized via RBAC",
          scope: "ops:read",
          ruleId: "read-tools-open",
        },
        durationMs: 312,
      },
      {
        id: "s3-step-3",
        sequence: 3,
        type: "tool_result",
        timestamp: "2026-03-01T14:18:02Z",
        toolName: "getDynatraceSnapshot",
        toolOutput: {
          errorRate: 23.4,
          responseTime: 4521,
          throughput: 145,
          activeAlerts: [
            { name: "High Error Rate", severity: "critical" },
            { name: "Response Time Degradation", severity: "warning" },
          ],
        },
      },
      {
        id: "s3-step-4",
        sequence: 4,
        type: "tool_call",
        timestamp: "2026-03-01T14:18:05Z",
        toolName: "searchDatadogLogs",
        toolInput: {
          query: "service:cc-payment-svc status:error",
          timeRange: "last-15m",
          service: "credit-card-payment-service",
        },
        policyDecision: {
          allowed: true,
          reason: "Authorized via RBAC",
          scope: "ops:read",
          ruleId: "read-tools-open",
        },
        durationMs: 445,
      },
      {
        id: "s3-step-5",
        sequence: 5,
        type: "tool_result",
        timestamp: "2026-03-01T14:18:06Z",
        toolName: "searchDatadogLogs",
        toolOutput: {
          totalHits: 1847,
          logs: [
            { message: "Connection pool exhausted", count: 1203 },
            { message: "Timeout waiting for downstream", count: 644 },
          ],
          facets: {
            "error.type": {
              ConnectionPoolExhausted: 1203,
              TimeoutException: 644,
            },
          },
        },
      },
      {
        id: "s3-step-6",
        sequence: 6,
        type: "reasoning",
        timestamp: "2026-03-01T14:18:08Z",
        reasoning:
          "The error pattern shows connection pool exhaustion (1,203 occurrences) and downstream timeouts (644). This matches Runbook RB-2024-031: Connection Pool Exhaustion. The recommended first action is a rolling restart of the service. Error rate is 23.4% which is above the 20% auto-remediation threshold in the runbook. I'll request approval for a restart.",
      },
      {
        id: "s3-step-7",
        sequence: 7,
        type: "tool_call",
        timestamp: "2026-03-01T14:18:10Z",
        toolName: "restartService",
        toolInput: {
          serviceId: "credit-card-payment-service",
          environment: "production",
          reason: "Connection pool exhaustion — Runbook RB-2024-031",
          runbookRef: "RB-2024-031",
        },
        policyDecision: {
          allowed: false,
          reason: "Approval Required",
          scope: "ops:write",
          ruleId: "write-requires-approval",
        },
        durationMs: 1850,
      },
      {
        id: "s3-step-8",
        sequence: 8,
        type: "tool_result",
        timestamp: "2026-03-01T14:18:12Z",
        toolName: "restartService",
        toolOutput: {
          success: true,
          previousState: "running (degraded)",
          currentState: "restarting",
          restartDuration: "~45s",
        },
      },
      {
        id: "s3-step-9",
        sequence: 9,
        type: "approval_request",
        timestamp: "2026-03-01T14:18:14Z",
        toolName: "restartService",
        reasoning:
          "Rolling restart of credit-card-payment-service in production. Runbook: RB-2024-031 (Connection Pool Exhaustion). Current error rate: 23.4%. Expected downtime: ~45s with rolling restart.",
        approvalStatus: "approved",
        approver: "oncall.lead@bank.com",
        durationMs: 28000,
      },
      {
        id: "s3-step-10",
        sequence: 10,
        type: "tool_call",
        timestamp: "2026-03-01T14:18:42Z",
        toolName: "restartService",
        toolInput: {
          serviceId: "credit-card-payment-service",
          environment: "production",
          reason: "Connection pool exhaustion — Runbook RB-2024-031",
          runbookRef: "RB-2024-031",
        },
        policyDecision: {
          allowed: true,
          reason: "Approved by oncall.lead@bank.com",
          scope: "ops:write",
          ruleId: "write-requires-approval",
        },
        durationMs: 38000,
      },
      {
        id: "s3-step-11",
        sequence: 11,
        type: "tool_result",
        timestamp: "2026-03-01T14:19:20Z",
        toolName: "restartService",
        toolOutput: {
          success: true,
          previousState: "running (degraded)",
          currentState: "running (healthy)",
          restartDuration: "38s",
        },
      },
      {
        id: "s3-step-12",
        sequence: 12,
        type: "tool_call",
        timestamp: "2026-03-01T14:19:22Z",
        toolName: "createPagerDutyNote",
        toolInput: {
          incidentId: "PD-2026-4891",
          note: "Auto-remediation completed. Rolling restart of credit-card-payment-service resolved connection pool exhaustion. Error rate recovered from 23.4% to 0.3% within 2 minutes. Runbook RB-2024-031 applied. Full trace: TR-20260301-A8F3.",
          author: "ai-agent",
        },
        policyDecision: {
          allowed: true,
          reason: "Approved (single approval — automated)",
          scope: "ops:write",
          ruleId: "write-requires-approval",
        },
        durationMs: 180,
      },
      {
        id: "s3-step-13",
        sequence: 13,
        type: "tool_result",
        timestamp: "2026-03-01T14:19:22Z",
        toolName: "createPagerDutyNote",
        toolOutput: {
          noteId: "note-39201",
          addedAt: "2026-03-01T14:32:45Z",
        },
      },
      {
        id: "s3-step-14",
        sequence: 14,
        type: "response",
        timestamp: "2026-03-01T14:22:12Z",
        responseText:
          "Incident PD-2026-4891 resolved. Root cause: connection pool exhaustion on credit-card-payment-service. Applied Runbook RB-2024-031 (rolling restart). Error rate recovered from 23.4% to 0.3%. PagerDuty note added. Total resolution time: 4m 12s.",
      },
    ],
    tokenUsage: { prompt: 5102, completion: 2847, total: 7949 },
    traceId: "TR-20260301-A8F3",
  },

  // Session 4: Currently running / awaiting approval
  {
    id: "session-004",
    domainId: "credit-card-servicing",
    domainName: "Credit Card Servicing",
    status: "awaiting_approval",
    trigger: "user_chat",
    userId: "maria.gonzalez@bank.com",
    startedAt: "2026-03-02T14:50:00Z",
    completedAt: null,
    summary:
      "Emergency card freeze requested — awaiting dual approval for card ending 3156",
    steps: [
      {
        id: "s4-step-1",
        sequence: 1,
        type: "reasoning",
        timestamp: "2026-03-02T14:50:00Z",
        reasoning:
          "Customer is requesting to freeze their credit card due to suspected unauthorized activity. This is a high-risk write operation requiring dual approval. Let me first verify their account status.",
      },
      {
        id: "s4-step-2",
        sequence: 2,
        type: "tool_call",
        timestamp: "2026-03-02T14:50:02Z",
        toolName: "getBalanceDetails",
        toolInput: { accountId: "****3156" },
        policyDecision: {
          allowed: true,
          reason: "Authorized via RBAC",
          scope: "cc:read",
          ruleId: "read-tools-open",
        },
        durationMs: 89,
      },
      {
        id: "s4-step-3",
        sequence: 3,
        type: "tool_result",
        timestamp: "2026-03-02T14:50:02Z",
        toolName: "getBalanceDetails",
        toolOutput: {
          currentBalance: 12450.89,
          availableCredit: 2549.11,
          statementBalance: 8932.0,
          minimumPayment: 223.0,
          dueDate: "2026-03-20",
        },
      },
      {
        id: "s4-step-4",
        sequence: 4,
        type: "reasoning",
        timestamp: "2026-03-02T14:50:04Z",
        reasoning:
          "Account shows a high balance of $12,450.89. I'll proceed with the freeze request. Since this is a freezeCard operation, it requires dual approval per policy.",
      },
      {
        id: "s4-step-5",
        sequence: 5,
        type: "tool_call",
        timestamp: "2026-03-02T14:50:06Z",
        toolName: "freezeCard",
        toolInput: {
          accountId: "****3156",
          reason: "Customer reported suspected unauthorized activity",
          requestedBy: "maria.gonzalez@bank.com",
        },
        policyDecision: {
          allowed: false,
          reason: "Dual Approval Required",
          scope: "cc:write",
          ruleId: "write-requires-dual-approval",
        },
        durationMs: 67,
      },
      {
        id: "s4-step-6",
        sequence: 6,
        type: "approval_request",
        timestamp: "2026-03-02T14:50:08Z",
        toolName: "freezeCard",
        reasoning:
          "Emergency freeze on card ending 3156. Reason: Suspected unauthorized activity. Current balance: $12,450.89. Requires two approvers.",
        approvalStatus: "pending",
      },
    ],
    tokenUsage: { prompt: 2103, completion: 687, total: 2790 },
    traceId: "TR-20260302-F9A1",
  },
];

// ── Pending Approvals ──

export const PENDING_APPROVALS: PendingApproval[] = [
  {
    id: "approval-001",
    sessionId: "session-004",
    domainId: "credit-card-servicing",
    domainName: "Credit Card Servicing",
    toolName: "freezeCard",
    toolDisplayName: "Freeze Card",
    requestedAt: "2026-03-02T14:50:08Z",
    requestedBy: "ai-agent (on behalf of maria.gonzalez@bank.com)",
    approvalType: "dual",
    status: "pending",
    reasoning:
      "Customer reported suspected unauthorized activity on their credit card ending in 3156. Account shows a high balance of $12,450.89 with $2,549.11 available credit. Immediate freeze recommended to prevent further unauthorized transactions while the fraud team investigates.",
    proposedAction: {
      description:
        "Freeze credit card ending in 3156 to prevent all future transactions",
      input: {
        accountId: "****3156",
        reason: "Customer reported suspected unauthorized activity",
        requestedBy: "maria.gonzalez@bank.com",
      },
      dryRunResult: {
        success: true,
        cardLast4: "3156",
        frozenAt: "pending",
        caseId: "pending",
      },
    },
    currentState: {
      cardStatus: "active",
      last4: "3156",
      currentBalance: "$12,450.89",
    },
    proposedState: {
      cardStatus: "frozen",
      last4: "3156",
      frozenAt: "pending",
      caseId: "pending",
    },
    risk: "high",
  },
  {
    id: "approval-002",
    sessionId: "session-002",
    domainId: "credit-card-servicing",
    domainName: "Credit Card Servicing",
    toolName: "updatePaymentDate",
    toolDisplayName: "Update Payment Date",
    requestedAt: "2026-03-02T14:35:00Z",
    requestedBy: "ai-agent (on behalf of james.wilson@bank.com)",
    approvalType: "single",
    status: "pending",
    reasoning:
      "Customer requested their monthly payment due date be moved from the 10th to the 25th to better align with their payroll schedule. Account is in good standing with no missed payments in the past 12 months. The change will take effect next billing cycle.",
    proposedAction: {
      description:
        "Change monthly payment due date from 10th to 25th for account ending in 4829",
      input: {
        accountId: "****4829",
        newDueDate: 25,
        reason: "Customer requested — payroll alignment",
      },
      dryRunResult: {
        success: true,
        previousDate: 10,
        newDate: 25,
        effectiveDate: "2026-04-01",
      },
    },
    currentState: {
      paymentDueDate: "10th of each month",
      accountStatus: "good standing",
      lastPayment: "2026-02-10",
    },
    proposedState: {
      paymentDueDate: "25th of each month",
      accountStatus: "good standing",
      lastPayment: "2026-02-10",
    },
    risk: "medium",
  },
  {
    id: "approval-003",
    sessionId: "session-003",
    domainId: "production-support",
    domainName: "Production Support",
    toolName: "createPagerDutyNote",
    toolDisplayName: "Create PagerDuty Note",
    requestedAt: "2026-03-02T14:20:00Z",
    requestedBy: "ai-agent (automated incident response)",
    approvalType: "single",
    status: "pending",
    reasoning:
      "Auto-investigation of incident PD-2026-4891 completed successfully. The connection pool exhaustion on cc-payment-service was resolved via rolling restart. Adding a summary note to the PagerDuty incident for audit trail and team visibility.",
    proposedAction: {
      description:
        "Add resolution note to PagerDuty incident PD-2026-4891",
      input: {
        incidentId: "PD-2026-4891",
        note: "Auto-remediation completed. Rolling restart resolved connection pool exhaustion. Error rate recovered from 23.4% to 0.3%.",
        author: "ai-agent",
      },
      dryRunResult: {
        noteId: "pending",
        addedAt: "pending",
      },
    },
    currentState: {
      incidentId: "PD-2026-4891",
      notesCount: 2,
      lastNote: "Alert acknowledged by on-call",
    },
    proposedState: {
      incidentId: "PD-2026-4891",
      notesCount: 3,
      lastNote: "Auto-remediation completed. Rolling restart resolved connection pool exhaustion.",
    },
    risk: "low",
  },
];

// ── Dashboard Metrics ──

export const DASHBOARD_METRICS: DashboardMetrics = {
  totalAgentSessions: 1847,
  sessionsTrend: 12.3,
  avgResolutionTime: "2m 34s",
  resolutionTrend: -18.2,
  approvalRate: 94.7,
  approvalTrend: 2.1,
  activeAgents: 3,
  activeTrend: 0,
};

// ── Activity Feed Items ──

export const ACTIVITY_FEED_ITEMS: ActivityFeedItem[] = [
  {
    id: "feed-01",
    timestamp: "2026-03-02T14:50:08Z",
    type: "approval_requested",
    domainName: "Credit Card Servicing",
    message:
      "Dual approval requested: freezeCard on account ****3156 — suspected fraud",
    severity: "warning",
  },
  {
    id: "feed-02",
    timestamp: "2026-03-02T14:45:12Z",
    type: "session_completed",
    domainName: "Credit Card Servicing",
    message: "Agent completed session: Balance inquiry for account ****6712",
    severity: "success",
  },
  {
    id: "feed-03",
    timestamp: "2026-03-02T14:42:03Z",
    type: "session_completed",
    domainName: "Credit Card Servicing",
    message:
      "Agent completed session: Card shipment status for account ****7842",
    severity: "success",
  },
  {
    id: "feed-04",
    timestamp: "2026-03-02T14:38:21Z",
    type: "approval_granted",
    domainName: "Production Support",
    message: "Approval granted: restartService on auth-token-service",
    severity: "info",
  },
  {
    id: "feed-05",
    timestamp: "2026-03-02T14:31:45Z",
    type: "session_started",
    domainName: "Credit Card Servicing",
    message: "Agent started: Payment date change request from james.wilson",
    severity: "info",
  },
  {
    id: "feed-06",
    timestamp: "2026-03-02T14:15:33Z",
    type: "tool_called",
    domainName: "Production Support",
    message:
      "Tool called: getDynatraceSnapshot for fraud-detection-service (latency alert)",
    severity: "info",
  },
  {
    id: "feed-07",
    timestamp: "2026-03-02T13:58:00Z",
    type: "session_completed",
    domainName: "Production Support",
    message:
      "Agent completed session: Disk usage alert on log-aggregator — scaled storage",
    severity: "success",
  },
  {
    id: "feed-08",
    timestamp: "2026-03-02T13:45:17Z",
    type: "session_failed",
    domainName: "Credit Card Servicing",
    message:
      "Agent session failed: Timeout calling getShipmentStatus (upstream 504)",
    severity: "error",
  },
  {
    id: "feed-09",
    timestamp: "2026-03-02T13:32:05Z",
    type: "tool_called",
    domainName: "Credit Card Servicing",
    message: "Tool called: getBalanceDetails for account ****9203",
    severity: "info",
  },
  {
    id: "feed-10",
    timestamp: "2026-03-02T13:18:44Z",
    type: "session_started",
    domainName: "Production Support",
    message:
      "Agent started: Webhook alert — high latency on fraud-detection-service",
    severity: "warning",
  },
  {
    id: "feed-11",
    timestamp: "2026-03-02T12:55:30Z",
    type: "approval_granted",
    domainName: "Credit Card Servicing",
    message:
      "Approval granted: updatePaymentDate for account ****4829 — approved by ops.manager",
    severity: "info",
  },
  {
    id: "feed-12",
    timestamp: "2026-03-02T12:41:22Z",
    type: "session_completed",
    domainName: "Credit Card Servicing",
    message:
      "Agent completed session: Credit limit inquiry for account ****1087",
    severity: "success",
  },
  {
    id: "feed-13",
    timestamp: "2026-03-02T12:28:15Z",
    type: "escalation",
    domainName: "Production Support",
    message:
      "Escalation: Unfamiliar error pattern on payment-gateway — routed to on-call lead",
    severity: "warning",
  },
  {
    id: "feed-14",
    timestamp: "2026-03-02T12:10:08Z",
    type: "session_completed",
    domainName: "Production Support",
    message:
      "Agent completed session: Memory leak detection on notification-service — restart applied",
    severity: "success",
  },
  {
    id: "feed-15",
    timestamp: "2026-03-02T11:52:33Z",
    type: "tool_called",
    domainName: "Credit Card Servicing",
    message: "Tool called: freezeCard (dry run) for account ****5521",
    severity: "info",
  },
];

// ── Chart Data ──

export const AGENT_ACTIVITY_CHART_DATA = [
  { hour: "12 AM", creditCard: 2, prodSupport: 1 },
  { hour: "1 AM", creditCard: 1, prodSupport: 0 },
  { hour: "2 AM", creditCard: 0, prodSupport: 1 },
  { hour: "3 AM", creditCard: 1, prodSupport: 0 },
  { hour: "4 AM", creditCard: 0, prodSupport: 2 },
  { hour: "5 AM", creditCard: 1, prodSupport: 1 },
  { hour: "6 AM", creditCard: 3, prodSupport: 1 },
  { hour: "7 AM", creditCard: 5, prodSupport: 2 },
  { hour: "8 AM", creditCard: 8, prodSupport: 3 },
  { hour: "9 AM", creditCard: 14, prodSupport: 4 },
  { hour: "10 AM", creditCard: 18, prodSupport: 5 },
  { hour: "11 AM", creditCard: 22, prodSupport: 3 },
  { hour: "12 PM", creditCard: 19, prodSupport: 6 },
  { hour: "1 PM", creditCard: 24, prodSupport: 4 },
  { hour: "2 PM", creditCard: 21, prodSupport: 12 },
  { hour: "3 PM", creditCard: 17, prodSupport: 8 },
  { hour: "4 PM", creditCard: 15, prodSupport: 5 },
  { hour: "5 PM", creditCard: 11, prodSupport: 3 },
  { hour: "6 PM", creditCard: 7, prodSupport: 2 },
  { hour: "7 PM", creditCard: 5, prodSupport: 1 },
  { hour: "8 PM", creditCard: 4, prodSupport: 2 },
  { hour: "9 PM", creditCard: 3, prodSupport: 1 },
  { hour: "10 PM", creditCard: 2, prodSupport: 0 },
  { hour: "11 PM", creditCard: 1, prodSupport: 1 },
];

export const TOOL_RELIABILITY_CHART_DATA = [
  { tool: "getShipmentStatus", successRate: 99.2, domain: "Credit Card" },
  { tool: "getBalanceDetails", successRate: 99.8, domain: "Credit Card" },
  { tool: "updatePaymentDate", successRate: 98.5, domain: "Credit Card" },
  { tool: "freezeCard", successRate: 99.9, domain: "Credit Card" },
  {
    tool: "getDynatraceSnapshot",
    successRate: 97.8,
    domain: "Production Support",
  },
  {
    tool: "searchDatadogLogs",
    successRate: 94.2,
    domain: "Production Support",
  },
  { tool: "restartService", successRate: 96.2, domain: "Production Support" },
  {
    tool: "createPagerDutyNote",
    successRate: 99.5,
    domain: "Production Support",
  },
];

// ── Registration YAML Template ──

export const REGISTRATION_YAML_TEMPLATE = `domain:
  id: fraud-detection
  name: Fraud Detection
  description: Real-time fraud monitoring and alert triage
  owner: Fraud Analytics Team
  contact: fraud-analytics@bank.com

agent:
  systemPrompt: |
    You are a fraud detection analyst for [Bank]. When a fraud alert
    is triggered, analyze transaction patterns, gather context from
    available tools, and determine if the activity is genuine fraud
    or a false positive. For confirmed fraud, initiate the card freeze
    workflow. Always document your reasoning.
  maxSteps: 10
  azureDeployment: gpt-4o-banking-prod

tools:
  - name: getTransactionHistory
    displayName: Get Transaction History
    endpoint: https://fraud-api.internal.bank.com/ai-tools/transactions
    method: POST
    mode: read
    dataClassification: PCI
    auth: managed-identity
    inputSchema:
      type: object
      properties:
        accountId: { type: string }
        timeRange: { type: string, enum: [last-24h, last-7d, last-30d] }
      required: [accountId, timeRange]
    outputSchema:
      type: object
      properties:
        transactions: { type: array }
        totalAmount: { type: number }
        flaggedCount: { type: integer }

  - name: getDeviceFingerprint
    displayName: Get Device Fingerprint
    endpoint: https://fraud-api.internal.bank.com/ai-tools/device-fp
    method: POST
    mode: read
    dataClassification: CONFIDENTIAL
    auth: managed-identity
    inputSchema:
      type: object
      properties:
        sessionId: { type: string }
      required: [sessionId]

  - name: flagTransaction
    displayName: Flag Transaction for Review
    endpoint: https://fraud-api.internal.bank.com/ai-tools/flag
    method: POST
    mode: write
    dataClassification: PCI
    dryRunSupported: true
    requiresApproval: true
    auth: managed-identity
    inputSchema:
      type: object
      properties:
        transactionId: { type: string }
        reason: { type: string }
        riskScore: { type: number }
      required: [transactionId, reason, riskScore]

policies:
  requiredScopes:
    - fraud:read
    - fraud:write
    - fraud:escalate
  maxRequestsPerMinute: 50
  maxTokensPerRequest: 6000
  allowedNetworks:
    - "*.internal.bank.com"
  approvalRules:
    - toolPattern: "flagTransaction"
      approvalType: single
      approverRole: fraud-analyst-senior`;

// ── Agent Workflows ──

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "suspicious-activity-sar",
    name: "Suspicious Activity → SAR Filing",
    description:
      "Cross-domain investigation pipeline: three wire transfers totaling $148K to offshore jurisdictions from a dormant account trigger fraud analysis, AML investigation, risk profiling, and regulatory filing.",
    category: "Cross-Domain",
    agents: [
      {
        id: "fraud-intel",
        name: "Fraud Intelligence Agent",
        domain: "Credit Cards",
        role: "Investigation",
        toolsUsed: ["analyzeTransactionPatterns", "crossRefFraudDB", "scoreTransactionRisk", "profileCustomerBehavior", "flagTransaction"],
        avgDurationMs: 2800,
        successRate: 97.3,
      },
      {
        id: "aml-investigation",
        name: "AML Investigation Agent",
        domain: "Risk & Compliance",
        role: "Investigation",
        toolsUsed: ["traceFundFlows", "screenSanctions", "buildEntityGraph", "scoreAMLRisk", "generateEvidenceChain"],
        avgDurationMs: 4200,
        successRate: 95.8,
      },
      {
        id: "customer-risk-profiler",
        name: "Customer Risk Profiler",
        domain: "Risk & Compliance",
        role: "Analysis",
        toolsUsed: ["aggregateBehavioralSignals", "analyzeVelocity", "assessGeographicRisk", "mapRelationships", "computeCompositeScore"],
        avgDurationMs: 3100,
        successRate: 96.4,
      },
      {
        id: "regulatory-filing",
        name: "Regulatory Filing Agent",
        domain: "Risk & Compliance",
        role: "Compliance",
        toolsUsed: ["compileEvidence", "validateFinCENSchema", "checkCompleteness", "stageSubmission", "generateAuditTrail"],
        avgDurationMs: 3600,
        successRate: 99.1,
      },
    ],
    connections: [
      {
        fromAgentId: "fraud-intel",
        toAgentId: "aml-investigation",
        dataPassed: "Flagged transactions, fraud scores, structuring indicators",
      },
      {
        fromAgentId: "fraud-intel",
        toAgentId: "customer-risk-profiler",
        dataPassed: "Customer profile, behavioral anomalies, transaction history",
      },
      {
        fromAgentId: "aml-investigation",
        toAgentId: "regulatory-filing",
        dataPassed: "Fund flow analysis, entity graph, AML risk score, evidence chain",
      },
      {
        fromAgentId: "customer-risk-profiler",
        toAgentId: "regulatory-filing",
        dataPassed: "Composite risk score, relationship map, geographic risk assessment",
      },
    ],
    metrics: { totalRuns: 342, successRate: 97.8, avgDuration: "13.7s" },
    runResult: [
      {
        agentId: "fraud-intel",
        status: "completed",
        inputData: {
          accountId: "ACC-MC-7741",
          accountHolder: "Marcus Chen",
          alertType: "structuring_detection",
          transactions: [
            { id: "WR-0841", amount: 49500, destination: "Cayman Islands", date: "2026-02-28" },
            { id: "WR-0842", amount: 49800, destination: "Isle of Man", date: "2026-03-01" },
            { id: "WR-0843", amount: 48700, destination: "Singapore (shell corp)", date: "2026-03-02" },
          ],
        },
        outputData: {
          fraudScore: 0.96,
          structuringDetected: true,
          pattern: "sub-$50K wires across 3 jurisdictions in 72 hours",
          accountDormancyDays: 247,
          totalExposure: 148000,
          flaggedForSAR: true,
        },
        reasoning:
          "Three outbound wires totaling $148,000 detected from account ACC-MC-7741 (Marcus Chen) — dormant for 247 days. Each transaction structured just below the $50,000 reporting threshold: $49,500 to Cayman Islands, $49,800 to Isle of Man, $48,700 to a Singapore shell corporation. Classic structuring pattern with 96% fraud confidence. Flagging for immediate AML investigation and parallel risk profiling.",
        tokensUsed: 480,
        durationMs: 2650,
      },
      {
        agentId: "aml-investigation",
        status: "completed",
        inputData: {
          accountId: "ACC-MC-7741",
          flaggedTransactions: ["WR-0841", "WR-0842", "WR-0843"],
          structuringDetected: true,
          totalAmount: 148000,
        },
        outputData: {
          fundFlowTraced: true,
          sanctionsHits: 0,
          shellCorpsIdentified: 2,
          entityGraphNodes: 7,
          amlRiskScore: 0.93,
          evidenceChainItems: 14,
          sarRecommendation: "file_immediately",
        },
        reasoning:
          "Fund flow analysis complete: traced $148K across 3 jurisdictions. Two receiving entities (Isle of Man Ltd, Singapore PTE) are shell corporations with no operating history. Entity graph reveals 7 connected nodes including 2 additional dormant accounts at other institutions. Zero sanctions hits but high-risk geography profile. AML risk score: 0.93. Evidence chain compiled with 14 artifacts including wire instructions, KYC gaps, and beneficial ownership discrepancies. Recommending immediate SAR filing.",
        tokensUsed: 620,
        durationMs: 4100,
      },
      {
        agentId: "customer-risk-profiler",
        status: "completed",
        inputData: {
          customerId: "CUST-MC-7741",
          accountId: "ACC-MC-7741",
          flaggedBehavior: "structuring",
        },
        outputData: {
          compositeRiskScore: 0.91,
          behavioralAnomalies: ["account_reactivation", "rapid_high_value_wires", "new_international_destinations"],
          velocityScore: 0.95,
          geographicRiskScore: 0.88,
          relationshipRiskNodes: 4,
          riskTier: "critical",
        },
        reasoning:
          "Customer risk profile assembled for Marcus Chen. Behavioral signals: account dormant 247 days then sudden reactivation with 3 high-value wires. Velocity score 0.95 — $148K moved in 72 hours versus $0 in prior 8 months. Geographic risk 0.88 — all destinations are high-risk jurisdictions with no prior customer activity. Relationship mapping reveals 4 connected entities across 2 jurisdictions, none with established banking relationships. Composite risk: 0.91 (critical tier).",
        tokensUsed: 510,
        durationMs: 2950,
      },
      {
        agentId: "regulatory-filing",
        status: "completed",
        inputData: {
          sarType: "structuring",
          subjectName: "Marcus Chen",
          amlRiskScore: 0.93,
          compositeRiskScore: 0.91,
          evidenceItems: 14,
          totalAmount: 148000,
        },
        outputData: {
          sarId: "SAR-2026-0302-MC-7741",
          filingStatus: "staged_for_submission",
          finCENValidation: "passed",
          completenessScore: 98.5,
          auditTrailEntries: 23,
          narrativeGenerated: true,
        },
        reasoning:
          "SAR compilation complete for Marcus Chen (SAR-2026-0302-MC-7741). FinCEN schema validation passed — all required fields populated. Completeness score: 98.5%. Generated narrative covering structuring pattern, fund flow analysis, entity relationships, and risk assessment. Audit trail: 23 entries documenting full investigation chain from initial detection through filing. SAR staged for compliance officer review and submission within 24-hour regulatory window.",
        tokensUsed: 450,
        durationMs: 3450,
      },
    ],
    weeklyPerformance: [
      { week: "W1 Jan", successRate: 95.1 },
      { week: "W2 Jan", successRate: 95.5 },
      { week: "W3 Jan", successRate: 96.0 },
      { week: "W4 Jan", successRate: 96.3 },
      { week: "W1 Feb", successRate: 96.5 },
      { week: "W2 Feb", successRate: 96.8 },
      { week: "W3 Feb", successRate: 97.0 },
      { week: "W4 Feb", successRate: 97.2 },
      { week: "W1 Mar", successRate: 97.4 },
      { week: "W2 Mar", successRate: 97.5 },
      { week: "W3 Mar", successRate: 97.7 },
      { week: "W4 Mar", successRate: 97.8 },
    ],
  },
  {
    id: "enterprise-incident-continuity",
    name: "Enterprise Incident → Business Continuity",
    description:
      "Cross-domain incident response: payment gateway JVM heap exhaustion triggers parallel infrastructure remediation and customer impact analysis, converging on coordinated communications.",
    category: "Cross-Domain",
    agents: [
      {
        id: "incident-commander",
        name: "Incident Commander Agent",
        domain: "Platform Operations",
        role: "Orchestration",
        toolsUsed: ["triageAlerts", "correlateMonitoringSystems", "classifySeverity", "assignResponseTracks", "coordinateWorkstreams"],
        avgDurationMs: 1400,
        successRate: 99.2,
      },
      {
        id: "infra-remediation",
        name: "Infrastructure Remediation Agent",
        domain: "Platform Operations",
        role: "Remediation",
        toolsUsed: ["analyzeResourceMetrics", "identifyBottlenecks", "executeRunbook", "validateHealth", "updateBaselines"],
        avgDurationMs: 3200,
        successRate: 94.6,
      },
      {
        id: "attrition-prediction-inc",
        name: "Attrition Prediction Agent",
        domain: "Customer Intelligence",
        role: "Prediction",
        toolsUsed: ["analyzeEngagementDecay", "detectTransactionShifts", "monitorCompetitiveSignals", "scoreSentiment", "computeChurnProbability"],
        avgDurationMs: 2800,
        successRate: 96.1,
      },
      {
        id: "incident-comms",
        name: "Incident Communications Agent",
        domain: "Platform Operations",
        role: "Communication",
        toolsUsed: ["draftStatusUpdate", "sendMultiChannelNotification", "trackAcknowledgments", "compilePIR", "escalateToLeadership"],
        avgDurationMs: 1800,
        successRate: 98.7,
      },
    ],
    connections: [
      {
        fromAgentId: "incident-commander",
        toAgentId: "infra-remediation",
        dataPassed: "Severity classification, affected systems, assigned runbook",
      },
      {
        fromAgentId: "incident-commander",
        toAgentId: "attrition-prediction-inc",
        dataPassed: "Incident scope, affected customer count, estimated duration",
      },
      {
        fromAgentId: "infra-remediation",
        toAgentId: "incident-comms",
        dataPassed: "Remediation status, recovery metrics, actions performed",
      },
      {
        fromAgentId: "attrition-prediction-inc",
        toAgentId: "incident-comms",
        dataPassed: "Business impact assessment, at-risk customer segments, churn probability",
      },
    ],
    metrics: { totalRuns: 187, successRate: 94.8, avgDuration: "9.2s" },
    runResult: [
      {
        agentId: "incident-commander",
        status: "completed",
        inputData: {
          alertId: "ALT-2026-0302-P1-892",
          severity: "P1",
          service: "payment-gateway",
          errorRate: "47%",
          affectedCustomers: 34000,
          symptom: "JVM heap exhaustion, OOM kills",
        },
        outputData: {
          incidentId: "INC-2026-0302-892",
          classification: "infrastructure_critical",
          impactScope: "payment_processing_degraded",
          assignedRunbook: "RB-JVM-HEAP-001",
          responseTracksActivated: ["infra_remediation", "business_impact_analysis"],
          coordinationChannel: "#inc-892-war-room",
        },
        reasoning:
          "P1 alert on payment-gateway: JVM heap exhaustion causing 47% error rate with OOM kills across 3 of 5 pods. 34,000 customers affected — transaction failures and timeouts. Classifying as infrastructure_critical. Activating dual response tracks: infrastructure remediation (runbook RB-JVM-HEAP-001) and parallel business impact analysis to assess customer attrition risk. War room channel created.",
        tokensUsed: 420,
        durationMs: 1350,
      },
      {
        agentId: "infra-remediation",
        status: "completed",
        inputData: {
          incidentId: "INC-2026-0302-892",
          service: "payment-gateway",
          runbookId: "RB-JVM-HEAP-001",
          symptom: "JVM heap exhaustion",
        },
        outputData: {
          rootCause: "memory_leak_in_serialization_cache",
          actionsPerformed: [
            "Forced GC on surviving pods",
            "Rolling restart with -Xmx increase to 4G",
            "Deployed hotfix disabling unbounded cache",
            "Scaled replicas 5→8 for recovery burst",
          ],
          recoveryTime: "3m 42s",
          errorRateAfter: "0.4%",
          healthCheckStatus: "all_green",
          baselineUpdated: true,
        },
        reasoning:
          "Resource analysis: JVM heap at 98.7% across pods, GC pause times 4.2s (10x normal). Root cause: unbounded serialization cache growing without eviction — introduced in deploy v2.14.3 yesterday. Executing 4-step remediation: (1) Forced GC on 2 surviving pods to buy time, (2) Rolling restart with heap increase 2G→4G, (3) Deployed hotfix disabling the unbounded cache, (4) Scaled 5→8 replicas for recovery burst. Error rate dropped from 47% to 0.4% in 3m 42s. All health checks green. Baseline updated.",
        tokensUsed: 580,
        durationMs: 3100,
      },
      {
        agentId: "attrition-prediction-inc",
        status: "completed",
        inputData: {
          incidentId: "INC-2026-0302-892",
          affectedCustomers: 34000,
          errorRate: "47%",
          estimatedDuration: "15 minutes",
          serviceAffected: "payment_processing",
        },
        outputData: {
          customersImpacted: 34000,
          transactionsAffected: 8200,
          estimatedRevenueAtRisk: 2100000,
          highValueCustomersAffected: 147,
          churnProbabilityIncrease: 0.034,
          atRiskSegment: "premium_cardholders",
          recommendedRetentionActions: ["proactive_apology", "fee_waiver", "priority_support"],
        },
        reasoning:
          "Business impact assessment: 34,000 customers experienced payment failures during 15-minute degradation. 8,200 transactions failed or timed out — estimated $2.1M in affected transaction volume. Critical finding: 147 high-value customers (platinum/wealth tier) impacted. Churn probability increase: +3.4% for affected segment. Premium cardholders identified as highest attrition risk. Recommending proactive outreach: personalized apology, automatic fee waiver for affected transactions, and priority support queue access.",
        tokensUsed: 490,
        durationMs: 2700,
      },
      {
        agentId: "incident-comms",
        status: "completed",
        inputData: {
          incidentId: "INC-2026-0302-892",
          remediationStatus: "resolved",
          recoveryTime: "3m 42s",
          businessImpact: {
            customersAffected: 34000,
            highValueAtRisk: 147,
            revenueAtRisk: 2100000,
          },
        },
        outputData: {
          statusUpdatesSent: 4,
          channelsNotified: ["slack_war_room", "email_leadership", "status_page", "customer_sms"],
          acknowledgmentsReceived: 12,
          pirDrafted: true,
          pirId: "PIR-2026-0302-892",
          leadershipBriefingScheduled: true,
        },
        reasoning:
          "Coordinated communications across 4 channels: (1) Slack war room — real-time updates to engineering, (2) Leadership email — business impact summary with $2.1M exposure and 147 high-value customers at risk, (3) Status page — public incident resolved notice, (4) SMS — proactive notification to affected premium customers. 12 acknowledgments received from stakeholders. Post-incident review drafted (PIR-2026-0302-892) with root cause, timeline, and 3 follow-up actions. Leadership briefing scheduled for tomorrow 9 AM.",
        tokensUsed: 440,
        durationMs: 1750,
      },
    ],
    weeklyPerformance: [
      { week: "W1 Jan", successRate: 91.2 },
      { week: "W2 Jan", successRate: 91.8 },
      { week: "W3 Jan", successRate: 92.1 },
      { week: "W4 Jan", successRate: 92.5 },
      { week: "W1 Feb", successRate: 92.8 },
      { week: "W2 Feb", successRate: 93.2 },
      { week: "W3 Feb", successRate: 93.5 },
      { week: "W4 Feb", successRate: 93.9 },
      { week: "W1 Mar", successRate: 94.1 },
      { week: "W2 Mar", successRate: 94.3 },
      { week: "W3 Mar", successRate: 94.6 },
      { week: "W4 Mar", successRate: 94.8 },
    ],
  },
  {
    id: "high-value-retention",
    name: "High-Value Customer Retention",
    description:
      "Cross-domain retention workflow: platinum wealth client Dr. Priya Ramanathan ($2.34M relationship) showing 78% churn probability triggers parallel risk assessment and offer design, converging on orchestrated intervention.",
    category: "Cross-Domain",
    agents: [
      {
        id: "attrition-prediction",
        name: "Attrition Prediction Agent",
        domain: "Customer Intelligence",
        role: "Prediction",
        toolsUsed: ["analyzeEngagementDecay", "detectTransactionShifts", "monitorCompetitiveSignals", "scoreSentiment", "computeChurnProbability"],
        avgDurationMs: 2600,
        successRate: 96.5,
      },
      {
        id: "customer-risk-profiler-ret",
        name: "Customer Risk Profiler",
        domain: "Risk & Compliance",
        role: "Analysis",
        toolsUsed: ["aggregateBehavioralSignals", "analyzeVelocity", "assessGeographicRisk", "mapRelationships", "computeCompositeScore"],
        avgDurationMs: 2900,
        successRate: 96.8,
      },
      {
        id: "product-strategy",
        name: "Product Strategy Agent",
        domain: "Customer Intelligence",
        role: "Strategy",
        toolsUsed: ["evaluateProductFit", "modelOfferEconomics", "simulateAcceptanceProbability", "constructEngagementPlan", "assessCannibalization"],
        avgDurationMs: 3400,
        successRate: 95.2,
      },
      {
        id: "relationship-orchestrator",
        name: "Relationship Orchestrator Agent",
        domain: "Customer Intelligence",
        role: "Orchestration",
        toolsUsed: ["selectOutreachTiming", "personalizeRMBriefing", "coordinateChannels", "triggerDigitalIntervention", "measureEffectiveness"],
        avgDurationMs: 2200,
        successRate: 97.4,
      },
    ],
    connections: [
      {
        fromAgentId: "attrition-prediction",
        toAgentId: "customer-risk-profiler-ret",
        dataPassed: "Churn probability, engagement decay signals, behavioral shifts",
      },
      {
        fromAgentId: "attrition-prediction",
        toAgentId: "product-strategy",
        dataPassed: "Customer profile, product gaps, competitive signals",
      },
      {
        fromAgentId: "customer-risk-profiler-ret",
        toAgentId: "relationship-orchestrator",
        dataPassed: "Risk assessment, relationship value, regulatory constraints",
      },
      {
        fromAgentId: "product-strategy",
        toAgentId: "relationship-orchestrator",
        dataPassed: "Recommended offers, economics model, acceptance probability",
      },
    ],
    metrics: { totalRuns: 456, successRate: 95.6, avgDuration: "11.1s" },
    runResult: [
      {
        agentId: "attrition-prediction",
        status: "completed",
        inputData: {
          customerId: "CUST-PR-2341",
          customerName: "Dr. Priya Ramanathan",
          segment: "platinum_wealth",
          relationshipValue: 2340000,
          tenure: "12 years",
          products: ["platinum_card", "wealth_management", "private_banking", "mortgage"],
        },
        outputData: {
          churnProbability: 0.78,
          engagementDecayRate: 0.42,
          transactionVolumeChange: -34,
          competitiveSignals: ["competitor_app_usage_detected", "rate_comparison_searches"],
          sentimentScore: 0.31,
          timeToChurn: "45 days",
          primaryDrivers: ["fee_sensitivity", "digital_experience_gap", "competitor_wealth_offer"],
        },
        reasoning:
          "High-value attrition alert: Dr. Priya Ramanathan, platinum wealth client with $2.34M relationship spanning 12 years. Churn probability: 78%. Key signals: (1) Transaction volume down 34% over 90 days, (2) Engagement decay rate 0.42 — declining app logins and statement reviews, (3) Competitive signals detected — competitor wealth app installed, rate comparison searches in last 2 weeks, (4) Sentiment score dropped to 0.31 after recent fee dispute. Estimated 45 days to churn. Primary drivers: fee sensitivity, digital experience gap vs. competitors, and a competing wealth management offer.",
        tokensUsed: 520,
        durationMs: 2500,
      },
      {
        agentId: "customer-risk-profiler-ret",
        status: "completed",
        inputData: {
          customerId: "CUST-PR-2341",
          churnProbability: 0.78,
          relationshipValue: 2340000,
          segment: "platinum_wealth",
        },
        outputData: {
          compositeRiskScore: 0.82,
          revenueAtRisk: 187200,
          lifetimeValueRemaining: 4680000,
          relationshipDepth: 4,
          crossSellOpportunities: 2,
          retentionPriority: "critical",
          regulatoryConstraints: ["suitability_requirement", "cooling_off_period"],
        },
        reasoning:
          "Risk assessment for Dr. Ramanathan: composite risk score 0.82 (critical). Annual revenue at risk: $187,200. Remaining lifetime value estimate: $4.68M based on segment actuarial tables. Relationship depth: 4 active products — losing this client cascades across platinum card, wealth management, private banking, and mortgage. Cross-sell opportunity: international transfer premium and estate planning — could deepen relationship. Regulatory note: any retention offer must meet suitability requirements; wealth advisory changes require cooling-off period.",
        tokensUsed: 470,
        durationMs: 2800,
      },
      {
        agentId: "product-strategy",
        status: "completed",
        inputData: {
          customerId: "CUST-PR-2341",
          churnDrivers: ["fee_sensitivity", "digital_experience_gap", "competitor_wealth_offer"],
          currentProducts: ["platinum_card", "wealth_management", "private_banking", "mortgage"],
          competitorOffer: "wealth_management_0.5%_lower_fee",
        },
        outputData: {
          recommendedOffers: [
            { type: "fee_reduction", details: "Waive annual fee for 2 years ($950 value)", acceptanceProbability: 0.72 },
            { type: "rate_match", details: "Match competitor wealth mgmt fee (0.5% reduction)", acceptanceProbability: 0.68 },
            { type: "exclusive_access", details: "Private wealth digital platform early access", acceptanceProbability: 0.81 },
          ],
          bundleEconomics: { costToRetain: 42000, revenueProtected: 187200, roi: 3.46 },
          cannibalizationRisk: "low",
          optimalBundle: "fee_waiver_plus_digital_access",
        },
        reasoning:
          "Product strategy analysis: modeled 3 retention offers against Dr. Ramanathan's churn drivers. (1) Fee waiver: $950/year for 2 years, 72% acceptance probability — directly addresses fee sensitivity. (2) Rate match: 0.5% wealth mgmt fee reduction, 68% acceptance — matches competitor but erodes margin. (3) Exclusive digital platform access: 81% highest acceptance probability — addresses experience gap and signals investment in relationship. Optimal bundle: fee waiver + digital access. Economics: $42K retention cost protects $187K annual revenue — 3.46x ROI. Cannibalization risk low — no product substitution effects.",
        tokensUsed: 560,
        durationMs: 3300,
      },
      {
        agentId: "relationship-orchestrator",
        status: "completed",
        inputData: {
          customerId: "CUST-PR-2341",
          retentionPriority: "critical",
          recommendedBundle: "fee_waiver_plus_digital_access",
          acceptanceProbability: 0.81,
          regulatoryConstraints: ["suitability_requirement", "cooling_off_period"],
        },
        outputData: {
          outreachTiming: "2026-03-04T10:00:00Z",
          outreachChannel: "rm_personal_call",
          rmBriefingGenerated: true,
          rmId: "RM-Sarah-Chen",
          digitalInterventionTriggered: true,
          interventionDetails: "personalized_app_experience_preview",
          effectivenessTracking: { checkpoints: ["48h_response", "7d_engagement", "30d_retention"] },
          escalationPath: "wealth_director_if_no_response_72h",
        },
        reasoning:
          "Orchestrating retention intervention for Dr. Ramanathan. Optimal timing: Tuesday 10 AM (her highest engagement window based on historical interaction data). Channel: personal call from RM Sarah Chen — highest conversion for platinum clients. RM briefing generated with full context: churn signals, relationship history, authorized offer bundle, and regulatory guardrails. Parallel digital intervention: personalized app preview of new wealth platform sent via push notification. Effectiveness tracking: 48-hour response check, 7-day engagement measurement, 30-day retention confirmation. Escalation: if no response in 72 hours, escalate to Wealth Director for executive outreach.",
        tokensUsed: 480,
        durationMs: 2150,
      },
    ],
    weeklyPerformance: [
      { week: "W1 Jan", successRate: 93.0 },
      { week: "W2 Jan", successRate: 93.4 },
      { week: "W3 Jan", successRate: 93.7 },
      { week: "W4 Jan", successRate: 94.0 },
      { week: "W1 Feb", successRate: 94.3 },
      { week: "W2 Feb", successRate: 94.6 },
      { week: "W3 Feb", successRate: 94.8 },
      { week: "W4 Feb", successRate: 95.0 },
      { week: "W1 Mar", successRate: 95.2 },
      { week: "W2 Mar", successRate: 95.3 },
      { week: "W3 Mar", successRate: 95.5 },
      { week: "W4 Mar", successRate: 95.6 },
    ],
  },
];

// ── Workflow Builder Palette ──

export const PALETTE_AGENTS: PaletteAgent[] = [
  // Credit Cards
  {
    id: "pa-fraud-intel",
    name: "Fraud Intelligence Agent",
    domain: "Credit Cards",
    role: "Investigation",
    description: "Analyzes transaction patterns, cross-references fraud databases, scores risk, profiles customers, and flags suspicious transactions",
    toolsUsed: ["analyzeTransactionPatterns", "crossRefFraudDB", "scoreTransactionRisk", "profileCustomerBehavior", "flagTransaction"],
    avgDurationMs: 2800,
    successRate: 97.3,
  },
  {
    id: "pa-dispute-resolution",
    name: "Dispute Resolution Agent",
    domain: "Credit Cards",
    role: "Adjudication",
    description: "Gathers merchant evidence, evaluates chargeback rules, calculates provisional credit, and renders dispute decisions",
    toolsUsed: ["gatherMerchantEvidence", "evaluateChargebackRules", "calculateProvisionalCredit", "renderDecision", "generateDisputeReport"],
    avgDurationMs: 3200,
    successRate: 95.8,
  },
  {
    id: "pa-credit-decisioning",
    name: "Credit Decisioning Agent",
    domain: "Credit Cards",
    role: "Underwriting",
    description: "Pulls credit bureau data, models debt scenarios, assesses risk tiers, and generates credit decisions with rationale",
    toolsUsed: ["pullCreditBureau", "modelDebtScenarios", "assessRiskTier", "generateDecision", "compileRationale"],
    avgDurationMs: 3600,
    successRate: 96.2,
  },
  // Risk & Compliance
  {
    id: "pa-aml-investigation",
    name: "AML Investigation Agent",
    domain: "Risk & Compliance",
    role: "Investigation",
    description: "Traces fund flows, screens sanctions lists, builds entity graphs, scores AML risk, and generates evidence chains",
    toolsUsed: ["traceFundFlows", "screenSanctions", "buildEntityGraph", "scoreAMLRisk", "generateEvidenceChain"],
    avgDurationMs: 4200,
    successRate: 95.8,
  },
  {
    id: "pa-regulatory-filing",
    name: "Regulatory Filing Agent",
    domain: "Risk & Compliance",
    role: "Compliance",
    description: "Compiles evidence packages, validates FinCEN schemas, checks completeness, stages submissions, and generates audit trails",
    toolsUsed: ["compileEvidence", "validateFinCENSchema", "checkCompleteness", "stageSubmission", "generateAuditTrail"],
    avgDurationMs: 3600,
    successRate: 99.1,
  },
  {
    id: "pa-customer-risk-profiler",
    name: "Customer Risk Profiler",
    domain: "Risk & Compliance",
    role: "Analysis",
    description: "Aggregates behavioral signals, analyzes velocity, assesses geographic risk, maps relationships, and computes composite scores",
    toolsUsed: ["aggregateBehavioralSignals", "analyzeVelocity", "assessGeographicRisk", "mapRelationships", "computeCompositeScore"],
    avgDurationMs: 3100,
    successRate: 96.4,
  },
  // Platform Operations
  {
    id: "pa-incident-commander",
    name: "Incident Commander Agent",
    domain: "Platform Operations",
    role: "Orchestration",
    description: "Triages alerts, correlates monitoring systems, classifies severity, assigns response tracks, and coordinates workstreams",
    toolsUsed: ["triageAlerts", "correlateMonitoringSystems", "classifySeverity", "assignResponseTracks", "coordinateWorkstreams"],
    avgDurationMs: 1400,
    successRate: 99.2,
  },
  {
    id: "pa-infra-remediation",
    name: "Infrastructure Remediation Agent",
    domain: "Platform Operations",
    role: "Remediation",
    description: "Analyzes resource metrics, identifies bottlenecks, executes runbooks, validates health, and updates baselines",
    toolsUsed: ["analyzeResourceMetrics", "identifyBottlenecks", "executeRunbook", "validateHealth", "updateBaselines"],
    avgDurationMs: 3200,
    successRate: 94.6,
  },
  {
    id: "pa-incident-comms",
    name: "Incident Communications Agent",
    domain: "Platform Operations",
    role: "Communication",
    description: "Drafts status updates, sends multi-channel notifications, tracks acknowledgments, compiles PIRs, and escalates to leadership",
    toolsUsed: ["draftStatusUpdate", "sendMultiChannelNotification", "trackAcknowledgments", "compilePIR", "escalateToLeadership"],
    avgDurationMs: 1800,
    successRate: 98.7,
  },
  // Customer Intelligence
  {
    id: "pa-attrition-prediction",
    name: "Attrition Prediction Agent",
    domain: "Customer Intelligence",
    role: "Prediction",
    description: "Analyzes engagement decay, detects transaction shifts, monitors competitive signals, scores sentiment, and computes churn probability",
    toolsUsed: ["analyzeEngagementDecay", "detectTransactionShifts", "monitorCompetitiveSignals", "scoreSentiment", "computeChurnProbability"],
    avgDurationMs: 2600,
    successRate: 96.5,
  },
  {
    id: "pa-product-strategy",
    name: "Product Strategy Agent",
    domain: "Customer Intelligence",
    role: "Strategy",
    description: "Evaluates product fit, models offer economics, simulates acceptance probability, constructs engagement plans, and assesses cannibalization",
    toolsUsed: ["evaluateProductFit", "modelOfferEconomics", "simulateAcceptanceProbability", "constructEngagementPlan", "assessCannibalization"],
    avgDurationMs: 3400,
    successRate: 95.2,
  },
  {
    id: "pa-relationship-orchestrator",
    name: "Relationship Orchestrator Agent",
    domain: "Customer Intelligence",
    role: "Orchestration",
    description: "Selects outreach timing, personalizes RM briefings, coordinates channels, triggers digital interventions, and measures effectiveness",
    toolsUsed: ["selectOutreachTiming", "personalizeRMBriefing", "coordinateChannels", "triggerDigitalIntervention", "measureEffectiveness"],
    avgDurationMs: 2200,
    successRate: 97.4,
  },
];

export const WORKFLOW_CANVAS_LAYOUTS: WorkflowCanvasLayout[] = [
  {
    templateId: "suspicious-activity-sar",
    positions: {
      "fraud-intel": { x: 0, y: 200 },
      "aml-investigation": { x: 380, y: 60 },
      "customer-risk-profiler": { x: 380, y: 340 },
      "regulatory-filing": { x: 760, y: 200 },
    },
  },
  {
    templateId: "enterprise-incident-continuity",
    positions: {
      "incident-commander": { x: 0, y: 200 },
      "infra-remediation": { x: 380, y: 60 },
      "attrition-prediction-inc": { x: 380, y: 340 },
      "incident-comms": { x: 760, y: 200 },
    },
  },
  {
    templateId: "high-value-retention",
    positions: {
      "attrition-prediction": { x: 0, y: 200 },
      "customer-risk-profiler-ret": { x: 380, y: 60 },
      "product-strategy": { x: 380, y: 340 },
      "relationship-orchestrator": { x: 760, y: 200 },
    },
  },
];

// ── Cross-Domain AI Learning ──

export const LEARNING_METRICS = {
  accuracyImprovement: 8.7,
  totalEvents: 147,
  crossDomainTransfers: 12,
  avgConfidence: 94.2,
};

export const LEARNING_TIME_SERIES: LearningTimeSeriesPoint[] = [
  { week: "Dec W1", accuracy: 85.2, confidence: 86.1, responseQuality: 82.4, toolSelectionAccuracy: 88.3, escalationAccuracy: 79.5, resolutionSpeed: 81.0 },
  { week: "Dec W2", accuracy: 85.8, confidence: 86.9, responseQuality: 83.1, toolSelectionAccuracy: 88.9, escalationAccuracy: 80.2, resolutionSpeed: 81.8 },
  { week: "Dec W3", accuracy: 86.3, confidence: 87.5, responseQuality: 83.8, toolSelectionAccuracy: 89.4, escalationAccuracy: 81.0, resolutionSpeed: 82.5 },
  { week: "Dec W4", accuracy: 86.9, confidence: 88.0, responseQuality: 84.5, toolSelectionAccuracy: 89.8, escalationAccuracy: 81.7, resolutionSpeed: 83.2 },
  { week: "Jan W1", accuracy: 87.5, confidence: 88.6, responseQuality: 85.2, toolSelectionAccuracy: 90.3, escalationAccuracy: 82.5, resolutionSpeed: 84.0 },
  { week: "Jan W2", accuracy: 88.0, confidence: 89.1, responseQuality: 85.8, toolSelectionAccuracy: 90.8, escalationAccuracy: 83.2, resolutionSpeed: 84.7 },
  { week: "Jan W3", accuracy: 88.5, confidence: 89.7, responseQuality: 86.5, toolSelectionAccuracy: 91.2, escalationAccuracy: 83.9, resolutionSpeed: 85.4 },
  { week: "Jan W4", accuracy: 89.1, confidence: 90.2, responseQuality: 87.1, toolSelectionAccuracy: 91.7, escalationAccuracy: 84.7, resolutionSpeed: 86.1 },
  { week: "Feb W1", accuracy: 89.6, confidence: 90.8, responseQuality: 87.8, toolSelectionAccuracy: 92.1, escalationAccuracy: 85.4, resolutionSpeed: 86.8 },
  { week: "Feb W2", accuracy: 90.2, confidence: 91.3, responseQuality: 88.4, toolSelectionAccuracy: 92.6, escalationAccuracy: 86.1, resolutionSpeed: 87.5 },
  { week: "Feb W3", accuracy: 90.7, confidence: 91.9, responseQuality: 89.0, toolSelectionAccuracy: 93.0, escalationAccuracy: 86.8, resolutionSpeed: 88.2 },
  { week: "Feb W4", accuracy: 91.3, confidence: 92.4, responseQuality: 89.6, toolSelectionAccuracy: 93.4, escalationAccuracy: 87.5, resolutionSpeed: 88.9 },
  { week: "Mar W1", accuracy: 91.8, confidence: 93.0, responseQuality: 90.2, toolSelectionAccuracy: 93.9, escalationAccuracy: 88.2, resolutionSpeed: 89.6 },
  { week: "Mar W2", accuracy: 92.4, confidence: 93.5, responseQuality: 90.8, toolSelectionAccuracy: 94.3, escalationAccuracy: 88.9, resolutionSpeed: 90.3 },
  { week: "Mar W3", accuracy: 92.9, confidence: 94.0, responseQuality: 91.1, toolSelectionAccuracy: 94.7, escalationAccuracy: 89.3, resolutionSpeed: 90.7 },
  { week: "Mar W4", accuracy: 93.9, confidence: 94.2, responseQuality: 91.5, toolSelectionAccuracy: 95.0, escalationAccuracy: 89.8, resolutionSpeed: 91.2 },
];

export const LEARNING_EVENTS: LearningEvent[] = [
  {
    id: "le-001",
    timestamp: "2026-03-02T14:22:00Z",
    category: "resolution_speed",
    sourceDomain: "Credit Card Servicing",
    targetDomain: "Credit Card Servicing",
    title: "Prioritize fraud check on 'unauthorized charge' keyword",
    description:
      "When customer mentions 'unauthorized charge', skip balance inquiry and go directly to fraud detection — reduces resolution time by 23%.",
    impact: "+23%",
    impactValue: 23,
    confidence: 96.3,
    type: "pattern_learned",
  },
  {
    id: "le-002",
    timestamp: "2026-03-02T12:15:00Z",
    category: "tool_selection",
    sourceDomain: "Production Support",
    targetDomain: "Production Support",
    title: "Check connection pools before restarting services",
    description:
      "Learned to check connection pool metrics before initiating service restarts — reduced unnecessary restarts by 41%.",
    impact: "-41%",
    impactValue: 41,
    confidence: 93.8,
    type: "self_correction",
  },
  {
    id: "le-003",
    timestamp: "2026-03-02T10:30:00Z",
    category: "escalation_accuracy",
    sourceDomain: "Credit Card Servicing",
    targetDomain: "Production Support",
    title: "Urgency detection transfer: customer tone analysis",
    description:
      "Transferred urgency detection patterns from customer interactions to production alert triage — improved P1 detection accuracy by 18%.",
    impact: "+18%",
    impactValue: 18,
    confidence: 91.5,
    type: "cross_domain_transfer",
  },
  {
    id: "le-004",
    timestamp: "2026-03-01T16:45:00Z",
    category: "response_quality",
    sourceDomain: "Credit Card Servicing",
    targetDomain: "Credit Card Servicing",
    title: "Include estimated timeline in fraud responses",
    description:
      "Learned that including resolution timeline in fraud notification messages reduces customer callback rate by 35%.",
    impact: "-35%",
    impactValue: 35,
    confidence: 94.7,
    type: "pattern_learned",
  },
  {
    id: "le-005",
    timestamp: "2026-03-01T14:20:00Z",
    category: "tool_selection",
    sourceDomain: "Production Support",
    targetDomain: "Credit Card Servicing",
    title: "Root cause analysis pattern applied to dispute triage",
    description:
      "Applied production support root cause analysis methodology to credit card disputes — improved first-contact resolution by 27%.",
    impact: "+27%",
    impactValue: 27,
    confidence: 89.2,
    type: "cross_domain_transfer",
  },
  {
    id: "le-006",
    timestamp: "2026-03-01T09:10:00Z",
    category: "resolution_speed",
    sourceDomain: "Production Support",
    targetDomain: "Production Support",
    title: "Parallel diagnostics for multi-service incidents",
    description:
      "Learned to run log analysis and metrics queries in parallel for multi-service incidents — reduced diagnostic time by 52%.",
    impact: "-52%",
    impactValue: 52,
    confidence: 97.1,
    type: "self_correction",
  },
  {
    id: "le-007",
    timestamp: "2026-02-28T15:30:00Z",
    category: "escalation_accuracy",
    sourceDomain: "Credit Card Servicing",
    targetDomain: "Credit Card Servicing",
    title: "Adjusted fraud escalation threshold from 0.65 to 0.72",
    description:
      "Fine-tuned fraud escalation threshold based on 30-day analysis — reduced false escalations by 31% while maintaining 99.2% true positive rate.",
    impact: "-31%",
    impactValue: 31,
    confidence: 95.8,
    type: "threshold_adjustment",
  },
  {
    id: "le-008",
    timestamp: "2026-02-28T11:00:00Z",
    category: "response_quality",
    sourceDomain: "Production Support",
    targetDomain: "Production Support",
    title: "Structured incident updates improve stakeholder clarity",
    description:
      "Adopting 'Impact / Root Cause / ETA / Actions' format for status updates improved stakeholder satisfaction scores by 44%.",
    impact: "+44%",
    impactValue: 44,
    confidence: 92.4,
    type: "pattern_learned",
  },
  {
    id: "le-009",
    timestamp: "2026-02-27T16:15:00Z",
    category: "tool_selection",
    sourceDomain: "Credit Card Servicing",
    targetDomain: "Credit Card Servicing",
    title: "Use getShipmentStatus before escalating delivery complaints",
    description:
      "Check shipment status first for delivery complaints instead of immediately escalating — resolved 68% of cases without human intervention.",
    impact: "+68%",
    impactValue: 68,
    confidence: 98.1,
    type: "self_correction",
  },
  {
    id: "le-010",
    timestamp: "2026-02-27T10:45:00Z",
    category: "resolution_speed",
    sourceDomain: "Credit Card Servicing",
    targetDomain: "Production Support",
    title: "Customer-facing communication patterns improve incident comms",
    description:
      "Applied credit card servicing's empathetic communication patterns to production incident stakeholder updates — improved response time acknowledgment by 29%.",
    impact: "+29%",
    impactValue: 29,
    confidence: 87.6,
    type: "cross_domain_transfer",
  },
  {
    id: "le-011",
    timestamp: "2026-02-26T14:30:00Z",
    category: "escalation_accuracy",
    sourceDomain: "Production Support",
    targetDomain: "Production Support",
    title: "Calibrated P1/P2 severity classification",
    description:
      "Recalibrated incident severity based on business impact metrics instead of error rate alone — P1 classification accuracy improved by 22%.",
    impact: "+22%",
    impactValue: 22,
    confidence: 93.0,
    type: "threshold_adjustment",
  },
  {
    id: "le-012",
    timestamp: "2026-02-25T09:00:00Z",
    category: "response_quality",
    sourceDomain: "Credit Card Servicing",
    targetDomain: "Credit Card Servicing",
    title: "Proactive balance alerts reduce inbound volume",
    description:
      "Sending proactive low-balance alerts with payment links reduced related inbound inquiries by 19%.",
    impact: "-19%",
    impactValue: 19,
    confidence: 90.5,
    type: "pattern_learned",
  },
];

export const BEFORE_AFTER_COMPARISONS: BeforeAfterComparison[] = [
  {
    id: "ba-001",
    title: "Fraud Detection Response",
    category: "Credit Card Servicing",
    scenario:
      "Customer reports an unauthorized $500 charge at an online electronics store. Account has no prior fraud history.",
    beforeResponse:
      "I see a charge of $500 at ElectroStore on your account. I'll flag this as potentially fraudulent and our fraud team will investigate. You should hear back within 5-7 business days. Is there anything else I can help with?",
    afterResponse:
      "I can see the $500 charge at ElectroStore on your card ending 4821. I've already checked your recent activity and this merchant doesn't match your spending pattern. I'm initiating an immediate fraud investigation and temporarily freezing this card to prevent further charges. A replacement card will arrive in 2-3 business days. I've also issued a provisional credit of $500 while we investigate. You'll receive a confirmation email within the next few minutes. Would you like me to review any other recent charges?",
    beforeMetrics: {
      resolutionTime: 142,
      customerSatisfaction: 62,
      firstContactResolution: 45,
    },
    afterMetrics: {
      resolutionTime: 34,
      customerSatisfaction: 94,
      firstContactResolution: 91,
    },
  },
  {
    id: "ba-002",
    title: "Production Incident Diagnosis",
    category: "Production Support",
    scenario:
      "Payment gateway error rate spikes to 15%. Multiple services showing elevated latency.",
    beforeResponse:
      "Payment gateway is showing elevated errors. Restarting the payment-gateway service across all replicas. If the issue persists, escalating to the platform team.",
    afterResponse:
      "Payment gateway error rate at 15%. Before restarting, checking connection pool metrics: 487/500 connections active, 892 in queue. Root cause identified: stale connection leak after upstream timeout change at 14:15 UTC. Flushing 298 stale connections and adjusting idle timeout from 300s to 30s. Error rate recovering — down to 2.1% and dropping. Scaling replicas 3→5 temporarily to clear backlog. No restart needed.",
    beforeMetrics: {
      mttr: 18,
      falseRestarts: 34,
      rootCauseAccuracy: 52,
    },
    afterMetrics: {
      mttr: 4,
      falseRestarts: 8,
      rootCauseAccuracy: 89,
    },
  },
  {
    id: "ba-003",
    title: "Escalation Decision",
    category: "Credit Card Servicing",
    scenario:
      "Customer inquiring about a pending charge that appears duplicated. Amount is $47.50 at a grocery store.",
    beforeResponse:
      "I see the duplicate charge. This looks like potential fraud — escalating to our fraud team for immediate investigation. Your card may need to be frozen as a precaution.",
    afterResponse:
      "I can see two charges of $47.50 at FreshMart. This is very common with grocery stores — one is a pre-authorization hold that will drop off within 24-48 hours. Your actual balance will only reflect one charge. I can see the hold was placed 2 hours ago, so it should resolve by tomorrow. No fraud concern here. Would you like me to set up a notification for when the hold drops off?",
    beforeMetrics: {
      falseEscalations: 45,
      customerEffort: 78,
      accuracy: 61,
    },
    afterMetrics: {
      falseEscalations: 12,
      customerEffort: 22,
      accuracy: 94,
    },
  },
  {
    id: "ba-004",
    title: "Cross-Domain Knowledge Application",
    category: "Cross-Domain",
    scenario:
      "Production incident during peak credit card processing hours. Need to communicate impact to business stakeholders.",
    beforeResponse:
      "INCIDENT UPDATE: Payment processing service experiencing errors. Engineering team investigating. Will update when resolved.",
    afterResponse:
      "INCIDENT UPDATE — Payment Processing\n\nImpact: ~1,200 transactions/min affected (12% of normal volume). No data loss — transactions are queued.\n\nRoot Cause: Connection pool saturation in payment-gateway (identified, fix in progress).\n\nETA: Full recovery expected within 5 minutes. Queued transactions will process automatically.\n\nActions: Stale connections flushed, replicas scaling 3→5, monitoring recovery metrics in real-time.\n\nNext update in 5 minutes or upon resolution.",
    beforeMetrics: {
      stakeholderClarity: 32,
      followUpQuestions: 8,
      communicationScore: 41,
    },
    afterMetrics: {
      stakeholderClarity: 91,
      followUpQuestions: 1,
      communicationScore: 94,
    },
  },
];

export const CROSS_DOMAIN_TRANSFERS: CrossDomainTransfer[] = [
  {
    id: "cdt-001",
    patternName: "Urgency Detection",
    sourceDomain: "Credit Card Servicing",
    targetDomains: ["Production Support"],
    description:
      "Customer urgency patterns from credit card interactions (tone, keyword frequency, repeated contacts) applied to production alert severity classification. Improved P1 detection by recognizing business impact signals faster.",
    accuracyGain: 18.3,
    status: "active",
  },
  {
    id: "cdt-002",
    patternName: "Root Cause Analysis Methodology",
    sourceDomain: "Production Support",
    targetDomains: ["Credit Card Servicing"],
    description:
      "Systematic diagnostic approach from production incident investigation (check metrics → trace dependencies → identify root cause) applied to credit card dispute resolution. Reduced misclassification of transaction disputes.",
    accuracyGain: 27.1,
    status: "active",
  },
  {
    id: "cdt-003",
    patternName: "Escalation Calibration",
    sourceDomain: "Credit Card Servicing",
    targetDomains: ["Production Support"],
    description:
      "Risk-based escalation thresholds from fraud detection applied to incident severity assessment. Uses confidence scores and historical patterns rather than static rules to determine when human intervention is needed.",
    accuracyGain: 14.7,
    status: "evaluating",
  },
];

export const DOMAIN_LEARNING_SCORES = [
  {
    domain: "Credit Card Servicing",
    accuracyBefore: 84.1,
    accuracyCurrent: 93.2,
    improvement: 9.1,
    totalEvents: 82,
    topCategory: "response_quality" as const,
  },
  {
    domain: "Production Support",
    accuracyBefore: 86.3,
    accuracyCurrent: 94.6,
    improvement: 8.3,
    totalEvents: 65,
    topCategory: "tool_selection" as const,
  },
];
