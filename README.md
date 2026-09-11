# SISMO TECH - Frontend

Interfaz web del proyecto académico SISMO TECH, desarrollada con React + TypeScript + Vite.

## Tecnologías

- React
- TypeScript
- Vite
- React Router
- Lucide React

## Ejecutar

```bash
npm install
npm run dev
```

## Estructura

- `src/components/layout`: estructura visual general.
- `src/components/common`: componentes reutilizables.
- `src/components/dashboard`: tarjetas y gráficos.
- `src/pages`: pantallas principales.
- `src/services`: conexión preparada para el backend.
- `src/context`: autenticación.
- `src/routes`: navegación.

## Backend

La URL del backend se puede definir en `.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Por ahora las pantallas usan datos de ejemplo para que el prototipo sea navegable. Los servicios ya están separados para conectar posteriormente la API y la base de datos.
