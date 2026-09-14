import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Overview from './pages/Overview';
import DigitalTwin from './pages/DigitalTwin';
import Energy from './pages/Energy';
import Process from './pages/Process';
import EquipmentHealth from './pages/EquipmentHealth';
import PredictiveMaintenance from './pages/PredictiveMaintenance';
import Optimization from './pages/Optimization';
import WhatIfSimulator from './pages/WhatIfSimulator';
import WHRS from './pages/WHRS';
import CaptivePower from './pages/CaptivePower';
import Emissions from './pages/Emissions';
import Alarms from './pages/Alarms';
import KaizenOpportunities from './pages/KaizenOpportunities';
import Reports from './pages/Reports';
import KaizenCopilot from './pages/KaizenCopilot';
import Administration from './pages/Administration';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore(state => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="digital-twin" element={<DigitalTwin />} />
            <Route path="energy" element={<Energy />} />
            <Route path="process" element={<Process />} />
            <Route path="equipment-health" element={<EquipmentHealth />} />
            <Route path="predictive-maintenance" element={<PredictiveMaintenance />} />
            <Route path="optimization" element={<Optimization />} />
            <Route path="what-if" element={<WhatIfSimulator />} />
            <Route path="whrs" element={<WHRS />} />
            <Route path="captive-power" element={<CaptivePower />} />
            <Route path="emissions" element={<Emissions />} />
            <Route path="alarms" element={<Alarms />} />
            <Route path="kaizen" element={<KaizenOpportunities />} />
            <Route path="reports" element={<Reports />} />
            <Route path="copilot" element={<KaizenCopilot />} />
            <Route path="admin" element={<Administration />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
