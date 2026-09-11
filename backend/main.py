from datetime import date, datetime
import hashlib
import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:123456@localhost:3306/sismo_tech",
)
CORS_ORIGINS = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if x.strip()]

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=280)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

app = FastAPI(title="SISMO TECH API", version="1.0.0", description="Backend para gestión de afectaciones por sismos")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


class LoginIn(BaseModel):
    correo: str
    password: str


class PersonaIn(BaseModel):
    nombre: str = Field(min_length=2, max_length=150)
    documento: str = Field(min_length=4, max_length=30)
    fecha_nacimiento: date
    familia_id: Optional[int] = None


class FamiliaIn(BaseModel):
    nombre: str = Field(min_length=2, max_length=120)
    municipio_id: int
    jefe_hogar_id: Optional[int] = None


class EventoIn(BaseModel):
    fecha: datetime
    magnitud: float = Field(ge=0, le=10)
    municipio_id: int
    descripcion: str = Field(min_length=2, max_length=255)


class AfectacionIn(BaseModel):
    tipo: str
    descripcion: str
    gravedad: str
    municipio_id: int
    fecha: date
    evento_id: Optional[int] = None


class NecesidadIn(BaseModel):
    tipo: str
    descripcion: str
    prioridad: str
    estado: str = "Pendiente"
    fecha: date
    familia_id: Optional[int] = None


class AyudaIn(BaseModel):
    tipo: str
    cantidad: int = Field(gt=0)
    unidad: str = "unidades"
    beneficiario: str
    fecha: date
    estado: str = "Entregada"
    familia_id: Optional[int] = None


class AtencionIn(BaseModel):
    persona_familia: str
    tipo: str
    responsable: str
    fecha: date
    estado: str = "Pendiente"
    familia_id: Optional[int] = None
    persona_id: Optional[int] = None


@app.get("/")
def root():
    return {"app": "SISMO TECH", "message": "API funcionando", "docs": "/docs"}


@app.get("/api/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}


@app.post("/api/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.execute(
        text("SELECT id, nombre, correo, rol, estado FROM usuarios WHERE correo=:correo AND password_hash=:password_hash LIMIT 1"),
        {"correo": data.correo, "password_hash": hash_password(data.password)},
    ).mappings().first()
    if not user or user["estado"] != "Activo":
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
    return dict(user)


def fetch_all(db: Session, sql: str, params=None):
    return [dict(r) for r in db.execute(text(sql), params or {}).mappings().all()]


@app.get("/api/usuarios")
def usuarios(db: Session = Depends(get_db)):
    return fetch_all(db, "SELECT id,nombre,correo,rol,estado FROM usuarios ORDER BY id")


@app.get("/api/municipios")
def municipios(db: Session = Depends(get_db)):
    return fetch_all(db, "SELECT id,nombre,departamento FROM municipios ORDER BY nombre")


@app.get("/api/personas")
def personas(q: Optional[str] = Query(None), db: Session = Depends(get_db)):
    sql = """
    SELECT p.id, p.nombre, p.documento, p.fecha_nacimiento,
           COALESCE(f.nombre,'Sin familia') AS familia,
           p.familia_id
    FROM personas p LEFT JOIN familias f ON f.id=p.familia_id
    """
    params = {}
    if q:
        sql += " WHERE p.nombre LIKE :q OR p.documento LIKE :q OR f.nombre LIKE :q"
        params["q"] = f"%{q}%"
    sql += " ORDER BY p.id"
    return fetch_all(db, sql, params)


@app.post("/api/personas", status_code=201)
def crear_persona(data: PersonaIn, db: Session = Depends(get_db)):
    try:
        result = db.execute(text("""
            INSERT INTO personas(nombre,documento,fecha_nacimiento,familia_id)
            VALUES(:nombre,:documento,:fecha_nacimiento,:familia_id)
        """), data.model_dump())
        db.commit()
        return {"id": result.lastrowid, **data.model_dump(mode="json")}
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="No fue posible crear la persona. Verifica documento y familia.") from exc


@app.get("/api/familias")
def familias(db: Session = Depends(get_db)):
    return fetch_all(db, """
        SELECT f.id, f.nombre AS familia,
               COALESCE(p.nombre,'Sin jefe de hogar') AS jefe_hogar,
               (SELECT COUNT(*) FROM personas px WHERE px.familia_id=f.id) AS personas,
               m.nombre AS municipio, f.municipio_id, f.jefe_hogar_id
        FROM familias f
        JOIN municipios m ON m.id=f.municipio_id
        LEFT JOIN personas p ON p.id=f.jefe_hogar_id
        ORDER BY f.id
    """)


@app.post("/api/familias", status_code=201)
def crear_familia(data: FamiliaIn, db: Session = Depends(get_db)):
    try:
        result = db.execute(text("INSERT INTO familias(nombre,municipio_id,jefe_hogar_id) VALUES(:nombre,:municipio_id,:jefe_hogar_id)"), data.model_dump())
        db.commit()
        return {"id": result.lastrowid, **data.model_dump()}
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="No fue posible crear la familia.") from exc


@app.get("/api/eventos")
def eventos(db: Session = Depends(get_db)):
    return fetch_all(db, """
        SELECT e.id, e.fecha, e.magnitud, m.nombre AS municipio, e.municipio_id, e.descripcion
        FROM eventos_sismicos e JOIN municipios m ON m.id=e.municipio_id
        ORDER BY e.fecha DESC
    """)


