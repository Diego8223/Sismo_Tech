CREATE DATABASE IF NOT EXISTS sismo_tech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sismo_tech;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS atenciones;
DROP TABLE IF EXISTS ayudas;
DROP TABLE IF EXISTS necesidades;
DROP TABLE IF EXISTS afectaciones;
DROP TABLE IF EXISTS personas;
DROP TABLE IF EXISTS familias;
DROP TABLE IF EXISTS eventos_sismicos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS municipios;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE municipios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    departamento VARCHAR(100) NOT NULL DEFAULT 'Bolívar',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    password_hash CHAR(64) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'Gestor',
    estado ENUM('Activo','Inactivo') NOT NULL DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE familias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    jefe_hogar_id INT NULL,
    municipio_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_familia_municipio FOREIGN KEY (municipio_id) REFERENCES municipios(id)
) ENGINE=InnoDB;

CREATE TABLE personas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    documento VARCHAR(30) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    familia_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_persona_familia FOREIGN KEY (familia_id) REFERENCES familias(id) ON DELETE SET NULL
) ENGINE=InnoDB;

ALTER TABLE familias ADD CONSTRAINT fk_familia_jefe FOREIGN KEY (jefe_hogar_id) REFERENCES personas(id) ON DELETE SET NULL;

CREATE TABLE eventos_sismicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    magnitud DECIMAL(3,1) NOT NULL,
    municipio_id INT NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evento_municipio FOREIGN KEY (municipio_id) REFERENCES municipios(id),
    CONSTRAINT chk_magnitud CHECK (magnitud >= 0 AND magnitud <= 10)
) ENGINE=InnoDB;

