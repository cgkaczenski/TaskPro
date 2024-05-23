import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { Info } from "../_components/info";
import { ActivityList } from "./_components/activity-list";

interface ActivityPageProps {
  params: {
    projectId: string;
  };
}

const ActivityPage = async ({ params }: ActivityPageProps) => {
  return (
    <div className="w-full">
      <Info />
      <Separator className="my-2" />
      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList projectId={params.projectId} />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
