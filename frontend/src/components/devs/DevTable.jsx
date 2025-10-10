import { Users } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { DevRow } from './DevRow';

/**
 * Tabela de alocação de desenvolvedores
 */
export const DevTable = ({ devsToShow, showHeader = true }) => {
  const { dashboardData } = useDashboardData();
  const devs = devsToShow || dashboardData.devs;

  const content = (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left p-3 font-semibold text-gray-700">Dev</th>
            <th className="text-left p-3 font-semibold text-gray-700">Semana Anterior</th>
            <th className="text-left p-3 font-semibold text-gray-700 bg-blue-50">Esta Semana</th>
            <th className="text-left p-3 font-semibold text-gray-700">Próxima Semana</th>
          </tr>
        </thead>
        <tbody>
          {devs.map((dev) => (
            <DevRow key={dev.id} dev={dev} />
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!showHeader) {
    return content;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Desenvolvedores - Alocação Semanal
      </h2>
      {content}
    </div>
  );
};
