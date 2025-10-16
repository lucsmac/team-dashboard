import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './components/dashboard/OverviewPage';
import { TeamPage } from './components/dashboard/TeamPage';
import { DemandsPage } from './components/dashboard/DemandsPage';
import { HighlightsPage } from './components/dashboard/HighlightsPage';
import { RoadmapPage } from './components/dashboard/RoadmapPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ErrorMessage } from './components/common/ErrorMessage';

/**
 * Wrapper para exibir loading/error antes do conteúdo
 */
function AppContent() {
  const { loading, error, loadDashboard } = useDashboard();

  if (loading) {
    return <LoadingSpinner message="Carregando dashboard..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={loadDashboard} />;
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/demands" element={<DemandsPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/highlights" element={<HighlightsPage />} />
      </Routes>
    </AppShell>
  );
}

/**
 * Componente principal da aplicação
 */
function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <AppContent />
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
