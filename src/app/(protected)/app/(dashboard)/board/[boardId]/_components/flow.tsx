import React from "react";
import ReactFlow, { Background, BackgroundVariant, Node } from "reactflow";

//TODO: add edges
//const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

interface FlowProps {
  nodes: Node[];
}

export default function Flow({ nodes }: FlowProps) {
  return (
    <>
      <div style={{ width: "90vw", height: "40vh" }}>
        <ReactFlow
          nodes={nodes}
          nodesConnectable={false}
          nodesDraggable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          panOnScroll={false}
          zoomOnPinch={false}
          preventScrolling={true}
        >
          <Background variant={BackgroundVariant.Lines} gap={102} size={1} />
        </ReactFlow>
      </div>
      {nodes.map((node) => (
        <div key={node.id} className="rounded-lg p-2 text-xs leading-5">
          {JSON.stringify(node)}
        </div>
      ))}
    </>
  );
}
