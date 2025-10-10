import { useState } from 'react';
import { AppSidebar } from './Sidebar';
import { Topbar } from './Topbar';

/**
 * AppShell - Container principal com Sidebar + Topbar + Content
 */
export const AppShell = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />

      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 bg-muted/30">
          <div className="max-w-[1800px] mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
