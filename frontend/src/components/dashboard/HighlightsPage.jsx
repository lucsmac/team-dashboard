import { AlertCircle, Award, Info, Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { getSeverityColor, getInfoTypeColor } from '@/utils/colorUtils';
import HighlightForm from '../highlights/HighlightForm';
import { useState } from 'react';

/**
 * Página de highlights (entraves, conquistas, informações importantes)
 */
export const HighlightsPage = () => {
  const { dashboardData, addHighlight, updateHighlight, removeHighlight } = useDashboardData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState(null);
  const [highlightType, setHighlightType] = useState('blockers');

  const { blockers, achievements, important } = dashboardData.highlights;

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

  return (
    <>
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
              blockers.map((blocker) => (
                <Alert
                  key={blocker.id}
                  variant={blocker.severity === 'alta' ? 'destructive' : 'default'}
                  className="py-3"
                >
                  <AlertDescription className="text-sm flex items-start justify-between">
                    <div className="flex-1">
                      {blocker.text}
                      <Badge
                        variant="outline"
                        className="ml-2 text-xs"
                      >
                        {blocker.severity}
                      </Badge>
                    </div>
                    <div className="flex gap-1 ml-2">
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
                  </AlertDescription>
                </Alert>
              ))
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
              achievements.map((achievement) => (
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
                    {(achievement.achievementDate || achievement.demand) && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {achievement.achievementDate && (
                          <Badge variant="outline" className="text-xs">
                            📅 {new Date(achievement.achievementDate).toLocaleDateString('pt-BR')}
                          </Badge>
                        )}
                        {achievement.demand && (
                          <Badge variant="outline" className="text-xs bg-blue-50">
                            🔗 {achievement.demand.title}
                          </Badge>
                        )}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              ))
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

                return (
                  <Alert
                    key={info.id}
                    className={`py-3 ${bgClass}`}
                  >
                    <AlertDescription className="text-sm text-foreground flex items-start justify-between">
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
