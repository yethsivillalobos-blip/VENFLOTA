CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cedula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('admin', 'supervisor', 'chofer', 'sha')),
    pin_hash VARCHAR(255) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehiculos (
    placa VARCHAR(15) PRIMARY KEY,
    modelo VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    rendimiento_esperado DECIMAL(5,2),
    estado VARCHAR(20) DEFAULT 'operativo'
);

CREATE TABLE guardias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chofer_id VARCHAR(50), 
    vehiculo_placa VARCHAR(15),
    turno VARCHAR(20) NOT NULL,
    km_inicial INTEGER NOT NULL,
    litros_combustible INTEGER NOT NULL,
    estado VARCHAR(20) DEFAULT 'en_curso',
    ruta_asignada VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gps_logs (
    id BIGSERIAL PRIMARY KEY,
    guardia_id UUID REFERENCES guardias(id) ON DELETE CASCADE,
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    velocidad INTEGER NOT NULL,
    timestamp_log TIMESTAMP NOT NULL,
    registrado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
