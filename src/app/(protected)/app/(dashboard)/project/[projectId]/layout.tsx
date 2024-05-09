import { startCase } from "lodash";
import { db } from "@/lib/db";

export async function generateMetadata({
  params,
}: {
  params: { projectId: string };
}) {
  const project = await db.project.findUnique({
    where: { id: params.projectId },
  });

  if (project) {
    return {
      title: startCase(project.name),
    };
  }
  return {
    title: "Project",
  };
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default OrganizationIdLayout;
