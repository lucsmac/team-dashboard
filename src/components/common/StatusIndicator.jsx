import { getStatusColor, getPriorityColor } from '../../utils/colorUtils';

/**
 * Indicador visual de status com cor
 */
export const StatusIndicator = ({ status, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const colorClass = getStatusColor(status).split(' ')[0]; // pega só a cor de fundo

  return (
    <span
      className={`${sizeClasses[size]} ${colorClass} rounded-full inline-block`}
      title={status}
    />
  );
};

/**
 * Indicador de prioridade com cor
 */
export const PriorityIndicator = ({ priority, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const colorClass = getPriorityColor(priority);

  return (
    <span
      className={`${sizeClasses[size]} ${colorClass} rounded-full inline-block`}
      title={priority}
    />
  );
};
