import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import Card from "../common/Card";
import Button from "../common/Button";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import Modal from "../common/Modal";

const initial = [
  ["María José Pérez", "1045678901", "12/05/1965", "Familia Pérez"],
  ["Juan Carlos Gómez", "1045678902", "23/08/1990", "Familia Gómez"],
  ["Ana Sofía Martínez", "1045678903", "05/11/2010", "Familia Martínez"],
  ["Luis Fernando Díaz", "1045678904", "17/02/1975", "Familia Díaz"],
  ["Carmen Elisa Ruiz", "1045678905", "30/09/1982", "Familia Ruiz"],
  ["Pedro Pablo Torres", "1045678906", "14/06/2008", "Familia Torres"],
];

export default function Personas() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const rows = useMemo(
    () => initial.filter((r) => r.join(" ").toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Personas</h1>
          <p>Registro de personas afectadas</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus size={17} /> Nueva Persona
        </Button>
      </div>

      <Card>
        <div className="table-toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Buscar persona..." />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre completo</th>
                <th>Documento</th>
                <th>Fecha nacimiento</th>
                <th>Familia</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r[1]}>
                  <td>{i + 1}</td>
                  <td><strong>{r[0]}</strong></td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
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
        <div className="table-footer">
          Mostrando 1 a {rows.length} registros{" "}
          <Pagination page={page} totalPages={4} onChange={setPage} />
        </div>
      </Card>

      <Modal open={open} title="Nueva persona" onClose={() => setOpen(false)}>
        <div className="form-grid">
          <label>
            Nombre completo
            <input placeholder="Nombre completo" />
          </label>
          <label>
            Documento
            <input placeholder="Número de documento" />
          </label>
          <label>
            Fecha de nacimiento
            <input type="date" />
          </label>
          <label>
            Familia
            <select>
              <option>Seleccione una familia</option>
              <option>Familia Pérez</option>
              <option>Familia Gómez</option>
            </select>
          </label>
        </div>
        <div className="modal-actions">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setOpen(false)}>Guardar persona</Button>
        </div>
      </Modal>
    </div>
  );
}