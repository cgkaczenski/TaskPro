"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
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
import { Project } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

export const Navbar = ({ projects }: { projects: Project[] }) => {
  const router = useRouter();
  const params = useParams();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    const setSelectedProject = async () => {
      if (params && params.projectId) {
        const foundProject = projects.find(
          (project) => project.id === params.projectId
        );
        if (foundProject) {
          setCurrentProject(foundProject);
        }
      }
    };

    setSelectedProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className="fixed z-50 top-0 left-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <Button
          size="sm"
          className="rounded-sm hidden md:block h-auto  py-1.5 px-2"
        >
          Create
        </Button>

        <Button size="sm" className="rounded-sm block md:hidden">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <Select
          onValueChange={(value) => {
            const selectedProject = projects.find(
              (project) => project.id === value
            );
            if (selectedProject) {
              setCurrentProject(selectedProject);
              router.push(`/app/project/${selectedProject.id}`);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder={currentProject ? currentProject.name : ""}
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
