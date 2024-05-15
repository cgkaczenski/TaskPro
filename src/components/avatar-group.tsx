import { FaUser } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { User } from "@prisma/client";

interface AvatarGroupProps {
  sizes?: 6 | 8 | 10;
  data: User[];
}

export const AvatarGroup = ({ sizes = 6, data }: AvatarGroupProps) => {
  const sizeClasses = {
    6: "h-6 w-6",
    8: "h-8 w-8",
    10: "h-10 w-10",
  };

  return (
    <div className="isolate flex -space-x-2 overflow-hidden">
      {data &&
        data.map((person) => (
          <TooltipProvider key={person.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar
                  className={cn(
                    "relative inline-block rounded-full ring-2 ring-white hover:cursor-help",
                    sizeClasses[sizes]
                  )}
                >
                  <AvatarImage src={person?.image || ""} />
                  <AvatarFallback className="bg-sky-500">
                    <FaUser className="text-white" />
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{person.name}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
    </div>
  );
};
