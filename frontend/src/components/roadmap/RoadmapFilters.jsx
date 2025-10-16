import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, X, Filter } from 'lucide-react';

/**
 * Componente de filtros para o roadmap
 */
export const RoadmapFilters = ({
  selectedCategories,
  onCategoryToggle,
  selectedStatus,
  onStatusToggle,
  selectedPriorities,
  onPriorityToggle,
  searchTerm,
  onSearchChange,
  categories,
  showCompleted,
  onToggleCompleted
}) => {
  const statusOptions = [
    { value: 'em-andamento', label: 'Em Andamento', color: 'bg-blue-100 text-blue-700' },
    { value: 'planejado', label: 'Planejado', color: 'bg-gray-100 text-gray-700' },
    { value: 'concluido', label: 'Concluído', color: 'bg-green-100 text-green-700' }
  ];

  const priorityOptions = [
    { value: 'alta', label: 'Alta', color: 'bg-red-100 text-red-700' },
    { value: 'media', label: 'Média', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'baixa', label: 'Baixa', color: 'bg-green-100 text-green-700' }
  ];

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedStatus.length > 0 ||
    selectedPriorities.length > 0 ||
    searchTerm.length > 0;

  const clearAllFilters = () => {
    selectedCategories.forEach(cat => onCategoryToggle(cat));
    selectedStatus.forEach(status => onStatusToggle(status));
    selectedPriorities.forEach(priority => onPriorityToggle(priority));
    onSearchChange('');
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Busca */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar demandas..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchChange('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Categorias */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Categorias
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => onCategoryToggle(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Status
              </div>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="outline"
                    className={`cursor-pointer transition-colors ${
                      selectedStatus.includes(option.value)
                        ? option.color
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => onStatusToggle(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Prioridades */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Prioridade
              </div>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="outline"
                    className={`cursor-pointer transition-colors ${
                      selectedPriorities.includes(option.value)
                        ? option.color
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => onPriorityToggle(option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle concluídos */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              variant={showCompleted ? 'default' : 'outline'}
              size="sm"
              onClick={onToggleCompleted}
              className="text-xs"
            >
              {showCompleted ? 'Ocultar' : 'Mostrar'} concluídos
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
