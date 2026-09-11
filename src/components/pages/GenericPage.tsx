import { useState } from "react";
import { Eye, Pencil, Plus, Trash2, Search } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  button: string;
  columns: string[];
  rows: string[][];
};

// ===============================
// COMPONENTE CARD
// ===============================
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// ===============================
// COMPONENTE BUTTON
// ===============================
function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      {children}
    </button>
  );
}

// ===============================
// COMPONENTE SEARCH BAR
// ===============================
function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="search-bar">
      <Search size={18} />

      <input
        type="text"
        placeholder="Buscar..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ===============================
// GENERIC PAGE
// ===============================
export default function GenericPage({
  title,
  subtitle,
  button,
  columns,
  rows,
}: Props) {
  const [q, setQ] = useState("");

  const filtered = rows.filter((row) =>
    row.join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="page">

      {/* ENCABEZADO */}
      <div className="page-heading">

        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        <Button>
          <Plus size={17} />
          {button}
        </Button>

      </div>

      {/* CONTENIDO */}
      <Card>

        {/* BUSCADOR */}
        <div className="table-toolbar">
          <SearchBar
            value={q}
            onChange={setQ}
          />
        </div>

        {/* TABLA */}
        <div className="table-wrap">

          <table>

            <thead>
              <tr>

                {columns.map((column) => (
                  <th key={column}>
                    {column}
                  </th>
                ))}

                <th>
                  Acciones
                </th>

              </tr>
            </thead>

            <tbody>

              {filtered.length > 0 ? (

                filtered.map((row, index) => (

                  <tr key={index}>

                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>
                        {cell}
                      </td>
                    ))}

                    <td>

                      <div className="row-actions">

                        <button
                          type="button"
                          title="Ver"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="danger"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan={columns.length + 1}
                    style={{ textAlign: "center", padding: "30px" }}
                  >
                    No se encontraron registros
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* PIE DE TABLA */}
        <div className="table-footer">
          Mostrando {filtered.length} registros
        </div>

      </Card>

    </div>
  );
}