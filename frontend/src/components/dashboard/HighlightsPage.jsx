import { AlertCircle, Award, Info, Plus, Edit2, Trash2, Calendar, User, Link2, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDashboardData } from '@/hooks/useDashboardData';
import { getSeverityColor, getInfoTypeColor } from '@/utils/colorUtils';
import HighlightForm from '../highlights/HighlightForm';
import { useState, useMemo } from 'react';

/**
 * Página de highlights (entraves, conquistas, informações importantes)
 */
export const HighlightsPage = () => {
  const { dashboardData, addHighlight, updateHighlight, removeHighlight } = useDashboardData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState(null);
  const [highlightType, setHighlightType] = useState('blockers');
  const [selectedWeek, setSelectedWeek] = useState('all');

  // Extrair semanas disponíveis da timeline
  const availableWeeks = useMemo(() => {
    const weeks = [];

    if (dashboardData?.timeline?.previousWeek) {
      weeks.push({
        value: 'previous',
        label: 'Semana Anterior',
        startDate: dashboardData.timeline.previousWeek.startDate,
        endDate: dashboardData.timeline.previousWeek.endDate
      });
    }

    if (dashboardData?.timeline?.currentWeek) {
      weeks.push({
        value: 'current',
        label: 'Semana Atual',
        startDate: dashboardData.timeline.currentWeek.startDate,
        endDate: dashboardData.timeline.currentWeek.endDate
      });
    }

    if (dashboardData?.timeline?.upcomingWeeks) {
      dashboardData.timeline.upcomingWeeks.forEach((week, index) => {
        weeks.push({
          value: `upcoming-${index}`,
          label: `Próxima Semana ${index + 1}`,
          startDate: week.startDate,
          endDate: week.endDate
        });
      });
    }

    // Adicionar opção "Todas"
    weeks.unshift({ value: 'all', label: 'Todas as Semanas', startDate: null, endDate: null });

    return weeks;
  }, [dashboardData]);

  // Filtrar highlights por semana
  const filterByWeek = (items) => {
    if (selectedWeek === 'all') return items;

    const week = availableWeeks.find(w => w.value === selectedWeek);
    if (!week || !week.startDate) return items;

    const weekStart = new Date(week.startDate);
    const weekEnd = new Date(week.endDate);

    return items.filter(item => {
      // Items sem data de semana sempre aparecem (para não esconder conquistas antigas)
      if (!item.weekStart || !item.weekEnd) return true;

      const itemStart = new Date(item.weekStart);
      const itemEnd = new Date(item.weekEnd);

      // Verifica se há sobreposição de datas
      return itemStart <= weekEnd && itemEnd >= weekStart;
    });
  };

  const blockers = useMemo(() =>
    filterByWeek(dashboardData?.highlights?.blockers || []),
    [dashboardData, selectedWeek]
  );

  const achievements = useMemo(() =>
    filterByWeek(dashboardData?.highlights?.achievements || []),
    [dashboardData, selectedWeek]
  );

  const important = useMemo(() =>
    filterByWeek(dashboardData?.highlights?.important || []),
    [dashboardData, selectedWeek]
  );

  const handleOpenForm = (type, highlight = null) => {
    setHighlightType(type);
    setEditingHighlight(highlight);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingHighlight(null);
  };

  const handleSave = async (formData) => {
    if (editingHighlight) {
      await updateHighlight(highlightType, editingHighlight.id, formData);
    } else {
      await addHighlight(highlightType, formData);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      await removeHighlight(type, id);
    }
  };

  const toggleBlockerResolved = async (blockerId, currentStatus) => {
    try {
      await updateHighlight('blockers', blockerId, { resolved: !currentStatus });
    } catch (error) {
      console.error('Error toggling blocker resolved:', error);
      alert('Erro ao atualizar entrave');
    }
  };

  // Helper para buscar nome do dev por ID
  const getDevName = (devId) => {
    const dev = dashboardData?.devs?.find(d => d.id === devId);
    return dev ? dev.name : null;
  };

  // Helper para buscar task da timeline por ID
  const getTimelineTask = (taskId) => {
    if (!dashboardData?.timeline) return null;

    const allTasks = [
      ...(dashboardData.timeline.currentWeek?.tasks || []),
      ...(dashboardData.timeline.previousWeek?.tasks || []),
      ...(dashboardData.timeline.upcomingWeeks?.flatMap(w => w.plannedTasks || []) || [])
    ];

    return allTasks.find(t => t.id === taskId);
  };

  // Helper para buscar demand por ID
  const getDemand = (demandId) => {
    if (!dashboardData?.demands) return null;

    for (const category in dashboardData.demands) {
      const demand = dashboardData.demands[category].find(d => d.id === demandId);
      if (demand) return { ...demand, category };
    }
    return null;
  };

  return (
    <>
      {/* Filtro de Semana */}
      <div className="mb-6 flex items-center gap-4 bg-card p-4 rounded-lg border">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div className="flex-1">
          <Label className="text-sm font-medium mb-2 block">Filtrar por Semana</Label>
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Selecione uma semana" />
            </SelectTrigger>
            <SelectContent>
              {availableWeeks.map(week => (
                <SelectItem key={week.value} value={week.value}>
                  {week.label}
                  {week.startDate && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({new Date(week.startDate).toLocaleDateString('pt-BR')} - {new Date(week.endDate).toLocaleDateString('pt-BR')})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entraves */}
        <Card className="border-t-2 border-red-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Entraves
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">{blockers.length}</Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenForm('blockers')}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {blockers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum entrave no momento 🎉
              </p>
            ) : (
              blockers.map((blocker) => {
                const task = blocker.timelineTaskId ? getTimelineTask(blocker.timelineTaskId) : null;
                const demand = blocker.demandId ? getDemand(blocker.demandId) : null;
                const devNames = blocker.devIds?.map(getDevName).filter(Boolean) || [];

                return (
                  <Alert
                    key={blocker.id}
                    variant={blocker.severity === 'alta' ? 'destructive' : 'default'}
                    className={`py-3 ${blocker.resolved ? 'opacity-60 bg-gray-50' : ''}`}
                  >
                    <AlertDescription className="text-sm">
                      <div className="flex items-start justify-between mb-2">
                        <div className={`flex-1 ${blocker.resolved ? 'line-through text-gray-500' : ''}`}>
                          {blocker.text}
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs"
                          >
                            {blocker.severity}
                          </Badge>
                          {blocker.resolved && (
                            <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-300">
                              ✓ Resolvido
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleBlockerResolved(blocker.id, blocker.resolved)}
                            className="h-6 w-6 p-0"
                            title={blocker.resolved ? 'Marcar como não resolvido' : 'Marcar como resolvido'}
                          >
                            {blocker.resolved ? (
                              <X className="h-3 w-3 text-gray-600" />
                            ) : (
                              <Check className="h-3 w-3 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenForm('blockers', blocker)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete('blockers', blocker.id)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Associações */}
                      {(task || demand || devNames.length > 0) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task && (
                            <Badge variant="secondary" className="text-xs">
                              <Link2 className="h-3 w-3 mr-1" />
                              {task.title}
                            </Badge>
                          )}
                          {demand && (
                            <Badge variant="outline" className="text-xs bg-blue-50">
                              {demand.category}: {demand.title}
                            </Badge>
                          )}
                          {devNames.map(name => (
                            <Badge key={name} variant="outline" className="text-xs">
                              <User className="h-3 w-3 mr-1" />
                              {name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Conquistas */}
        <Card className="border-t-2 border-green-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Conquistas
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {achievements.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenForm('achievements')}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma conquista registrada ainda
              </p>
            ) : (
              achievements.map((achievement) => {
                const task = achievement.timelineTaskId ? getTimelineTask(achievement.timelineTaskId) : null;
                const demand = achievement.demandId ? getDemand(achievement.demandId) : null;
                const devNames = achievement.devIds?.map(getDevName).filter(Boolean) || [];

                return (
                  <Alert
                    key={achievement.id}
                    className="py-3 border-green-500/20 bg-green-500/5"
                  >
                    <AlertDescription className="text-sm text-foreground">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          {achievement.text}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenForm('achievements', achievement)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete('achievements', achievement.id)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Associações */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {achievement.achievementDate && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(achievement.achievementDate).toLocaleDateString('pt-BR')}
                          </Badge>
                        )}
                        {task && (
                          <Badge variant="secondary" className="text-xs">
                            <Link2 className="h-3 w-3 mr-1" />
                            {task.title}
                          </Badge>
                        )}
                        {demand && (
                          <Badge variant="outline" className="text-xs bg-blue-50">
                            {demand.category}: {demand.title}
                          </Badge>
                        )}
                        {devNames.map(name => (
                          <Badge key={name} variant="outline" className="text-xs">
                            <User className="h-3 w-3 mr-1" />
                            {name}
                          </Badge>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Informações Importantes */}
        <Card className="border-t-2 border-foreground">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-foreground" />
                Informações
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {important.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenForm('important')}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {important.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma informação importante no momento
              </p>
            ) : (
              important.map((info) => {
                const bgClass = info.type === 'success'
                  ? 'bg-green-500/5 border-green-500/20'
                  : info.type === 'warning'
                    ? 'bg-yellow-500/5 border-yellow-500/20'
                    : 'bg-muted/30 border-border';

                const task = info.timelineTaskId ? getTimelineTask(info.timelineTaskId) : null;
                const demand = info.demandId ? getDemand(info.demandId) : null;
                const devNames = info.devIds?.map(getDevName).filter(Boolean) || [];

                return (
                  <Alert
                    key={info.id}
                    className={`py-3 ${bgClass}`}
                  >
                    <AlertDescription className="text-sm text-foreground">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          {info.text}
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenForm('important', info)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete('important', info.id)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Associações */}
                      {(task || demand || devNames.length > 0) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task && (
                            <Badge variant="secondary" className="text-xs">
                              <Link2 className="h-3 w-3 mr-1" />
                              {task.title}
                            </Badge>
                          )}
                          {demand && (
                            <Badge variant="outline" className="text-xs bg-blue-50">
                              {demand.category}: {demand.title}
                            </Badge>
                          )}
                          {devNames.map(name => (
                            <Badge key={name} variant="outline" className="text-xs">
                              <User className="h-3 w-3 mr-1" />
                              {name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      <HighlightForm
        highlight={editingHighlight}
        highlightType={highlightType}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
      />
    </>
  );
};
