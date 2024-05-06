"use client";

import { useProject } from "@/hooks/use-project";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import Link from "next/link";
import { Plus } from "lucide-react";

import { NavItem } from "./nav-item";
import { useEffect, useState } from "react";

export const Sidebar = () => {
  const { projects, selectedProject } = useProject();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    projects.forEach((project) => {
      initialExpanded[project.id] = false;
    });
    if (selectedProject) {
      initialExpanded[selectedProject.id] = true;
    }
    setExpanded(initialExpanded);
  }, [projects, selectedProject]);

  const onExpand = (id: string) => {
    setExpanded((curr) => ({
      ...curr,
      [id]: !expanded[id],
    }));
  };

  return (
    <div>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Projects</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto"
        >
          <Link href="/app/project">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div>
        <Accordion
          type="multiple"
          value={Object.keys(expanded).filter((key) => expanded[key])}
          className="space-y-2"
        >
          {projects.map((project) => (
            <NavItem
              key={project.id}
              isActive={selectedProject?.id === project.id}
              isExpanded={expanded[project.id]}
              project={project}
              onExpand={onExpand}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );
};
