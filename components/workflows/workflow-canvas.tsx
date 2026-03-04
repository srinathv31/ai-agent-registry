"use client"

import { useCallback, type DragEvent } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
  BackgroundVariant,
} from "@xyflow/react"
import { AgentNode } from "./agent-node"
import { AgentEdge } from "./agent-edge"
import type { PaletteAgent, WorkflowNodeData, WorkflowEdgeData } from "@/lib/types"

const nodeTypes = { agent: AgentNode }
const edgeTypes = { agent: AgentEdge }

interface WorkflowCanvasProps {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge<WorkflowEdgeData>[]
  onNodesChange: OnNodesChange<Node<WorkflowNodeData>>
  onEdgesChange: OnEdgesChange<Edge<WorkflowEdgeData>>
  onConnect: OnConnect
  onDropAgent: (agent: PaletteAgent, position: { x: number; y: number }) => void
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDropAgent,
}: WorkflowCanvasProps) {
  const { screenToFlowPosition } = useReactFlow()

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()
      const raw = event.dataTransfer.getData("application/reactflow-agent")
      if (!raw) return

      try {
        const agent: PaletteAgent = JSON.parse(raw)
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })
        onDropAgent(agent, position)
      } catch {
        // Invalid drag data
      }
    },
    [screenToFlowPosition, onDropAgent]
  )

  const handleConnect = useCallback(
    (connection: Connection) => {
      onConnect(connection)
    },
    [onConnect]
  )

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{
          type: "agent",
          animated: false,
        }}
        snapToGrid
        snapGrid={[20, 20]}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        className="workflow-canvas"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="workflow-controls"
        />
        <MiniMap
          nodeStrokeWidth={3}
          className="workflow-minimap"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  )
}
