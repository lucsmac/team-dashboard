import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { PreviousWeekSection } from './PreviousWeekSection';
import { CurrentWeekSection } from './CurrentWeekSection';
import { UpcomingWeeksSection } from './UpcomingWeeksSection';
import TimelineTaskForm from './TimelineTaskForm';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useDashboard } from '@/context/DashboardContext';

export const WeeklyTimeline = () => {
  const { dashboardData } = useDashboardData();
  const { addTimelineTask } = useDashboard();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { timeline } = dashboardData;

  console.log('WeeklyTimeline - dashboardData:', dashboardData);
  console.log('WeeklyTimeline - timeline:', timeline);

  const handleSaveTask = async (taskData) => {
    const result = await addTimelineTask(taskData);
    if (result.success) {
      setIsFormOpen(false);
      setEditingTask(null);
    } else {
      throw new Error(result.error || 'Erro ao salvar task');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  if (!timeline) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Dados de timeline não disponíveis
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <span className="text-2xl">📅</span>
            Timeline semanal
          </h2>
          <p className="text-sm text-muted-foreground">
            Acompanhe o progresso do time ao longo das semanas
          </p>
        </div>
        <Button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Nova Task
        </Button>
      </div>

      <div className="relative">
        <div className="hidden lg:block">
          <div className="grid gap-8 relative" style={{ gridTemplateColumns: '1fr 1.5fr 1fr' }}>
            <div className="absolute top-8 left-0 right-0 h-px bg-border" style={{ zIndex: 0 }} />

            {timeline.previousWeek?.startDate && (
              <div className="absolute top-8 left-[14.3%] -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-3 h-3 bg-muted-foreground rounded-full border-2 border-background shadow" />
              </div>
            )}

            {timeline.currentWeek?.startDate && (
              <div className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-4 h-4 bg-foreground rounded-full border-2 border-background shadow-md" />
              </div>
            )}

            {timeline.upcomingWeeks?.[0]?.startDate && (
              <div className="absolute top-8 left-[85.7%] -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-3 h-3 bg-muted rounded-full border-2 border-background shadow" />
              </div>
            )}

            <div className="pt-16">
              <PreviousWeekSection data={timeline.previousWeek || { highlights: [] }} />
            </div>

            <div className="pt-16">
              <CurrentWeekSection data={timeline.currentWeek || { tasks: [] }} />
            </div>

            <div className="pt-16">
              <UpcomingWeeksSection data={timeline.upcomingWeeks?.[0] || { plannedTasks: [] }} />
            </div>
          </div>
        </div>

        <div className="lg:hidden space-y-8 relative pl-8">
          <div className="absolute left-4 top-8 bottom-8 w-px bg-border -z-10" />

          {timeline.previousWeek?.startDate && (
            <div className="absolute left-4 top-14 w-3 h-3 bg-muted-foreground rounded-full -translate-x-1/2 border-2 border-background shadow" />
          )}
          {timeline.currentWeek?.startDate && (
            <div className="absolute left-4 top-[calc(33.33%+4rem)] w-4 h-4 bg-foreground rounded-full -translate-x-1/2 border-2 border-background shadow-md z-10" />
          )}
          {timeline.upcomingWeeks?.[0]?.startDate && (
            <div className="absolute left-4 bottom-14 w-3 h-3 bg-muted rounded-full -translate-x-1/2 border-2 border-background shadow" />
          )}

          <div>
            <PreviousWeekSection data={timeline.previousWeek || { highlights: [] }} />
          </div>

          <div>
            <CurrentWeekSection data={timeline.currentWeek || { tasks: [] }} />
          </div>

          <div>
            <UpcomingWeeksSection data={timeline.upcomingWeeks?.[0] || { plannedTasks: [] }} />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 text-xs pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-muted-foreground rounded-full" />
          <span className="text-muted-foreground">Completada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-foreground rounded-full" />
          <span className="text-foreground font-medium">Em andamento</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-muted rounded-full" />
          <span className="text-muted-foreground">Planejada</span>
        </div>
      </div>

      <TimelineTaskForm
        task={editingTask}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveTask}
      />
    </div>
  );
};
