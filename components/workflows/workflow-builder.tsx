"use client"

import { useState, useCallback, useEffect } from "react"
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  type Node,
  type Edge,
  type Connection,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { WorkflowCanvas } from "./workflow-canvas"
import { AgentPalette } from "./agent-palette"
import { WorkflowToolbar } from "./workflow-toolbar"
import { WorkflowSimulationPanel } from "./workflow-simulation-panel"
import type {
  WorkflowTemplate,
  PaletteAgent,
  WorkflowCanvasLayout,
  WorkflowNodeData,
  WorkflowEdgeData,
} from "@/lib/types"

interface WorkflowBuilderProps {
  templates: WorkflowTemplate[]
  paletteAgents: PaletteAgent[]
  canvasLayouts: WorkflowCanvasLayout[]
  initialTemplateId?: string
}

function WorkflowBuilderInner({
  templates,
  paletteAgents,
  canvasLayouts,
  initialTemplateId,
}: WorkflowBuilderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge<WorkflowEdgeData>>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [paletteCollapsed, setPaletteCollapsed] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [triggerRun, setTriggerRun] = useState(0)
  const { fitView } = useReactFlow()

  const selectedTemplate = selectedTemplateId
    ? templates.find((t) => t.id === selectedTemplateId) ?? null
    : null

  // Load template onto canvas
  const loadTemplate = useCallback(
    (templateId: string) => {
      const template = templates.find((t) => t.id === templateId)
      if (!template) return

      const layout = canvasLayouts.find((l) => l.templateId === templateId)

      const newNodes: Node<WorkflowNodeData>[] = template.agents.map((agent, i) => {
        const position = layout?.positions[agent.id] ?? { x: i * 320, y: 120 }
        return {
          id: agent.id,
          type: "agent",
          position,
          data: {
            agent: {
              id: agent.id,
              name: agent.name,
              domain: agent.domain as PaletteAgent["domain"],
              role: agent.role,
              description: "",
              toolsUsed: agent.toolsUsed,
              avgDurationMs: agent.avgDurationMs,
              successRate: agent.successRate,
            },
            simulationStatus: "idle",
          },
        }
      })

      const newEdges: Edge<WorkflowEdgeData>[] = template.connections.map((conn) => ({
        id: `e-${conn.fromAgentId}-${conn.toAgentId}`,
        source: conn.fromAgentId,
        target: conn.toAgentId,
        type: "agent",
        data: {
          dataPassed: conn.dataPassed,
          condition: conn.condition,
          animated: false,
        },
      }))

      setNodes(newNodes)
      setEdges(newEdges)
      setSelectedTemplateId(templateId)

      // Fit view after nodes render
      setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 100)
    },
    [templates, canvasLayouts, setNodes, setEdges, fitView]
  )

  // Load initial template if provided
  useEffect(() => {
    if (initialTemplateId) {
      loadTemplate(initialTemplateId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle template selection
  const handleSelectTemplate = useCallback(
    (templateId: string) => {
      loadTemplate(templateId)
    },
    [loadTemplate]
  )

  // Handle dropping agent from palette
  const handleDropAgent = useCallback(
    (agent: PaletteAgent, position: { x: number; y: number }) => {
      const newNode: Node<WorkflowNodeData> = {
        id: `${agent.id}-${Date.now()}`,
        type: "agent",
        position,
        data: {
          agent,
          simulationStatus: "idle",
        },
      }
      setNodes((prev) => [...prev, newNode])
      // Clear template selection since user is now customizing
      setSelectedTemplateId(null)
    },
    [setNodes]
  )

  // Handle connecting nodes
  const handleConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge<WorkflowEdgeData> = {
        ...connection,
        id: `e-${connection.source}-${connection.target}`,
        type: "agent",
        data: {
          dataPassed: "Data flow",
          animated: false,
        },
      } as Edge<WorkflowEdgeData>
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges]
  )

  // Clear canvas
  const handleClear = useCallback(() => {
    setNodes([])
    setEdges([])
    setSelectedTemplateId(null)
  }, [setNodes, setEdges])

  // Run simulation
  const handleRunSimulation = useCallback(() => {
    // Reset all node statuses first
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, simulationStatus: "idle" as const },
      }))
    )
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        data: { ...e.data!, animated: false },
      }))
    )
    setTriggerRun((prev) => prev + 1)
  }, [setNodes, setEdges])

  // Simulation callbacks
  const handleSimulationStart = useCallback(() => {
    setIsSimulating(true)
  }, [])

  const handleSimulationEnd = useCallback(() => {
    setIsSimulating(false)
  }, [])

  const handleAgentStatusChange = useCallback(
    (agentId: string, status: "idle" | "running" | "completed" | "failed") => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === agentId
            ? { ...n, data: { ...n.data, simulationStatus: status } }
            : n
        )
      )
    },
    [setNodes]
  )

  const handleEdgeAnimate = useCallback(
    (fromId: string, toId: string, animated: boolean) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.source === fromId && e.target === toId
            ? { ...e, data: { ...e.data!, animated } }
            : e
        )
      )
    },
    [setEdges]
  )

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 400 })
  }, [fitView])

  const canSimulate = selectedTemplate !== null && nodes.length > 0

  return (
    <div className="flex flex-col h-[calc(100vh-1px)] w-full overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <AgentPalette
          agents={paletteAgents}
          collapsed={paletteCollapsed}
          onToggle={() => setPaletteCollapsed(!paletteCollapsed)}
        />
        <div className="flex-1 relative">
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onDropAgent={handleDropAgent}
          />
          <WorkflowToolbar
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={handleSelectTemplate}
            onClear={handleClear}
            onRunSimulation={handleRunSimulation}
            onFitView={handleFitView}
            isSimulating={isSimulating}
            canSimulate={canSimulate}
            nodeCount={nodes.length}
          />
        </div>
      </div>
      <WorkflowSimulationPanel
        workflow={selectedTemplate}
        isSimulating={isSimulating}
        onSimulationStart={handleSimulationStart}
        onSimulationEnd={handleSimulationEnd}
        onAgentStatusChange={handleAgentStatusChange}
        onEdgeAnimate={handleEdgeAnimate}
        triggerRun={triggerRun}
      />
    </div>
  )
}

export function WorkflowBuilder(props: WorkflowBuilderProps) {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderInner {...props} />
    </ReactFlowProvider>
  )
}
