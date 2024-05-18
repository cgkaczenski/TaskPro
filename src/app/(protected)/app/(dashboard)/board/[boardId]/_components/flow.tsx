import React from "react";
import ReactFlow, { Background, BackgroundVariant, Node } from "reactflow";

interface FlowProps {
  nodes: Node[];
}

export default function Flow({ nodes }: FlowProps) {
  return (
    <>
      <div style={{ width: "90vw", height: "40vh" }} className="relative">
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
          <Background variant={BackgroundVariant.Cross} />
        </ReactFlow>
        <div className="absolute inset-0 cursor-default"></div>
      </div>
    </>
  );
}
