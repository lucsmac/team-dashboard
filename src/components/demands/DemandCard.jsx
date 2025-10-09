import { Link as LinkIcon } from 'lucide-react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { PriorityIndicator } from '../common/StatusIndicator';
import { getStatusColor, getValueBadgeColor } from '../../utils/colorUtils';
import { DevBadge } from '../devs/DevBadge';

/**
 * Card individual de demanda
 */
export const DemandCard = ({ demand, category }) => {
  const { dashboardData } = useDashboardData();

  return (
    <div className={`border-2 rounded-lg p-4 ${getStatusColor(demand.status)}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <PriorityIndicator priority={demand.priority} size="sm" />
          <h4 className="font-semibold text-gray-900">{demand.title}</h4>
        </div>
        <span className={`text-xs px-2 py-1 rounded border ${getValueBadgeColor(demand.value)}`}>
          {demand.value}
        </span>
      </div>

      {demand.assignedDevs.length > 0 && (
        <div className="flex gap-1 mb-2 flex-wrap">
          {demand.assignedDevs.map((devName, idx) => {
            const dev = dashboardData.devs.find(d => d.name === devName);
            if (!dev) return null;
            return (
              <span key={idx} className={`text-xs px-2 py-1 rounded ${dev.color}`}>
                {devName}
              </span>
            );
          })}
        </div>
      )}

      <p className="text-sm text-gray-700 mb-2">{demand.details}</p>

      {demand.links.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {demand.links.map((link, idx) => (
            <a
              key={idx}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <LinkIcon className="w-3 h-3" />
              Link {idx + 1}
            </a>
          ))}
        </div>
      )}

      <div className="mt-2 text-xs font-medium text-gray-600 capitalize">
        Status: {demand.status.replace('-', ' ')}
      </div>
    </div>
  );
};
