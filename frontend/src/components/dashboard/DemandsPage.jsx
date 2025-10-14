import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DemandCard } from '../demands/DemandCard';
import DemandForm from '../demands/DemandForm';
import { FolderOpen, ChevronDown, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Página de demandas organizada por categoria
 */
export const DemandsPage = () => {
  const { dashboardData, addDemand, updateDemand, removeDemand } = useDashboardData();
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(dashboardData.demands)
  );
  const [showCompleted, setShowCompleted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDemand, setEditingDemand] = useState(null);

  const totalDemands = Object.values(dashboardData.demands).flat().length;

  // Separar demandas ativas e concluídas
  const activeDemands = {};
  const completedDemands = {};
  let totalCompleted = 0;

  Object.entries(dashboardData.demands).forEach(([category, demands]) => {
    const active = demands.filter(d => d.status !== 'concluido');
    const completed = demands.filter(d => d.status === 'concluido');

    if (active.length > 0) activeDemands[category] = active;
    if (completed.length > 0) {
      completedDemands[category] = completed;
      totalCompleted += completed.length;
    }
  });

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleOpenForm = (demand = null) => {
    setEditingDemand(demand);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDemand(null);
  };

  const handleSave = async (formData) => {
    if (editingDemand) {
      await updateDemand(editingDemand.category, editingDemand.id, formData);
    } else {
      await addDemand(formData.category, formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header com resumo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Demandas por Categoria</CardTitle>
              <CardDescription>
                {totalDemands} {totalDemands === 1 ? 'demanda total' : 'demandas totais'} distribuídas em {Object.keys(dashboardData.demands).length} {Object.keys(dashboardData.demands).length === 1 ? 'categoria' : 'categorias'}
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenForm()} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Demanda
            </Button>
          </div>
        </CardHeader>
      </Card>

      {Object.keys(dashboardData.demands).length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhuma demanda cadastrada</p>
              <p className="text-sm mt-2">As demandas aparecerão aqui quando forem criadas</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Demandas Ativas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Demandas Ativas</h3>
              <Badge variant="default">{totalDemands - totalCompleted}</Badge>
            </div>

            {Object.keys(activeDemands).length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-50 text-green-500" />
                    <p className="font-medium">Todas as demandas foram concluídas!</p>
                    <p className="text-sm mt-1">Parabéns pelo trabalho realizado</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              Object.entries(activeDemands).map(([category, demands]) => {
                const isExpanded = expandedCategories.includes(category);

                return (
                  <Card key={category} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{category}</CardTitle>
                          <Badge variant="secondary">
                            {demands.length}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCategory(category)}
                          className="h-8 w-8 p-0"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''
                              }`}
                          />
                        </Button>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                          {demands.map((demand) => (
                            <DemandCard
                              key={demand.id}
                              demand={demand}
                              category={category}
                              onEdit={handleOpenForm}
                              onDelete={(id) => removeDemand(category, id)}
                            />
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })
            )}
          </div>

          {/* Demandas Concluídas - Seção Colapsável */}
          {totalCompleted > 0 && (
            <div className="space-y-3">
              <Button
                variant="ghost"
                onClick={() => setShowCompleted(!showCompleted)}
                className="w-full justify-start gap-2 hover:bg-muted/50 border border-dashed"
              >
                {showCompleted ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-semibold">Demandas Concluídas</span>
                <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 border-green-300">
                  {totalCompleted}
                </Badge>
              </Button>

              {showCompleted && (
                <div className="space-y-4 pl-6 border-l-2 border-green-500/30">
                  {Object.entries(completedDemands).map(([category, demands]) => {
                    const isExpanded = expandedCategories.includes(category + '-completed');

                    return (
                      <Card key={category} className="overflow-hidden opacity-75 hover:opacity-100 transition-opacity">
                        <CardHeader className="pb-3 bg-green-50/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <CardTitle className="text-base">{category}</CardTitle>
                              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                                {demands.length}
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCategory(category + '-completed')}
                              className="h-8 w-8 p-0"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''
                                  }`}
                              />
                            </Button>
                          </div>
                        </CardHeader>

                        {isExpanded && (
                          <CardContent className="pt-3">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                              {demands.map((demand) => (
                                <DemandCard
                                  key={demand.id}
                                  demand={demand}
                                  category={category}
                                  onEdit={handleOpenForm}
                                  onDelete={(id) => removeDemand(category, id)}
                                />
                              ))}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <DemandForm
        demand={editingDemand}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
      />
    </div>
  );
};
