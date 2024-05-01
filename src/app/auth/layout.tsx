const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex items-center justify-center bg-slate-100">
      {children}
    </div>
  );
};

export default AuthLayout;
