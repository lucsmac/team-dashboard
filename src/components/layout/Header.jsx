import { Calendar, Edit2, Save, Download, Upload, RotateCcw } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

/**
 * Header do dashboard com controles de edição e export/import
 */
export const Header = () => {
  const {
    dashboardData,
    editMode,
    toggleEditMode,
    exportData,
    importData,
    resetData
  } = useDashboardData();

  const fileInputRef = useRef(null);

  const handleExport = () => {
    const success = exportData();
    if (success) {
      alert('Dados exportados com sucesso!');
    } else {
      alert('Erro ao exportar dados');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = await importData(file);
    if (result.success) {
      alert('Dados importados com sucesso!');
    } else {
      alert(`Erro ao importar: ${result.error}`);
    }
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm('Tem certeza que deseja resetar todos os dados para o estado inicial?')) {
      resetData();
      alert('Dados resetados com sucesso!');
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold">Time Core - Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{dashboardData.week}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleImportClick}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Importar</span>
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />

            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Resetar</span>
            </Button>

            <Separator orientation="vertical" className="h-8 hidden sm:block" />

            <Button
              variant={editMode ? 'default' : 'secondary'}
              size="sm"
              onClick={toggleEditMode}
              className="gap-2"
            >
              {editMode ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
              {editMode ? 'Salvar' : 'Editar'}
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
