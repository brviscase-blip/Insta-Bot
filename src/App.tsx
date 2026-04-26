import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase/client';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CalendarioPage from './pages/dashboard/CalendarioPage';
import BibliotecaPage from './pages/dashboard/BibliotecaPage';
import AnalyticsPage from './pages/dashboard/AnalyticsPage';
import BotsPage from './pages/dashboard/BotsPage';
import ContasPage from './pages/dashboard/ContasPage';

function RequireAuth() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("mock_session") === "true") {
      setSession({ user: { email: "beatrizcabrallima82@gmail.com" } });
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative z-10">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={<RequireAuth />}>
          <Route index element={<DashboardPage />} />
          <Route path="calendario" element={<CalendarioPage />} />
          <Route path="biblioteca" element={<BibliotecaPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="bots" element={<BotsPage />} />
          <Route path="contas" element={<ContasPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
