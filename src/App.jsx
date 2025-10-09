import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import { Container } from './components/layout/Container';
import { Header } from './components/layout/Header';
import { DashboardTabs } from './components/dashboard/DashboardTabs';

/**
 * Componente principal da aplicação
 */
function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <Container>
          <Header />
          <Routes>
            <Route path="/*" element={<DashboardTabs />} />
            <Route path="/" element={<Navigate to="/overview" replace />} />
          </Routes>
        </Container>
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
