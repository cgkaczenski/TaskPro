import { useContext } from "react";
import { ProjectContext } from "@/contexts/project-context-provider";

export function useProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error("useProject must be used within a ProjectContextProvider");
  }

  return context;
}
