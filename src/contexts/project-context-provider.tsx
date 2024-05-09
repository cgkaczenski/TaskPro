"use client";

import { Project } from "@prisma/client";
import { createContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ProjectContextProviderProps = {
  data: Project[];
  children: React.ReactNode;
};

type TProjectContext = {
  projects: Project[];
  selectedProject: Project | undefined;
  setSelectedProject: (projectId: Project["id"]) => void;
};

export const ProjectContext = createContext<TProjectContext | null>(null);

export default function ProjectContextProvider({
  data: projects,
  children,
}: ProjectContextProviderProps) {
  return (
    <ProjectContextProviderContent data={projects}>
      {children}
    </ProjectContextProviderContent>
  );
}

function ProjectContextProviderContent({
  data,
  children,
}: ProjectContextProviderProps) {
  const params = useParams();
  const [projects, setProjects] = useState<Project[]>(data);
  const [selectedProjectId, setSelectedProjectId] = useState<
    Project["id"] | null
  >(null);

  useEffect(() => {
    if (params?.projectId) {
      setSelectedProjectId(params?.projectId as Project["id"]);
    }
  }, [params?.projectId]);

  const selectedProject = projects.find(
    (project) => project.id === selectedProjectId
  );

  const setSelectedProject = (projectId: Project["id"]) => {
    setSelectedProjectId(projectId);
  };

  return (
    <ProjectContext.Provider
      value={{ projects, selectedProject, setSelectedProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
