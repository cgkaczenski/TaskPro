import { Separator } from "@/components/ui/separator";
import { Info } from "./_components/info";
import { BoardList } from "./_components/board-list";
import { Suspense } from "react";
import { redirect } from "next/navigation";

type Props = {
  params: {
    projectId: string;
  };
};

const ProjectIdPage = async ({ params }: Props) => {
  const { projectId } = params;

  if (!projectId || Array.isArray(projectId)) {
    return redirect("/app/project");
  }

  return (
    <div className="w-full mb-20">
      <Info />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList projectId={projectId} />
        </Suspense>
      </div>
    </div>
  );
};

export default ProjectIdPage;
