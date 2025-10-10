import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DemandCard } from '../demands/DemandCard';
import DemandForm from '../demands/DemandForm';
import { FolderOpen, ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Página de demandas organizada por categoria
 */
export const DemandsPage = () => {
  const { dashboardData, createDemand, updateDemand, deleteDemand } = useDashboardData();
  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(dashboardData.demands)
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDemand, setEditingDemand] = useState(null);

  const totalDemands = Object.values(dashboardData.demands).flat().length;

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
      await updateDemand(editingDemand.id, formData);
    } else {
      await createDemand(formData);
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
        <div className="space-y-4">
          {Object.entries(dashboardData.demands).map(([category, demands]) => {
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
                        className={`h-4 w-4 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
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
                          onDelete={deleteDemand}
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

      {/* Form Dialog */}
      <DemandForm
        demand={editingDemand}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSave}
      />
    </div>
  );
};
