import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * Filtros para a aba de Time
 */
export const TeamFilters = ({ searchTerm, setSearchTerm, projectFilter, setProjectFilter, projects }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar desenvolvedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={projectFilter} onValueChange={setProjectFilter}>
        <SelectTrigger className="w-full sm:w-[250px]">
          <SelectValue placeholder="Todos os projetos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os projetos</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project} value={project}>
              {project}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
