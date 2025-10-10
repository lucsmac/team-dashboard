import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FolderKanban, Star, ChevronLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navigationItems = [
  {
    group: 'Geral',
    items: [
      {
        title: 'Resumo',
        icon: LayoutDashboard,
        url: '/overview',
      },
      {
        title: 'Time',
        icon: Users,
        url: '/team',
      },
    ],
  },
  {
    group: 'Dados',
    items: [
      {
        title: 'Demandas',
        icon: FolderKanban,
        url: '/demands',
      },
      {
        title: 'Highlights',
        icon: Star,
        url: '/highlights',
      },
    ],
  },
];

/**
 * Sidebar de navegação com grupos hierárquicos
 */
export function AppSidebar({ collapsed, onCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (url) => location.pathname === url;

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <h2 className={cn("text-lg font-semibold transition-all", collapsed && "opacity-0")}>
          Time Core
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapse && onCollapse()}
          className="h-8 w-8 hidden lg:flex"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-4">
        {navigationItems.map((section) => (
          <div key={section.group} className="px-3 py-2">
            {!collapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.group}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.url);
                return (
                  <Button
                    key={item.title}
                    variant={active ? 'secondary' : 'ghost'}
                    className={cn(
                      "w-full justify-start",
                      collapsed && "justify-center px-2"
                    )}
                    onClick={() => navigate(item.url)}
                  >
                    <Icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                    {!collapsed && <span>{item.title}</span>}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <p className={cn("text-xs text-muted-foreground text-center transition-all", collapsed && "opacity-0")}>
          Dashboard v1.0
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-background transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
