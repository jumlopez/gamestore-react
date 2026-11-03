import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

/** Equivale a protegerAdmin() de la versión HTML: exige sesión y un rol permitido */
export default function ProtectedRoute({ roles }) {
  const { sesion } = useAuth();
  const location = useLocation();

  if (!sesion) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (roles && !roles.includes(sesion.tipoUsuario)) return <Navigate to="/admin" replace />;
  return <Outlet />;
}
