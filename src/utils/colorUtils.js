import { PRIORITY, STATUS, VALUE_TYPE, SEVERITY, INFO_TYPE } from './constants';

export const getPriorityColor = (priority) => {
  const colors = {
    [PRIORITY.ALTA]: 'bg-red-500',
    [PRIORITY.MEDIA]: 'bg-yellow-500',
    [PRIORITY.BAIXA]: 'bg-green-500'
  };
  return colors[priority] || colors[PRIORITY.MEDIA];
};

export const getStatusColor = (status) => {
  const colors = {
    [STATUS.CONCLUIDO]: 'border-l-2 border-l-green-500',
    [STATUS.EM_ANDAMENTO]: 'border-l-2 border-l-blue-500',
    [STATUS.PLANEJADO]: 'border-l-2 border-l-muted-foreground',
    [STATUS.BLOQUEADO]: 'border-l-2 border-l-red-500'
  };
  return colors[status] || colors[STATUS.PLANEJADO];
};

export const getValueBadgeColor = (valueType) => {
  const colors = {
    [VALUE_TYPE.TRADE_OFFS]: 'bg-purple-100 text-purple-800 border-purple-300',
    [VALUE_TYPE.ESSENCIAL]: 'bg-blue-100 text-blue-800 border-blue-300',
    [VALUE_TYPE.IMPORTANTE]: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };
  return colors[valueType] || colors[VALUE_TYPE.ESSENCIAL];
};

export const getSeverityColor = (severity) => {
  const colors = {
    [SEVERITY.ALTA]: 'bg-red-50 border-red-500',
    [SEVERITY.MEDIA]: 'bg-yellow-50 border-yellow-500',
    [SEVERITY.BAIXA]: 'bg-blue-50 border-blue-500'
  };
  return colors[severity] || colors[SEVERITY.MEDIA];
};

export const getInfoTypeColor = (type) => {
  const colors = {
    [INFO_TYPE.SUCCESS]: 'bg-green-50 border-green-500',
    [INFO_TYPE.WARNING]: 'bg-yellow-50 border-yellow-500',
    [INFO_TYPE.INFO]: 'bg-blue-50 border-blue-500'
  };
  return colors[type] || colors[INFO_TYPE.INFO];
};
