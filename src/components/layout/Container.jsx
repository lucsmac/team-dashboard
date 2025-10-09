/**
 * Container principal do dashboard
 */
export const Container = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {children}
      </div>
    </div>
  );
};
