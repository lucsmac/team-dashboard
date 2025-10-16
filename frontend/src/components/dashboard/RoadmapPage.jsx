import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRoadmapData } from '@/hooks/useRoadmapData';
import { RoadmapTimeline } from '../roadmap/RoadmapTimeline';
import { RoadmapGanttView } from '../roadmap/RoadmapGanttView';
import { RoadmapFilters } from '../roadmap/RoadmapFilters';
import { Calendar, Columns3, LayoutList } from 'lucide-react';

/**
 * Página principal do Roadmap
 * Visualização temporal das demandas e timeline tasks
 */
export const RoadmapPage = () => {
  const { weeks, categories } = useRoadmapData();

  // Estados dos filtros
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [viewMode, setViewMode] = useState('gantt'); // 'gantt' ou 'timeline'

  // Toggle de filtros
  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleStatus = (status) => {
    setSelectedStatus(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const togglePriority = (priority) => {
    setSelectedPriorities(prev =>
      prev.includes(priority)
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    );
  };

  // Filtrar semanas baseado nos filtros ativos
  const filteredWeeks = useMemo(() => {
    return weeks.map(week => {
      // Filtrar demandas dentro de cada semana
      let filteredDemands = week.demands;

      // Filtro de categoria
      if (selectedCategories.length > 0) {
        filteredDemands = filteredDemands.filter(demand =>
          selectedCategories.includes(demand.category)
        );
      }

      // Filtro de status
      if (selectedStatus.length > 0) {
        filteredDemands = filteredDemands.filter(demand =>
          selectedStatus.includes(demand.computedStatus || demand.status)
        );
      }

      // Filtro de prioridade
      if (selectedPriorities.length > 0) {
        filteredDemands = filteredDemands.filter(demand =>
          selectedPriorities.includes(demand.priority)
        );
      }

      // Filtro de busca
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        filteredDemands = filteredDemands.filter(demand =>
          demand.title.toLowerCase().includes(term) ||
          demand.details?.toLowerCase().includes(term) ||
          demand.assignedDevs?.some(dev => dev.toLowerCase().includes(term))
        );
      }

      // Filtro de concluídos
      if (!showCompleted) {
        filteredDemands = filteredDemands.filter(demand =>
          (demand.computedStatus || demand.status) !== 'concluido'
        );
      }

      return {
        ...week,
        demands: filteredDemands
      };
    }).filter(week => week.demands.length > 0); // Remover semanas sem demandas
  }, [weeks, selectedCategories, selectedStatus, selectedPriorities, searchTerm, showCompleted]);

  // Calcular estatísticas
  const totalDemands = weeks.reduce((acc, week) => acc + week.demands.length, 0);
  const filteredDemandsCount = filteredWeeks.reduce((acc, week) => acc + week.demands.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Roadmap de Demandas
              </CardTitle>
              <CardDescription>
                Visualização temporal das demandas e suas entregas ao longo das semanas
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              {/* Toggle de visualização */}
              <div className="flex items-center gap-2 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'gantt' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('gantt')}
                  className="h-8 gap-2"
                >
                  <LayoutList className="h-4 w-4" />
                  <span className="hidden sm:inline">Gantt</span>
                </Button>
                <Button
                  variant={viewMode === 'timeline' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('timeline')}
                  className="h-8 gap-2"
                >
                  <Columns3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Cards</span>
                </Button>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold">{weeks.length}</div>
                <div className="text-xs text-muted-foreground">
                  {weeks.length === 1 ? 'semana' : 'semanas'}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <RoadmapFilters
        selectedCategories={selectedCategories}
        onCategoryToggle={toggleCategory}
        selectedStatus={selectedStatus}
        onStatusToggle={toggleStatus}
        selectedPriorities={selectedPriorities}
        onPriorityToggle={togglePriority}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        showCompleted={showCompleted}
        onToggleCompleted={() => setShowCompleted(!showCompleted)}
      />

      {/* Informações de filtros ativos */}
      {(selectedCategories.length > 0 ||
        selectedStatus.length > 0 ||
        selectedPriorities.length > 0 ||
        searchTerm ||
        !showCompleted) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Mostrando <span className="font-bold text-foreground">{filteredDemandsCount}</span> de{' '}
                <span className="font-bold text-foreground">{totalDemands}</span> demandas
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visualização */}
      {viewMode === 'timeline' ? (
        <Card>
          <CardContent className="pt-6">
            <RoadmapTimeline weeks={weeks} filteredWeeks={filteredWeeks} />
          </CardContent>
        </Card>
      ) : (
        <RoadmapGanttView weeks={weeks} filteredWeeks={filteredWeeks} />
      )}
    </div>
  );
};