CREATE TABLE afectaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(60) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    gravedad ENUM('Alta','Media','Baja') NOT NULL,
    municipio_id INT NOT NULL,
    fecha DATE NOT NULL,
    evento_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_afectacion_municipio FOREIGN KEY (municipio_id) REFERENCES municipios(id),
    CONSTRAINT fk_afectacion_evento FOREIGN KEY (evento_id) REFERENCES eventos_sismicos(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE necesidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(60) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    prioridad ENUM('Alta','Media','Baja') NOT NULL,
    estado ENUM('Pendiente','En proceso','Atendida') NOT NULL DEFAULT 'Pendiente',
    fecha DATE NOT NULL,
    familia_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_necesidad_familia FOREIGN KEY (familia_id) REFERENCES familias(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE ayudas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(80) NOT NULL,
    cantidad INT NOT NULL,
    unidad VARCHAR(40) NOT NULL DEFAULT 'unidades',
    beneficiario VARCHAR(150) NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('Entregada','Pendiente','Cancelada') NOT NULL DEFAULT 'Entregada',
    familia_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ayuda_familia FOREIGN KEY (familia_id) REFERENCES familias(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE atenciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    persona_familia VARCHAR(150) NOT NULL,
    tipo VARCHAR(80) NOT NULL,
    responsable VARCHAR(120) NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('Atendida','En proceso','Pendiente') NOT NULL DEFAULT 'Pendiente',
    familia_id INT NULL,
    persona_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_atencion_familia FOREIGN KEY (familia_id) REFERENCES familias(id) ON DELETE SET NULL,
    CONSTRAINT fk_atencion_persona FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO municipios (nombre, departamento) VALUES
('San Jacinto','Bolívar'),
('El Carmen de Bolívar','Bolívar'),
('Zambrano','Bolívar'),
('San Juan Nepomuceno','Bolívar');

-- SHA-256 de 123456 para usuarios de demostración
INSERT INTO usuarios (nombre, correo, password_hash, rol, estado) VALUES
('Administrador','admin@sismotech.com',SHA2('123456',256),'Administrador','Activo'),
('Miledys','miledys@sismotech.com',SHA2('123456',256),'Gestor','Activo'),
('Daniela','daniela@sismotech.com',SHA2('123456',256),'Gestor','Activo'),
('Diego','diego@sismotech.com',SHA2('123456',256),'Gestor','Activo');

INSERT INTO familias (nombre, jefe_hogar_id, municipio_id) VALUES
('Familia Pérez',NULL,1),
('Familia Gómez',NULL,2),
('Familia Martínez',NULL,3),
('Familia Díaz',NULL,1);

INSERT INTO personas (nombre, documento, fecha_nacimiento, familia_id) VALUES
('María José Pérez','1045678901','1965-05-12',1),
('Juan Carlos Gómez','1045678902','1990-08-23',2),
('Ana Sofía Martínez','1045678903','2010-11-05',3),
('Luis Fernando Díaz','1045678904','1975-02-17',4),
('Carmen Elisa Ruiz','1045678905','1982-09-30',1),
('Pedro Pablo Torres','1045678906','2008-06-14',3);

UPDATE familias SET jefe_hogar_id = 1 WHERE id = 1;
UPDATE familias SET jefe_hogar_id = 2 WHERE id = 2;
UPDATE familias SET jefe_hogar_id = 3 WHERE id = 3;
UPDATE familias SET jefe_hogar_id = 4 WHERE id = 4;

INSERT INTO eventos_sismicos (fecha, magnitud, municipio_id, descripcion) VALUES
('2026-08-15 10:24:00',6.2,1,'Movimiento sísmico registrado'),
('2026-08-10 14:15:00',5.1,2,'Evento reportado'),
('2026-08-02 08:45:00',4.7,3,'Evento reportado');

INSERT INTO afectaciones (tipo, descripcion, gravedad, municipio_id, fecha, evento_id) VALUES
('Vivienda','Daño parcial en paredes','Alta',1,'2026-08-15',1),
('Infraestructura','Grietas en vía principal','Media',2,'2026-08-15',1),
('Vivienda','Techo colapsado','Alta',3,'2026-08-15',1),
('Servicios públicos','Daño en red de agua','Media',4,'2026-08-15',1),
('Vivienda','Vidrios rotos','Baja',1,'2026-08-15',1),
('Infraestructura','Puente con daño leve','Media',2,'2026-08-15',1);

INSERT INTO necesidades (tipo, descripcion, prioridad, estado, fecha, familia_id) VALUES
('Alimentos','Alimentos no perecederos','Alta','Pendiente','2026-08-15',1),
('Agua','Agua potable','Alta','Pendiente','2026-08-15',2),
('Aseo','Kit de aseo personal','Media','En proceso','2026-08-16',3),
('Salud','Medicamentos básicos','Alta','Pendiente','2026-08-16',4),
('Albergue','Carpas para 10 familias','Media','En proceso','2026-08-16',1),
('Ropa','Ropa para adultos y niños','Baja','Atendida','2026-08-17',2);

INSERT INTO ayudas (tipo,cantidad,unidad,beneficiario,fecha,estado,familia_id) VALUES
('Alimentos',20,'kits','Familia Pérez','2026-08-15','Entregada',1),
('Kit de aseo',10,'kits','Familia Gómez','2026-08-16','Entregada',2),
('Albergue',4,'carpas','Familia Martínez','2026-08-17','Entregada',3);

INSERT INTO atenciones (persona_familia,tipo,responsable,fecha,estado,familia_id) VALUES
('Familia Pérez','Atención social','Miledys','2026-08-15','Atendida',1),
('Familia Gómez','Salud','Daniela','2026-08-16','En proceso',2),
('Familia Martínez','Orientación','Diego','2026-08-17','Atendida',3);

CREATE OR REPLACE VIEW vw_dashboard AS
SELECT
    (SELECT COUNT(*) FROM personas) AS personas,
    (SELECT COUNT(*) FROM familias) AS familias,
    (SELECT COUNT(*) FROM afectaciones) AS afectaciones,
    (SELECT COUNT(*) FROM ayudas WHERE estado = 'Entregada') AS ayudas_entregadas;

-- Consultas útiles para verificar que todo quedó funcionando
SELECT * FROM vw_dashboard;
SELECT tipo, COUNT(*) AS total FROM afectaciones GROUP BY tipo ORDER BY total DESC;
SELECT prioridad, COUNT(*) AS total FROM necesidades GROUP BY prioridad ORDER BY total DESC;
