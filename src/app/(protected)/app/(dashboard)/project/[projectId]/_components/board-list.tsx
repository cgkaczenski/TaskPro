import Link from "next/link";
import { User2 } from "lucide-react";
import { db } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { FormPopover } from "@/components/form/form-popover";
import { cn } from "@/lib/utils";

const colors = [
  "bg-pink-600",
  "bg-purple-600",
  "bg-yellow-500",
  "bg-green-500",
];

const getFirstLetterOfEachWord = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

export const BoardList = async ({ projectId }: { projectId: string }) => {
  const boards = await db.board.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your project boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 ">
        {boards.map((board, index) => (
          <Link
            key={board.id}
            href={`/app/board/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover col-span-1 flex rounded-md shadow-sm overflow-hidden"
          >
            <div
              className={cn(
                colors[index % colors.length],
                "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white "
              )}
            >
              {getFirstLetterOfEachWord(board.title)}
            </div>
            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white ">
              <div className="absolute inset-0  group-hover:bg-black/40 transition" />
              <p className="flex-1 truncate px-4 py-2 text-sm">{board.title}</p>
            </div>
          </Link>
        ))}
        <FormPopover sideOffset={10} side="bottom">
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};
