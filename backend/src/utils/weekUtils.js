// Função auxiliar para obter o domingo da semana atual
export function getCurrentWeekStart() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}

// Função auxiliar para obter o sábado da semana atual
export function getCurrentWeekEnd() {
  const sunday = getCurrentWeekStart();
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  saturday.setHours(23, 59, 59, 999);
  return saturday;
}

// Função para determinar o tipo de semana baseado nas datas
export function getWeekType(weekStart, weekEnd) {
  const currentWeekStart = getCurrentWeekStart();
  const currentWeekEnd = getCurrentWeekEnd();

  const taskStart = new Date(weekStart);
  const taskEnd = new Date(weekEnd);

  // Calcular início e fim da semana anterior
  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(currentWeekStart.getDate() - 7);
  const previousWeekEnd = new Date(previousWeekStart);
  previousWeekEnd.setDate(previousWeekStart.getDate() + 6);
  previousWeekEnd.setHours(23, 59, 59, 999);

  // Calcular início e fim da próxima semana
  const nextWeekStart = new Date(currentWeekStart);
  nextWeekStart.setDate(currentWeekStart.getDate() + 7);
  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
  nextWeekEnd.setHours(23, 59, 59, 999);

  // Verificar se a task está na semana atual
  if (taskStart >= currentWeekStart && taskStart <= currentWeekEnd) {
    return 'current';
  }

  // Verificar se a task está especificamente na semana anterior
  if (taskStart >= previousWeekStart && taskStart <= previousWeekEnd) {
    return 'previous';
  }

  // Verificar se a task está especificamente na próxima semana
  if (taskStart >= nextWeekStart && taskStart <= nextWeekEnd) {
    return 'upcoming';
  }

  // Caso contrário, não pertence a nenhuma das três semanas exibidas
  return null;
}
