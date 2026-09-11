import { FileText, Download } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import DashboardChart from "../dashboard/DashboardChart";

export default function Reportes() {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Reportes</h1>
          <p>Consulta y generación de información del sistema</p>
        </div>
      </div>

      <div className="report-grid">
        {[
          "Reporte de Afectaciones",
          "Reporte de Necesidades",
          "Reporte de Ayudas",
          "Reporte de Atenciones",
          "Reporte General",
        ].map((r) => (
          <Card key={r}>
            <div className="report-card">
              <div className="report-icon">
                <FileText />
              </div>
              <div>
                <h3>{r}</h3>
                <p>Resumen de información registrada</p>
              </div>
              <Button variant="secondary">
                <Download size={16} /> Generar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Resumen de afectaciones">
        <DashboardChart
          items={[
            { label: "Vivienda", value: 9 },
            { label: "Infraestructura", value: 5 },
            { label: "Personas", value: 4 },
            { label: "Servicios públicos", value: 2 },
          ]}
          type="donut"
        />
      </Card>
    </div>
  );
}