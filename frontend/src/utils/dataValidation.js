export const validateDev = (dev) => {
  return (
    dev &&
    typeof dev.id !== 'undefined' &&
    typeof dev.name === 'string' &&
    typeof dev.color === 'string' &&
    typeof dev.lastWeek === 'string' &&
    typeof dev.thisWeek === 'string' &&
    typeof dev.nextWeek === 'string'
  );
};

export const validateDemand = (demand) => {
  return (
    demand &&
    typeof demand.id !== 'undefined' &&
    typeof demand.title === 'string' &&
    typeof demand.status === 'string' &&
    typeof demand.priority === 'string' &&
    Array.isArray(demand.assignedDevs) &&
    typeof demand.value === 'string' &&
    typeof demand.details === 'string' &&
    Array.isArray(demand.links)
  );
};

export const validateDelivery = (delivery) => {
  return (
    delivery &&
    typeof delivery.id !== 'undefined' &&
    typeof delivery.title === 'string' &&
    typeof delivery.valueType === 'string' &&
    Array.isArray(delivery.items)
  );
};

export const validateHighlight = (highlight) => {
  return (
    highlight &&
    typeof highlight.id !== 'undefined' &&
    typeof highlight.text === 'string'
  );
};

export const validateDashboardData = (data) => {
  try {
    if (!data || typeof data !== 'object') return false;

    if (typeof data.week !== 'string') return false;

    if (!Array.isArray(data.devs) || !data.devs.every(validateDev)) return false;

    if (!data.demands || typeof data.demands !== 'object') return false;
    for (const category in data.demands) {
      if (!Array.isArray(data.demands[category]) || !data.demands[category].every(validateDemand)) {
        return false;
      }
    }

    if (!Array.isArray(data.deliveries) || !data.deliveries.every(validateDelivery)) return false;

    if (!data.highlights || typeof data.highlights !== 'object') return false;
    if (!Array.isArray(data.highlights.blockers) || !data.highlights.blockers.every(validateHighlight)) return false;
    if (!Array.isArray(data.highlights.important) || !data.highlights.important.every(validateHighlight)) return false;
    if (!Array.isArray(data.highlights.achievements) || !data.highlights.achievements.every(validateHighlight)) return false;

    if (!Array.isArray(data.priorities)) return false;

    return true;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
};
