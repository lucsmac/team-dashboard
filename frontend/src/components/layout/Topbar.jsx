import { useLocation } from 'react-router-dom';
import { Calendar, Edit2, Save, Download, Upload, RotateCcw } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const routeNames = {
  overview: 'Resumo',
  team: 'Time',
  demands: 'Demandas',
  highlights: 'Highlights',
};

/**
 * Topbar com breadcrumbs e controles de edição
 */
export const Topbar = () => {
  const location = useLocation();
  const {
    dashboardData,
    editMode,
    toggleEditMode,
    exportData,
    importData,
    resetData,
  } = useDashboardData();

  const fileInputRef = useRef(null);

  // Extrai rota atual
  const currentRoute = location.pathname.split('/')[1] || 'overview';
  const currentPageName = routeNames[currentRoute] || 'Dashboard';

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
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentPageName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Controles */}
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline">Exportar</span>
        </Button>
      </div>
    </header>
  );
};
