import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { FederatedProvider } from './context/FederatedContext';
import { Layout } from './components/layout/Layout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AskClinicalData } from './pages/AskClinicalData';
import { QueryBuilder } from './pages/QueryBuilder';
import { QueryHistory } from './pages/QueryHistory';
import { Institutions } from './pages/Institutions';
import { InstitutionDetails } from './pages/InstitutionDetails';
import { SchemaMapping } from './pages/SchemaMapping';
import { Provenance } from './pages/Provenance';
import { QueryExplanation } from './pages/QueryExplanation';
import { Performance } from './pages/Performance';
import { AuditLogs } from './pages/AuditLogs';
import { AdminDashboard } from './pages/AdminDashboard';
import { Approvals } from './pages/Approvals';
import { InstitutionAdmin } from './pages/InstitutionAdmin';
import { Auditor } from './pages/Auditor';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <FederatedProvider>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/ask" element={<AskClinicalData />} />
                  <Route path="/query-builder" element={<QueryBuilder />} />
                  <Route path="/history" element={<QueryHistory />} />
                  <Route path="/query/:id" element={<QueryExplanation />} />
                  <Route path="/institutions" element={<Institutions />} />
                  <Route path="/institutions/:id" element={<InstitutionDetails />} />
                  <Route path="/schema-mapping" element={<SchemaMapping />} />
                  <Route path="/provenance" element={<Provenance />} />
                  <Route path="/performance" element={<Performance />} />
                  <Route path="/audit-logs" element={<AuditLogs />} />
                  <Route path="/approvals" element={<Approvals />} />

                  {/* Role-Specific Portals */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />

                  <Route path="/institution-admin" element={
                    <ProtectedRoute allowedRoles={['INSTITUTION_ADMIN', 'ADMIN']}>
                      <InstitutionAdmin />
                    </ProtectedRoute>
                  } />

                  <Route path="/auditor" element={
                    <ProtectedRoute allowedRoles={['AUDITOR', 'ADMIN']}>
                      <Auditor />
                    </ProtectedRoute>
                  } />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </FederatedProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
