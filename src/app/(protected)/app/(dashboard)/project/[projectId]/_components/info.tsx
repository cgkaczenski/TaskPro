"use client";

import Image from "next/image";
import { SquareGanttChart } from "lucide-react";
import { useProject } from "@/hooks/use-project";

export const Info = () => {
  const { selectedProject } = useProject();

  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        {selectedProject?.image ? (
          <Image
            fill
            src={selectedProject?.image!}
            alt="Project"
            className="rounded-md object-cover"
          />
        ) : (
          <SquareGanttChart className="w-full h-full rounded-md" />
        )}
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-xl">{selectedProject?.name}</p>
      </div>
    </div>
  );
};
