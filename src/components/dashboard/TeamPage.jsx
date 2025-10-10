import { useState, useMemo } from 'react';
import { LayoutGrid, Table as TableIcon } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { TeamFilters } from '../team/TeamFilters';
import { TeamMemberCard } from '../team/TeamMemberCard';
import { DevTable } from '../devs/DevTable';
import { Button } from '@/components/ui/button';

/**
 * Página de visualização do time
 */
export const TeamPage = () => {
  const { dashboardData } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'

  // Extrai lista única de projetos atuais
  const projects = useMemo(() => {
    const unique = [...new Set(dashboardData.devs.map(dev => dev.thisWeek))];
    return unique.sort();
  }, [dashboardData.devs]);

  // Filtra devs baseado nos filtros ativos
  const filteredDevs = useMemo(() => {
    return dashboardData.devs.filter(dev => {
      const matchesSearch = dev.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProject = projectFilter === 'all' || dev.thisWeek === projectFilter;
      return matchesSearch && matchesProject;
    });
  }, [dashboardData.devs, searchTerm, projectFilter]);

  return (
    <div className="space-y-6">
      {/* Filtros e toggle de visualização */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <TeamFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          projectFilter={projectFilter}
          setProjectFilter={setProjectFilter}
          projects={projects}
        />

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Cards
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Tabela
          </Button>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-sm text-muted-foreground">
        {filteredDevs.length} {filteredDevs.length === 1 ? 'desenvolvedor' : 'desenvolvedores'}
        {searchTerm || projectFilter !== 'all' ? ' encontrado(s)' : ''}
      </div>

      {/* Visualização em Cards */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevs.map((dev) => (
            <TeamMemberCard key={dev.id} dev={dev} />
          ))}
        </div>
      )}

      {/* Visualização em Tabela */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border">
          <DevTable devsToShow={filteredDevs} />
        </div>
      )}

      {/* Empty state */}
      {filteredDevs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg font-medium">Nenhum desenvolvedor encontrado</p>
          <p className="text-sm mt-2">Tente ajustar os filtros de busca</p>
        </div>
      )}
    </div>
  );
};
