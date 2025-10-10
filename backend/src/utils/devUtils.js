/**
 * Utilitários para enriquecer dados de desenvolvedores
 */

/**
 * Gera resumo textual das atividades do dev com base nas TimelineTasks
 */
export function generateWeekSummary(tasks) {
  if (!tasks || tasks.length === 0) {
    return 'Sem atividades';
  }

  // Agrupar por status/progress para dar contexto
  const inProgress = tasks.filter(t => t.progress > 0 && t.progress < 100);
  const completed = tasks.filter(t => t.progress === 100);
  const notStarted = tasks.filter(t => t.progress === 0);

  const parts = [];

  // Tarefas em andamento (prioridade)
  if (inProgress.length > 0) {
    const taskSummaries = inProgress.map(t => {
      const progressInfo = t.progress > 0 ? ` (${t.progress}%)` : '';
      return `${t.title}${progressInfo}`;
    });
    parts.push(taskSummaries.join(', '));
  }

  // Tarefas concluídas
  if (completed.length > 0) {
    parts.push(completed.map(t => `${t.title} - Concluído`).join(', '));
  }

  // Tarefas não iniciadas
  if (notStarted.length > 0 && inProgress.length === 0 && completed.length === 0) {
    parts.push(notStarted.map(t => t.title).join(', '));
  }

  return parts.join(' | ') || 'Aguardando alocação';
}

/**
 * Enriquece um dev com resumos de semana calculados a partir de TimelineTasks
 */
export function enrichDevWithWeekSummaries(dev, allTimelineTasks) {
  // Filtrar tasks onde este dev está alocado
  const devTasks = allTimelineTasks.filter(task =>
    task.assignedDevs && task.assignedDevs.includes(dev.name)
  );

  // Separar por tipo de semana
  const lastWeekTasks = devTasks.filter(t => t.weekType === 'previous');
  const thisWeekTasks = devTasks.filter(t => t.weekType === 'current');
  const nextWeekTasks = devTasks.filter(t => t.weekType === 'upcoming');

  return {
    ...dev,
    lastWeek: dev.lastWeek || generateWeekSummary(lastWeekTasks),
    thisWeek: dev.thisWeek || generateWeekSummary(thisWeekTasks),
    nextWeek: dev.nextWeek || generateWeekSummary(nextWeekTasks),
    // Manter originais para edição manual se necessário
    _computed: {
      lastWeekTasks,
      thisWeekTasks,
      nextWeekTasks
    }
  };
}

/**
 * Enriquece uma lista de devs com resumos de semana
 */
export function enrichDevsWithWeekSummaries(devs, allTimelineTasks) {
  return devs.map(dev => enrichDevWithWeekSummaries(dev, allTimelineTasks));
}
