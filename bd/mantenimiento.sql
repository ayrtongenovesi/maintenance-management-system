CREATE DATABASE IF NOT EXISTS mantenimiento;
USE mantenimiento;

CREATE TABLE IF NOT EXISTS activo (
  id INT NOT NULL,
  Nombre VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS tareas (
  id INT NOT NULL,
  Descripcion TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS edificio (
  id INT NOT NULL,
  Nombre VARCHAR(100) NOT NULL,
  Direccion VARCHAR(150) NOT NULL DEFAULT '',
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS piso_nivel (
  id INT NOT NULL,
  Nombre VARCHAR(50) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS ubicacion (
  id INT NOT NULL,
  Nombre VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sector (
  id INT NOT NULL,
  Sector VARCHAR(100) NOT NULL,
  IdEdificio INT NOT NULL,
  IdPiso INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (IdEdificio) REFERENCES edificio(id),
  FOREIGN KEY (IdPiso) REFERENCES piso_nivel(id)
);

CREATE TABLE IF NOT EXISTS usuario (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  mail VARCHAR(120) NOT NULL UNIQUE,
  contraseña VARCHAR(120) NOT NULL,
  rol ENUM('administrador','operario') NOT NULL DEFAULT 'operario',
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS activo_tareas (
  id INT NOT NULL,
  IDAct INT NOT NULL,
  Idtarea INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (IDAct) REFERENCES activo(id),
  FOREIGN KEY (Idtarea) REFERENCES tareas(id)
);

CREATE TABLE IF NOT EXISTS orden_trabajo (
  id INT NOT NULL AUTO_INCREMENT,
  edificio_id INT NOT NULL,
  sector_id INT NOT NULL,
  piso_id INT NOT NULL,
  ubicacion_id INT NOT NULL,
  activo_id INT NOT NULL,
  usuario_id INT NOT NULL,
  fecha DATE NOT NULL,
  estado VARCHAR(30) NOT NULL DEFAULT 'Pendiente',
  PRIMARY KEY (id),
  FOREIGN KEY (edificio_id) REFERENCES edificio(id),
  FOREIGN KEY (sector_id) REFERENCES sector(id),
  FOREIGN KEY (piso_id) REFERENCES piso_nivel(id),
  FOREIGN KEY (ubicacion_id) REFERENCES ubicacion(id),
  FOREIGN KEY (activo_id) REFERENCES activo(id),
  FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS orden_trabajo_tarea (
  id INT NOT NULL AUTO_INCREMENT,
  orden_trabajo_id INT NOT NULL,
  tarea_id INT NOT NULL,
  completada TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  FOREIGN KEY (orden_trabajo_id) REFERENCES orden_trabajo(id) ON DELETE CASCADE,
  FOREIGN KEY (tarea_id) REFERENCES tareas(id)
);

INSERT INTO usuario (nombre, mail, contraseña, rol) VALUES
  ('admin', 'admin@gmail.com', '$2b$10$dfSVDVM635eBUlQgfcqFUOmjGQesUHONOITPt2Lt2DUioAtdDkJYW', 'administrador');

INSERT INTO activo (id, Nombre) VALUES
  (1, 'Aire Acondicionado'),
  (2, 'Ascensor'),
  (3, 'Barandas y Escaleras'),
  (4, 'Iluminacion'),
  (5, 'Matafuego'),
  (6, 'Puerta'),
  (7, 'Tablero Electrico'),
  (8, 'Ventanas & Cortinas'),
  (9, 'Ventilador');

INSERT INTO tareas (id, Descripcion) VALUES
  (1, 'Al finalizar la actividad deje el area limpia, ordenada y segura'),
  (2, 'Limpieza de luminaria y lamparas'),
  (3, 'Realizar limpieza del equipo'),
  (4, 'Realice verificacion de correcto funcionamiento'),
  (5, 'Relevar marca'),
  (6, 'Relevar modelo'),
  (7, 'Relevar potencia'),
  (8, 'Tomar fotografia'),
  (9, 'Verificar correcto ajuste de conexiones electricas'),
  (10, 'Verificar correcto estado de cableado electrico'),
  (11, 'Verificar correcto funcionamiento de puertas y cerraduras'),
  (12, 'Verificar estado de carga (manometro de presion y fecha de vencimiento)'),
  (13, 'Verificar estado general'),
  (14, 'Verificacion de funcionamiento de la totalidad de las lamparas'),
  (15, 'Verifique correcta y firme fijacion a pared o estructura'),
  (16, 'Verifique y lubrique bisagras y/o correderas'),
  (17, 'Verifique y lubrique cerraduras');

INSERT INTO edificio (id, Nombre, Direccion) VALUES
  (1, 'UTN FRVT', 'Laprida 651'),
  (2, 'FAGDUT VT', 'Laprida 648'),
  (3, 'ATEVEN', 'Laprida 652');

INSERT INTO piso_nivel (id, Nombre) VALUES
  (1, 'Planta Baja'),
  (2, '1er. Piso'),
  (3, '2do. Piso'),
  (4, '3er. Piso'),
  (5, '4to. Piso');

INSERT INTO ubicacion (id, Nombre) VALUES
  (1, 'Interior'),
  (2, 'Exterior Bajo Techo'),
  (3, 'Exterior Sin Techo');

INSERT INTO sector (id, Sector, IdEdificio, IdPiso) VALUES
  (1, 'Aula 1', 1, 2),
  (2, 'Aula 2', 1, 2),
  (3, 'Biblioteca', 1, 1),
  (4, 'Cantina', 1, 1),
  (5, 'Escalera Principal', 1, 1),
  (6, 'Hall de Entrada', 1, 1),
  (7, 'Laboratorio de Informatica', 1, 2),
  (8, 'Pasillo A', 1, 2),
  (9, 'Pasillo B', 1, 3),
  (10, 'SUM', 1, 3),
  (11, 'Aula 3', 1, 3),
  (12, 'Aula 4', 1, 3),
  (13, 'Aula 5', 1, 4),
  (14, 'Aula 6', 1, 4),
  (15, 'Laboratorio de Fisica', 1, 4),
  (16, 'Aula 7', 1, 5),
  (17, 'Aula 8', 1, 5),
  (18, 'Sala de Profesores', 1, 5);

INSERT INTO activo_tareas (id, IDAct, Idtarea) VALUES
  (1,1,3),(2,1,4),(3,1,5),(4,1,6),(5,1,7),(6,1,8),(7,1,10),(8,1,13),(9,1,15),(10,1,1),
  (11,2,4),(12,2,5),(13,2,6),(14,2,8),(15,2,13),(16,2,1),
  (17,3,8),(18,3,13),(19,3,15),(20,3,1),
  (21,4,2),(22,4,4),(23,4,5),(24,4,6),(25,4,7),(26,4,8),(27,4,9),(28,4,14),(29,4,15),(30,4,1),
  (31,5,8),(32,5,12),(33,5,13),(34,5,15),(35,5,1),
  (36,6,8),(37,6,11),(38,6,13),(39,6,16),(40,6,17),(41,6,1),
  (42,7,8),(43,7,9),(44,7,10),(45,7,13),(46,7,15),(47,7,1),
  (48,8,8),(49,8,13),(50,8,16),(51,8,17),(52,8,1),
  (53,9,3),(54,9,4),(55,9,5),(56,9,6),(57,9,7),(58,9,8),(59,9,10),(60,9,15),(61,9,1);
