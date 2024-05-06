import { Sidebar } from "../_components/sidebar";

const OrganizationLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="pt-20 md:pt-24 px-4 overflow-hidden">
      <div className="flex gap-x-7">
        <div className="w-64 shrink-0 hidden lg:block ">
          <Sidebar />
        </div>
        {children}
      </div>
    </main>
  );
};

export default OrganizationLayout;
