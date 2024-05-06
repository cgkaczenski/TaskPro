"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Users, Settings } from "lucide-react";

interface SidebarProps {
  onClick: (index: number) => void;
  activeIndex: number;
}

export const Sidebar = ({ onClick, activeIndex }: SidebarProps) => {
  const handleClick = (index: number) => {
    onClick(index);
  };

  return (
    <>
      <Button
        key="1"
        size="sm"
        onClick={() => handleClick(0)}
        className={cn(
          "w-full font-normal justify-start pl-10 mb-1",
          activeIndex === 0 && "bg-sky-500/10 text-sky-700"
        )}
        variant="ghost"
      >
        {<Users className="h-4 w-4 mr-2" />}
        {"Members"}
      </Button>
      <Button
        key="2"
        size="sm"
        onClick={() => handleClick(2)}
        className={cn(
          "w-full font-normal justify-start pl-10 mb-1",
          activeIndex === 2 && "bg-sky-500/10 text-sky-700"
        )}
        variant="ghost"
      >
        {<Settings className="h-4 w-4 mr-2" />}
        {"Settings"}
      </Button>
    </>
  );
};
