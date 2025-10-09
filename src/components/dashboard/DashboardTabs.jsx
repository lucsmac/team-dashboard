import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Users, FolderKanban, Star } from 'lucide-react';
import { OverviewTab } from './OverviewTab';
import { TeamTab } from './TeamTab';
import { DemandsTab } from './DemandsTab';
import { HighlightsTab } from './HighlightsTab';

/**
 * Container principal com sistema de abas e routing
 */
export const DashboardTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extrai a aba atual da URL
  const currentTab = location.pathname.split('/')[1] || 'overview';

  const handleTabChange = (value) => {
    navigate(`/${value}`);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
      <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
        <TabsTrigger value="overview" className="gap-2">
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden sm:inline">Resumo</span>
        </TabsTrigger>
        <TabsTrigger value="team" className="gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Time</span>
        </TabsTrigger>
        <TabsTrigger value="demands" className="gap-2">
          <FolderKanban className="h-4 w-4" />
          <span className="hidden sm:inline">Demandas</span>
        </TabsTrigger>
        <TabsTrigger value="highlights" className="gap-2">
          <Star className="h-4 w-4" />
          <span className="hidden sm:inline">Highlights</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <OverviewTab />
      </TabsContent>

      <TabsContent value="team" className="space-y-6">
        <TeamTab />
      </TabsContent>

      <TabsContent value="demands" className="space-y-6">
        <DemandsTab />
      </TabsContent>

      <TabsContent value="highlights" className="space-y-6">
        <HighlightsTab />
      </TabsContent>
    </Tabs>
  );
};
