import type {
  Domain,
  AgentSession,
  PendingApproval,
  DashboardMetrics,
  ActivityFeedItem,
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
