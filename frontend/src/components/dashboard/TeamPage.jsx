import { useState, useMemo } from 'react';
import { LayoutGrid, Table as TableIcon, Plus } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { TeamFilters } from '../team/TeamFilters';
import { TeamMemberCard } from '../team/TeamMemberCard';
import { DevTable } from '../devs/DevTable';
import { Button } from '@/components/ui/button';
import DevForm from '../devs/DevForm';

/**
 * Página de visualização do time
 */
export const TeamPage = () => {
  const { dashboardData, addDev, updateDev, removeDev } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' ou 'table'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDev, setEditingDev] = useState(null);

  // Extrai lista única de tasks/projetos atuais da timeline
  const projects = useMemo(() => {
    const taskTitles = dashboardData.timeline?.currentWeek?.tasks?.map(task => task.title) || [];
    const unique = [...new Set(taskTitles)];
    return unique.filter(p => p && p.trim() !== '').sort();
  }, [dashboardData.timeline]);

  // Filtra devs baseado nos filtros ativos
  const filteredDevs = useMemo(() => {
    return dashboardData.devs.filter(dev => {
      const matchesSearch = dev.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Se houver filtro de projeto, verifica se o dev está alocado em alguma task com esse título
      if (projectFilter !== 'all') {
        const devTasks = dashboardData.timeline?.currentWeek?.tasks?.filter(
          task => task.assignedDevs?.includes(dev.name) && task.title === projectFilter
        ) || [];
        const matchesProject = devTasks.length > 0;
        return matchesSearch && matchesProject;
      }

      return matchesSearch;
    });
  }, [dashboardData.devs, dashboardData.timeline, searchTerm, projectFilter]);

  const handleOpenForm = (dev = null) => {
    setEditingDev(dev);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDev(null);
  };

  const handleSave = async (formData) => {
    if (editingDev) {
      await updateDev(editingDev.id, formData);
    } else {
      await addDev(formData);
    }
  };

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
            variant="default"
            size="sm"
            onClick={() => handleOpenForm()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Dev
          </Button>
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
            <TeamMemberCard
              key={dev.id}
              dev={dev}
              onEdit={handleOpenForm}
              onDelete={removeDev}
            />
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

      <DevForm
        dev={editingDev}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
      />
    </div>
  );
};