@app.post("/api/eventos", status_code=201)
def crear_evento(data: EventoIn, db: Session = Depends(get_db)):
    result = db.execute(text("""
        INSERT INTO eventos_sismicos(fecha,magnitud,municipio_id,descripcion)
        VALUES(:fecha,:magnitud,:municipio_id,:descripcion)
    """), data.model_dump())
    db.commit()
    return {"id": result.lastrowid, **data.model_dump(mode="json")}


@app.get("/api/afectaciones")
def afectaciones(db: Session = Depends(get_db)):
    return fetch_all(db, """
        SELECT a.id,a.tipo,a.descripcion,a.gravedad,m.nombre AS municipio,a.municipio_id,a.fecha,a.evento_id
        FROM afectaciones a JOIN municipios m ON m.id=a.municipio_id
        ORDER BY a.fecha DESC,a.id DESC
    """)


@app.post("/api/afectaciones", status_code=201)
def crear_afectacion(data: AfectacionIn, db: Session = Depends(get_db)):
    result = db.execute(text("""
        INSERT INTO afectaciones(tipo,descripcion,gravedad,municipio_id,fecha,evento_id)
        VALUES(:tipo,:descripcion,:gravedad,:municipio_id,:fecha,:evento_id)
    """), data.model_dump())
    db.commit()
    return {"id": result.lastrowid, **data.model_dump(mode="json")}


@app.get("/api/necesidades")
def necesidades(db: Session = Depends(get_db)):
    return fetch_all(db, """
        SELECT n.id,n.tipo,n.descripcion,n.prioridad,n.estado,n.fecha,n.familia_id,
               COALESCE(f.nombre,'Sin familia') AS familia
        FROM necesidades n LEFT JOIN familias f ON f.id=n.familia_id
        ORDER BY n.fecha DESC,n.id DESC
    """)


@app.post("/api/necesidades", status_code=201)
def crear_necesidad(data: NecesidadIn, db: Session = Depends(get_db)):
    result = db.execute(text("""
        INSERT INTO necesidades(tipo,descripcion,prioridad,estado,fecha,familia_id)
        VALUES(:tipo,:descripcion,:prioridad,:estado,:fecha,:familia_id)
    """), data.model_dump())
    db.commit()
    return {"id": result.lastrowid, **data.model_dump(mode="json")}


@app.get("/api/ayudas")
def ayudas(db: Session = Depends(get_db)):
    return fetch_all(db, """
        SELECT a.id,a.tipo,a.cantidad,a.unidad,a.beneficiario,a.fecha,a.estado,a.familia_id
        FROM ayudas a ORDER BY a.fecha DESC,a.id DESC
    """)


@app.post("/api/ayudas", status_code=201)
def crear_ayuda(data: AyudaIn, db: Session = Depends(get_db)):
    result = db.execute(text("""
        INSERT INTO ayudas(tipo,cantidad,unidad,beneficiario,fecha,estado,familia_id)
        VALUES(:tipo,:cantidad,:unidad,:beneficiario,:fecha,:estado,:familia_id)
    """), data.model_dump())
    db.commit()
    return {"id": result.lastrowid, **data.model_dump(mode="json")}


@app.get("/api/atenciones")
def atenciones(db: Session = Depends(get_db)):
    return fetch_all(db, """
        SELECT id,persona_familia,tipo,responsable,fecha,estado,familia_id,persona_id
        FROM atenciones ORDER BY fecha DESC,id DESC
    """)


@app.post("/api/atenciones", status_code=201)
def crear_atencion(data: AtencionIn, db: Session = Depends(get_db)):
    result = db.execute(text("""
        INSERT INTO atenciones(persona_familia,tipo,responsable,fecha,estado,familia_id,persona_id)
        VALUES(:persona_familia,:tipo,:responsable,:fecha,:estado,:familia_id,:persona_id)
    """), data.model_dump())
    db.commit()
    return {"id": result.lastrowid, **data.model_dump(mode="json")}


@app.get("/api/dashboard")
def dashboard(db: Session = Depends(get_db)):
    summary = db.execute(text("SELECT * FROM vw_dashboard")).mappings().first()
    return {
        "totales": dict(summary),
        "afectaciones_por_tipo": fetch_all(db, "SELECT tipo AS label, COUNT(*) AS value FROM afectaciones GROUP BY tipo ORDER BY value DESC"),
        "necesidades_por_prioridad": fetch_all(db, "SELECT prioridad AS label, COUNT(*) AS value FROM necesidades GROUP BY prioridad ORDER BY FIELD(prioridad,'Alta','Media','Baja')"),
        "afectaciones_por_municipio": fetch_all(db, "SELECT m.nombre AS label, COUNT(*) AS value FROM afectaciones a JOIN municipios m ON m.id=a.municipio_id GROUP BY m.id,m.nombre ORDER BY value DESC"),
        "ayudas_por_tipo": fetch_all(db, "SELECT tipo AS label, SUM(cantidad) AS value FROM ayudas WHERE estado='Entregada' GROUP BY tipo ORDER BY value DESC"),
    }


@app.get("/api/reportes/general")
def reporte_general(db: Session = Depends(get_db)):
    return {
        "personas": fetch_all(db, "SELECT COUNT(*) AS total FROM personas")[0]["total"],
        "familias": fetch_all(db, "SELECT COUNT(*) AS total FROM familias")[0]["total"],
        "afectaciones": fetch_all(db, "SELECT COUNT(*) AS total FROM afectaciones")[0]["total"],
        "necesidades": fetch_all(db, "SELECT COUNT(*) AS total FROM necesidades")[0]["total"],
        "ayudas_entregadas": fetch_all(db, "SELECT COUNT(*) AS total FROM ayudas WHERE estado='Entregada'")[0]["total"],
        "atenciones": fetch_all(db, "SELECT COUNT(*) AS total FROM atenciones")[0]["total"],
    }
