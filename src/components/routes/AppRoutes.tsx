import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Personas from "../pages/Personas";
import Familias from "../pages/Familias";
import Eventos from "../pages/Eventos";
import Afectaciones from "../pages/Afectaciones";
import Necesidades from "../pages/Necesidades";
import Atenciones from "../pages/Atenciones";
import Ayudas from "../pages/Ayudas";
import Usuarios from "../pages/Usuarios";
import Reportes from "../pages/Reportes";
import NotFound from "../pages/NotFound";
import { useAuth } from "../context/AuthContext";

function PrivateRoute() {
  const { user } = useAuth();
  return user ? <MainLayout /> : <Navigate to="/login" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/personas" element={<Personas />} />
        <Route path="/familias" element={<Familias />} />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/afectaciones" element={<Afectaciones />} />
        <Route path="/necesidades" element={<Necesidades />} />
        <Route path="/atenciones" element={<Atenciones />} />
        <Route path="/ayudas" element={<Ayudas />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/reportes" element={<Reportes />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
