const BoardIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
