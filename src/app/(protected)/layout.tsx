import { Toaster } from "sonner";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      <div>{children}</div>
    </>
  );
};

export default ProtectedLayout;
