import { useState } from "react";
import { Pencil, Plus, Trash2, Eye } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import SearchBar from "../common/SearchBar";
import Modal from "../common/Modal";

const data = [
  ["Vivienda", "Daño parcial en paredes", "Alta", "San Jacinto", "15/08/2026"],
  ["Infraestructura", "Grietas en vía principal", "Media", "El Carmen de Bolívar", "15/08/2026"],
  ["Vivienda", "Techo colapsado", "Alta", "Zambrano", "15/08/2026"],
  ["Servicios públicos", "Daño en red de agua", "Media", "San Juan Nepomuceno", "15/08/2026"],
  ["Vivienda", "Vidrios rotos", "Baja", "San Jacinto", "15/08/2026"],
  ["Infraestructura", "Puente con daño leve", "Media", "El Carmen de Bolívar", "15/08/2026"],
];

export default function Afectaciones() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const rows = data.filter((r) => r.join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Afectaciones</h1>
          <p>Registro y seguimiento de daños ocasionados por sismos</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={17} /> Nueva Afectación
        </Button>
      </div>

      <Card>
        <div className="table-toolbar">
          <SearchBar value={q} onChange={setQ} />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Descripción</th>
                <th>Gravedad</th>
                <th>Municipio</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r[0]}</td>
                  <td><strong>{r[1]}</strong></td>
                  <td>
                    <span className={"badge " + r[2].toLowerCase()}>{r[2]}</span>
                  </td>
                  <td>{r[3]}</td>
                  <td>{r[4]}</td>
                  <td>
                    <div className="row-actions">
                      <button>
                        <Eye size={16} />
                      </button>
                      <button>
                        <Pencil size={16} />
                      </button>
                      <button className="danger">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">Mostrando 1 a {rows.length} registros</div>
      </Card>

      <Modal open={open} title="Nueva afectación" onClose={() => setOpen(false)}>
        <div className="form-grid">
          <label>
            Tipo
            <select>
              <option>Vivienda</option>
              <option>Infraestructura</option>
              <option>Personas</option>
              <option>Servicios públicos</option>
            </select>
          </label>
          <label>
            Gravedad
            <select>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </label>
          <label>
            Municipio
            <select>
              <option>San Jacinto</option>
              <option>Zambrano</option>
              <option>El Carmen de Bolívar</option>
              <option>San Juan Nepomuceno</option>
            </select>
          </label>
          <label>
            Fecha
            <input type="date" />
          </label>
          <label className="full">
            Descripción
            <textarea rows={3} placeholder="Describa la afectación..." />
          </label>
        </div>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setOpen(false)}>Guardar</Button>
        </div>
      </Modal>
    </div>
  );
}