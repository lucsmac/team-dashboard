import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/services/api';
import { useDashboard } from '@/context/DashboardContext';
import { ALLOCATION_TYPES, ALLOCATION_TYPE_LABELS, ALLOCATION_TYPE_COLORS, ALLOCATION_TYPE_EMOJIS } from '@/utils/enums';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/lib/utils';

/**
 * Componente principal para gerenciar alocações semanais de devs
 */
export function DevAllocationManager() {
  const { dashboardData } = useDashboard();
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekStart, setCurrentWeekStart] = useState(null);
  const [editingAllocation, setEditingAllocation] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calcular início da semana atual (domingo)
  const getWeekStart = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getWeekEnd = (weekStart) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  // Inicializar com semana atual
  useEffect(() => {
    const today = new Date();
    setCurrentWeekStart(getWeekStart(today));
  }, []);

  // Carregar alocações quando a semana mudar
  useEffect(() => {
    if (currentWeekStart) {
      loadAllocations();
    }
  }, [currentWeekStart]);

  const loadAllocations = async () => {
    try {
      setLoading(true);
      const data = await api.getAllocationsByWeek(currentWeekStart.toISOString());
      setAllocations(data);
    } catch (error) {
      console.error('Erro ao carregar alocações:', error);
      alert('Erro ao carregar alocações');
    } finally {
      setLoading(false);
    }
  };

  // Navegar entre semanas
  const goToPreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getWeekStart(new Date()));
  };

  // Formatar data para exibição
  const formatWeekRange = () => {
    if (!currentWeekStart) return '';
    const start = currentWeekStart.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    const end = getWeekEnd(currentWeekStart).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    return `${start} - ${end}`;
  };

  // Agrupar alocações por dev
  const allocationsByDev = useMemo(() => {
    if (!dashboardData?.devs) return {};

    const grouped = {};
    dashboardData.devs.forEach(dev => {
      grouped[dev.id] = {
        dev,
        allocations: allocations.filter(a => a.devId === dev.id)
      };
    });
    return grouped;
  }, [dashboardData?.devs, allocations]);

  // Abrir dialog para criar/editar
  const handleOpenDialog = (dev, allocation = null) => {
    if (allocation) {
      setEditingAllocation({
        id: allocation.id,
        devId: dev.id,
        devName: dev.name,
        allocationType: allocation.allocationType,
        allocationPercent: allocation.allocationPercent,
        notes: allocation.notes || ''
      });
    } else {
      setEditingAllocation({
        devId: dev.id,
        devName: dev.name,
        allocationType: ALLOCATION_TYPES.ROADMAP,
        allocationPercent: 100,
        notes: ''
      });
    }
    setIsDialogOpen(true);
  };

  // Salvar alocação
  const handleSave = async () => {
    try {
      await api.upsertDevAllocation({
        devId: editingAllocation.devId,
        weekStart: currentWeekStart.toISOString(),
        weekEnd: getWeekEnd(currentWeekStart).toISOString(),
        allocationType: editingAllocation.allocationType,
        allocationPercent: editingAllocation.allocationPercent,
        notes: editingAllocation.notes
      });

      setIsDialogOpen(false);
      setEditingAllocation(null);
      loadAllocations();
    } catch (error) {
      console.error('Erro ao salvar alocação:', error);
      alert(error.message || 'Erro ao salvar alocação');
    }
  };

  // Deletar alocação
  const handleDelete = async (allocationId) => {
    if (!confirm('Deseja realmente remover esta alocação?')) return;

    try {
      await api.deleteDevAllocation(allocationId);
      loadAllocations();
    } catch (error) {
      console.error('Erro ao deletar alocação:', error);
      alert('Erro ao deletar alocação');
    }
  };

  if (!currentWeekStart) return null;

  return (
    <div className="space-y-6">
      {/* Header com navegação de semanas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Alocação Semanal do Time
              </CardTitle>
              <CardDescription>
                Gerencie onde cada dev está alocado durante a semana
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[160px] text-center">
                <div className="font-semibold">{formatWeekRange()}</div>
                <Button variant="link" size="sm" onClick={goToCurrentWeek} className="h-auto py-0">
                  Voltar para hoje
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={goToNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grid de devs */}
      {loading ? (
        <LoadingSpinner message="Carregando alocações..." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(allocationsByDev).map(({ dev, allocations: devAllocations }) => (
            <Card key={dev.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{dev.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {dev.role} • {dev.seniority}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleOpenDialog(dev)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {devAllocations.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma alocação esta semana
                  </div>
                ) : (
                  devAllocations.map((allocation) => (
                    <div
                      key={allocation.id}
                      className="flex items-center justify-between p-2 rounded-md border bg-card"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg">{ALLOCATION_TYPE_EMOJIS[allocation.allocationType]}</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {ALLOCATION_TYPE_LABELS[allocation.allocationType]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {allocation.allocationPercent}% da semana
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleOpenDialog(dev, allocation)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDelete(allocation.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog de edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAllocation?.id ? 'Editar Alocação' : 'Nova Alocação'}
            </DialogTitle>
            <DialogDescription>
              {editingAllocation?.devName} - Semana de {formatWeekRange()}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Tipo de alocação */}
            <div className="space-y-2">
              <Label>Tipo de Alocação</Label>
              <div className="flex gap-2">
                {Object.values(ALLOCATION_TYPES).map((type) => (
                  <Button
                    key={type}
                    variant={editingAllocation?.allocationType === type ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => setEditingAllocation({ ...editingAllocation, allocationType: type })}
                  >
                    <span className="mr-2">{ALLOCATION_TYPE_EMOJIS[type]}</span>
                    {ALLOCATION_TYPE_LABELS[type]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Percentual */}
            <div className="space-y-2">
              <Label>Percentual de Alocação: {editingAllocation?.allocationPercent}%</Label>
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={editingAllocation?.allocationPercent || 0}
                onChange={(e) => setEditingAllocation({ ...editingAllocation, allocationPercent: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label>Notas (opcional)</Label>
              <Textarea
                placeholder="Ex: Focado em resolver bugs críticos"
                value={editingAllocation?.notes || ''}
                onChange={(e) => setEditingAllocation({ ...editingAllocation, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
