import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminAccessState } from '@/lib/adminAccess';

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();
  const access = getAdminAccessState({ loading, isAuthenticated, isAdmin });

  if (access === 'checking') {
    return (
      <div className="grid min-h-screen place-items-center bg-[#0A0B0C] text-sm text-white/50">
        Checking admin access…
      </div>
    );
  }

  if (access === 'signed-out') {
    return <Navigate to="/admin-login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (access === 'forbidden') {
    return <Navigate to="/" replace />;
  }

  return children;
};
