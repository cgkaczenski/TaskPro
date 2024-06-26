"use client";

import { useProject } from "@/hooks/use-project";
import { getProjectByBoardId } from "@/actions/project";
import { UserButton } from "@/components/auth/user-button";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormPopover } from "@/components/form/form-popover";
import { MobileSidebar } from "./mobile-sidebar";
import { useRouter, useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useEffect } from "react";

export const Navbar = () => {
  const router = useRouter();
  const params = useParams();
  const { projects, selectedProject, setSelectedProject } = useProject();

  useEffect(() => {
    const setSelectedProjectId = async () => {
      if (!selectedProject && params?.boardId) {
        const boardId = params.boardId as string;
        const project = await getProjectByBoardId(boardId);
        if (project && project.id) {
          setSelectedProject(project.id);
        }
      }
    };

    setSelectedProjectId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="fixed z-50 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo projectId={selectedProject?.id} />
        </div>
        {selectedProject && (
          <FormPopover align="start" side="bottom" sideOffset={18}>
            <Button
              size="sm"
              className="rounded-sm hidden md:block h-auto  py-1.5 px-2"
            >
              Create
            </Button>
          </FormPopover>
        )}
        <FormPopover>
          <Button size="sm" className="rounded-sm block md:hidden">
            <Plus className="h-4 w-4" />
          </Button>
        </FormPopover>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <Select
          value={selectedProject?.id || ""}
          onValueChange={(value) => {
            router.push(`/app/project/${value}`);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={selectedProject ? selectedProject.name : ""}
            />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <UserButton />
      </div>
    </nav>
  );
};
