# SISMO TECH - Backend Python

Backend REST para el proyecto SISMO TECH, construido con FastAPI, SQLAlchemy y MySQL.

## 1. Crear la base de datos

Abre MySQL Workbench y ejecuta:

`../sql/sismo_tech.sql`

El script crea la base `sismo_tech`, las tablas, relaciones, datos iniciales y una vista para el dashboard.

## 2. Configurar Python

Desde esta carpeta:

```bash
python -m venv .venv
```

Windows:

```bash
.venv\\Scripts\\activate
```

Instalar dependencias:

```bash
pip install -r requirements.txt
```

Copia `.env.example` como `.env` y coloca la contraseña real de tu MySQL.

Ejemplo:

```env
DATABASE_URL=mysql+pymysql://root:TU_PASSWORD@localhost:3306/sismo_tech
CORS_ORIGINS=http://localhost:5173
```

## 3. Ejecutar

```bash
uvicorn main:app --reload --port 3000
```

API: `http://localhost:3000`

Documentación automática: `http://localhost:3000/docs`

## 4. Usuario de prueba

- Correo: `admin@sismotech.com`
- Contraseña: `123456`

También están creados Miledys, Daniela y Diego con la misma contraseña para pruebas académicas.

## Endpoints principales

- `GET /api/health`
- `POST /api/login`
- `GET/POST /api/personas`
- `GET/POST /api/familias`
- `GET/POST /api/eventos`
- `GET/POST /api/afectaciones`
- `GET/POST /api/necesidades`
- `GET/POST /api/ayudas`
- `GET/POST /api/atenciones`
- `GET /api/usuarios`
- `GET /api/municipios`
- `GET /api/dashboard`
- `GET /api/reportes/general`
