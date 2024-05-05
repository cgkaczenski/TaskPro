import { Navbar } from "./_components/navbar";
import { getAllProjects } from "@/actions/actions";
import ProjectContextProvider from "@/contexts/project-context-provider";
import { Project } from "@prisma/client";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const result = await getAllProjects();
  if (!result) {
    //TODO: redirect to create first project page
    return null;
  }
  const projects = result as Project[];
  return (
    <div className="h-full">
      <ProjectContextProvider data={projects}>
        <Navbar />
        {children}
      </ProjectContextProvider>
    </div>
  );
};

export default DashboardLayout;
