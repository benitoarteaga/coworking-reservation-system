-- Database: medical_appointments_db

-- DROP DATABASE IF EXISTS medical_appointments_db;

CREATE DATABASE medical_appointments_db
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE RESTRICT
);


INSERT INTO roles (name) VALUES ('admin'), ('cliente');

INSERT INTO users (username, email, password, role_id)
VALUES (
  'admin1',
  'admin1@demo.com',
  '$2y$10$peOe5Fidwi.1NSKOR/lUzuznCW0LjANkD615x6z./7xR0v4.bDVWy',
  (SELECT id FROM roles WHERE name = 'admin')
);


CREATE TABLE tipos_cita (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT
);


-- Insertar tipos de cita
INSERT INTO tipos_cita (nombre, descripcion) VALUES
('Consulta General', 'Atención médica general.'),
('Odontología', 'Revisión y tratamiento dental.'),
('Pediatría', 'Atención médica para niños.'),
('Ginecología', 'Consulta especializada para mujeres.'),
('Nutrición', 'Evaluación nutricional y dietética.');

-- Tabla de citas (estado 1 = pendiente, 0 = realizada)
CREATE TABLE citas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  tipo_cita_id INTEGER NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo TEXT,
  estado SMALLINT DEFAULT 1, -- 1: pendiente, 0: realizada
  FOREIGN KEY (usuario_id) REFERENCES users(id),
  FOREIGN KEY (tipo_cita_id) REFERENCES tipos_cita(id)
);


-- Insertar algunas citas de ejemplo (usuario con ID 1)
INSERT INTO citas (usuario_id, tipo_cita_id, fecha, hora, motivo, estado) VALUES
(1, 1, '2025-06-01', '09:00', 'Dolor de cabeza persistente', 1),
(1, 2, '2025-06-02', '11:00', 'Control dental', 1),
(1, 5, '2025-06-05', '08:30', 'Asesoría alimenticia', 0);

INSERT INTO users (username, email, password, role_id)
VALUES (
  'cliente_test',
  'cliente@demo.com',
  '$2y$10$peOe5Fidwi.1NSKOR/lUzuznCW0LjANkD615x6z./7xR0v4.bDVWy', -- Contraseña hash de '123456'
  (SELECT id FROM roles WHERE name = 'cliente')
);

INSERT INTO citas (usuario_id, tipo_cita_id, fecha, hora, motivo, estado)
VALUES (
  2,               -- ID real del usuario cliente_test
  3,               -- ID del tipo de cita (Pediatría)
  '2025-06-10',
  '14:00',
  'Chequeo pediátrico para mi hijo',
  1                -- Pendiente
);

CREATE TABLE persona (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  ci VARCHAR(20) UNIQUE NOT NULL,
  direccion VARCHAR(255),
  telefono VARCHAR(20) NOT NULL,
  telefono2 VARCHAR(20),
  estado SMALLINT NOT NULL DEFAULT 1, -- 1 activo, 0 inactivo
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ADD COLUMN persona_id INTEGER,
ADD CONSTRAINT fk_persona
  FOREIGN KEY (persona_id) REFERENCES persona(id);

INSERT INTO persona (nombre, apellido, ci, direccion, telefono, telefono2, estado)
VALUES
  ('Ana', 'Gonzalez', '12345678', 'Calle 1 #123', '63568888', '63568888', 1),
  ('Beatriz', 'Perez', '87654321', 'Av. Siempre Viva 742', '63568888', '63568888', 1),
  ('Carla', 'Ramirez', '23456789', 'Calle Falsa 123', '63568888', '63568888', 1),
  ('Diana', 'Lopez', '34567890', 'Av. Central 456', '63568888', '63568888', 1),
  ('Elena', 'Martinez', '45678901', 'Pasaje 9 #321', '63568888', '63568888', 1),
  ('Flor', 'Torres', '56789012', 'Calle Luna 555', '63568888', '63568888', 1),
  ('Gloria', 'Vargas', '67890123', 'Av. Sol 888', '63568888', '63568888', 1);

ALTER TABLE tipos_cita
ADD COLUMN imagen_url VARCHAR(255) DEFAULT NULL;