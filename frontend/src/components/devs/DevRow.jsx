import { DevBadge } from './DevBadge';
import { useDashboardData } from '../../hooks/useDashboardData';
import { Badge } from '@/components/ui/badge';

/**
 * Linha da tabela de desenvolvedor
 * Mostra as tasks associadas a ele na timeline atual
 */
export const DevRow = ({ dev }) => {
  const { dashboardData } = useDashboardData();

  // Busca tasks da semana atual onde o dev está alocado
  const currentTasks = dashboardData.timeline?.currentWeek?.tasks?.filter(
    task => task.assignedDevs?.includes(dev.name)
  ) || [];

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="p-3">
        <DevBadge dev={dev} />
      </td>
      <td className="p-3 bg-blue-50">
        <div className="flex flex-wrap gap-2">
          {currentTasks.length > 0 ? (
            currentTasks.map(task => (
              <Badge
                key={task.id}
                variant="secondary"
                className="text-xs"
              >
                {task.title}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-gray-400 italic">Sem tasks alocadas</span>
          )}
        </div>
      </td>
    </tr>
  );
};
