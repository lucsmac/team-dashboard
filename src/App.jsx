import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './components/dashboard/OverviewPage';
import { TeamPage } from './components/dashboard/TeamPage';
import { DemandsPage } from './components/dashboard/DemandsPage';
import { HighlightsPage } from './components/dashboard/HighlightsPage';

/**
 * Componente principal da aplicação
 */
function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/demands" element={<DemandsPage />} />
            <Route path="/highlights" element={<HighlightsPage />} />
          </Routes>
        </AppShell>
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
