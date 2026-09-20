import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';

// Existing eager loads (keep simple ones eager if preferred, but lazy is good for all)
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';

// Lazy loaded pages
const Overview = lazy(() => import('./pages/Overview'));
const DigitalTwin = lazy(() => import('./pages/DigitalTwin'));
const Energy = lazy(() => import('./pages/Energy'));
const Process = lazy(() => import('./pages/Process'));
const EquipmentHealth = lazy(() => import('./pages/EquipmentHealth'));
const PredictiveMaintenance = lazy(() => import('./pages/PredictiveMaintenance'));
const WHRS = lazy(() => import('./pages/WHRS'));
const CaptivePower = lazy(() => import('./pages/CaptivePower'));
const Emissions = lazy(() => import('./pages/Emissions'));
const Alarms = lazy(() => import('./pages/Alarms'));
const KaizenOpportunities = lazy(() => import('./pages/KaizenOpportunities'));
const Reports = lazy(() => import('./pages/Reports'));
const Administration = lazy(() => import('./pages/Administration'));

// New lazy loaded pages
const LossTree = lazy(() => import('./pages/LossTree'));
const OEEAnalysis = lazy(() => import('./pages/OEEAnalysis'));
const KaizenProjects = lazy(() => import('./pages/KaizenProjects'));
const RootCauseAnalysis = lazy(() => import('./pages/RootCauseAnalysis'));
const ImprovementVerification = lazy(() => import('./pages/ImprovementVerification'));
const KaizenDatabase = lazy(() => import('./pages/KaizenDatabase'));
const OnePointLessons = lazy(() => import('./pages/OnePointLessons'));

// Fallback loader
const PageLoader = () => (
  <div className="flex h-full items-center justify-center bg-[#041116] text-[#00e676]">
    <div className="w-8 h-8 border-4 border-[#00e676] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="/overview" element={<Suspense fallback={<PageLoader />}><Overview /></Suspense>} />
            <Route path="digital-twin" element={<Suspense fallback={<PageLoader />}><DigitalTwin /></Suspense>} />
            <Route path="process" element={<Suspense fallback={<PageLoader />}><Process /></Suspense>} />
            
            {/* Energy & Sustainability */}
            <Route path="energy" element={<Suspense fallback={<PageLoader />}><Energy /></Suspense>} />
            <Route path="emissions" element={<Suspense fallback={<PageLoader />}><Emissions /></Suspense>} />
            <Route path="whrs" element={<Suspense fallback={<PageLoader />}><WHRS /></Suspense>} />
            <Route path="captive-power" element={<Suspense fallback={<PageLoader />}><CaptivePower /></Suspense>} />

            {/* Asset Intelligence */}
            <Route path="equipment-health" element={<Suspense fallback={<PageLoader />}><EquipmentHealth /></Suspense>} />
            <Route path="predictive-maintenance" element={<Suspense fallback={<PageLoader />}><PredictiveMaintenance /></Suspense>} />
            <Route path="alarms" element={<Suspense fallback={<PageLoader />}><Alarms /></Suspense>} />

            {/* Kaizen Intelligence */}
            <Route path="loss-tree" element={<Suspense fallback={<PageLoader />}><LossTree /></Suspense>} />
            <Route path="oee" element={<Suspense fallback={<PageLoader />}><OEEAnalysis /></Suspense>} />
            <Route path="kaizen" element={<Suspense fallback={<PageLoader />}><KaizenOpportunities /></Suspense>} />
            <Route path="rca" element={<Suspense fallback={<PageLoader />}><RootCauseAnalysis /></Suspense>} />
            <Route path="kaizen-projects" element={<Suspense fallback={<PageLoader />}><KaizenProjects /></Suspense>} />
            <Route path="verification" element={<Suspense fallback={<PageLoader />}><ImprovementVerification /></Suspense>} />
            <Route path="kaizen-db" element={<Suspense fallback={<PageLoader />}><KaizenDatabase /></Suspense>} />
            <Route path="opl" element={<Suspense fallback={<PageLoader />}><OnePointLessons /></Suspense>} />

            {/* Analytics */}
            <Route path="reports" element={<Suspense fallback={<PageLoader />}><Reports /></Suspense>} />

            {/* Admin */}
            <Route path="admin" element={<Suspense fallback={<PageLoader />}><Administration /></Suspense>} />
            
            {/* Catch all for unimplemented routes mapped in Layout */}
            <Route path="*" element={
              <div className="flex h-full items-center justify-center text-[#5a7384]">
                Page Under Construction
              </div>
            } />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
