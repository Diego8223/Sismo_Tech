import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Bell,
  ClipboardList,
  FileText,
  Gift,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Users,
  UsersRound,
  UserCog,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/personas", label: "Personas", icon: Users },
  { to: "/familias", label: "Familias", icon: UsersRound },
  { to: "/eventos", label: "Eventos Sísmicos", icon: Activity },
  { to: "/afectaciones", label: "Afectaciones", icon: AlertTriangle },
  { to: "/necesidades", label: "Necesidades", icon: ClipboardList },
  { to: "/atenciones", label: "Atenciones", icon: HeartPulse },
  { to: "/ayudas", label: "Ayudas", icon: Gift },
  { to: "/usuarios", label: "Usuarios", icon: UserCog },
  { to: "/reportes", label: "Reportes", icon: FileText },
];

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "AD";

  return (
    <div className="app-shell">
      <aside className={"sidebar" + (open ? " sidebar-open" : "")}>
        <div className="brand">
          <Activity className="brand-mark" size={26} />
          <div>
            <strong>
              SISMO <span>TECH</span>
            </strong>
            <small>Sistema de Información para la Gestión de Afectaciones por Sismos</small>
          </div>
        </div>

        <nav className="nav-list">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}
              onClick={() => setOpen(false)}
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="avatar small">{initials}</div>
          <div className="user-data">
            <strong>{user?.name ?? "Administrador"}</strong>
            <span>{user?.email ?? "admin@sismotech.com"}</span>
          </div>
          <button className="icon-button" title="Cerrar sesión" onClick={logout}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

      <div className="main-shell">
        <header className="navbar">
          <button className="icon-button mobile-menu" onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>

          <div className="top-search">
            <Search size={16} />
            <input placeholder="Buscar..." />
          </div>

          <div className="navbar-right">
            <button className="icon-button notification">
              <Bell size={19} />
              <span />
            </button>
            <div className="top-user">
              <div className="avatar">{initials}</div>
              <div>
                <strong>{user?.name ?? "Administrador"}</strong>
                <small>{user?.role ?? "Administrador del sistema"}</small>
              </div>
            </div>
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>

        <footer className="footer">© 2026 Sismo Tech. Todos los derechos reservados.</footer>
      </div>
    </div>
  );
}
