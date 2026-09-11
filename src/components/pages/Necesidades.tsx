import { useState } from "react";
import { Pencil, Plus, Trash2, Eye } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import SearchBar from "../common/SearchBar";
import Modal from "../common/Modal";

const data = [
  ["Alimentos", "Alimentos no perecederos", "Alta", "Pendiente", "15/08/2026"],
  ["Agua", "Agua potable", "Alta", "Pendiente", "15/08/2026"],
  ["Aseo", "Kit de aseo personal", "Media", "En proceso", "16/08/2026"],
  ["Salud", "Medicamentos básicos", "Alta", "Pendiente", "16/08/2026"],
  ["Albergue", "Carpas para 10 familias", "Media", "En proceso", "16/08/2026"],
  ["Ropa", "Ropa para adultos y niños", "Baja", "Atendida", "17/08/2026"],
];

export default function Necesidades() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const rows = data.filter((r) => r.join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Necesidades</h1>
          <p>Control de necesidades reportadas por la comunidad</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={17} /> Nueva Necesidad
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
                <th>Tipo de necesidad</th>
                <th>Descripción</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td>
                    <span className={"badge " + r[2].toLowerCase()}>{r[2]}</span>
                  </td>
                  <td>
                    <span className="status">{r[3]}</span>
                  </td>
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

      <Modal open={open} title="Nueva necesidad" onClose={() => setOpen(false)}>
        <div className="form-grid">
          <label>
            Tipo
            <select>
              <option>Alimentos</option>
              <option>Agua</option>
              <option>Aseo</option>
              <option>Salud</option>
              <option>Albergue</option>
              <option>Ropa</option>
            </select>
          </label>
          <label>
            Prioridad
            <select>
              <option>Alta</option>
              <option>Media</option>
              <option>Baja</option>
            </select>
          </label>
          <label className="full">
            Descripción
            <textarea rows={3} />
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