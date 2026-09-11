import { Activity, AlertTriangle, HeartHandshake, Users } from "lucide-react";
import Card from "../common/Card";
import StatCard from "../dashboard/StatCard";
import DashboardChart from "../dashboard/DashboardChart";

export default function Dashboard() {
  const affect = [
    { label: "Vivienda", value: 9 },
    { label: "Infraestructura", value: 5 },
    { label: "Personas", value: 4 },
    { label: "Servicios públicos", value: 2 },
  ];
  const priorities = [
    { label: "Alta", value: 18 },
    { label: "Media", value: 12 },
    { label: "Baja", value: 8 },
  ];
  const municipalities = [
    { label: "San Jacinto", value: 12 },
    { label: "El Carmen de Bolívar", value: 8 },
    { label: "Zambrano", value: 6 },
    { label: "San Juan Nepomuceno", value: 4 },
  ];

  const recentAffectations = [
    "Daño parcial en viviendas",
    "Grietas en vía principal",
    "Techo colapsado",
    "Vidrios rotos",
  ];
  const recentPlaces = ["San Jacinto", "El Carmen de Bolívar", "Zambrano", "San Jacinto"];

  const recentEvents = [
    "Magnitud 6.2 - San Jacinto",
    "Magnitud 5.1 - El Carmen de Bolívar",
    "Magnitud 4.7 - Zambrano",
  ];
  const recentEventDates = [
    "15 de agosto de 2026 - 10:24 AM",
    "10 de agosto de 2026 - 02:15 PM",
    "02 de agosto de 2026 - 08:45 AM",
  ];

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general del sistema</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard title="PERSONAS" value="40" subtitle="Total registradas" icon={Users} tone="green" />
        <StatCard title="FAMILIAS" value="20" subtitle="Total registradas" icon={Users} tone="blue" />
        <StatCard title="AFECTACIONES" value="20" subtitle="Total registradas" icon={AlertTriangle} tone="orange" />
        <StatCard title="AYUDAS ENTREGADAS" value="10" subtitle="Total entregadas" icon={HeartHandshake} tone="purple" />
      </div>

      <div className="dashboard-grid">
        <Card title="Afectaciones por tipo">
          <DashboardChart items={affect} type="donut" />
        </Card>
        <Card title="Necesidades por prioridad">
          <DashboardChart items={priorities} />
        </Card>
        <Card title="Afectaciones por municipio">
          <DashboardChart items={municipalities} />
        </Card>
        <Card title="Ayudas entregadas por tipo">
          <DashboardChart
            items={[
              { label: "Alimentos", value: 40 },
              { label: "Kit de aseo", value: 25 },
              { label: "Higiene personal", value: 20 },
              { label: "Albergue", value: 15 },
            ]}
            type="donut"
          />
        </Card>
      </div>

      <div className="dashboard-grid bottom">
        <Card title="Afectaciones recientes">
          <div className="recent-list">
            {recentAffectations.map((x, i) => (
              <div className="recent-item" key={x}>
                <span className={"priority p" + i}>
                  {i === 0 || i === 2 ? "ALTA" : i === 1 ? "MEDIA" : "BAJA"}
                </span>
                <div>
                  <strong>{x}</strong>
                  <small>{recentPlaces[i]}</small>
                </div>
                <time>15/08/2026</time>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Últimos eventos sísmicos">
          <div className="recent-list">
            {recentEvents.map((x, i) => (
              <div className="event-item" key={x}>
                <Activity size={20} />
                <div>
                  <strong>{x}</strong>
                  <small>{recentEventDates[i]}</small>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}