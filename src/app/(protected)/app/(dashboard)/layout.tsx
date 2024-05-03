import { Navbar } from "./_components/navbar";
import { getAllProjects } from "@/actions/actions";
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
      <Navbar projects={projects} />
      {children}
    </div>
  );
};

export default DashboardLayout;
