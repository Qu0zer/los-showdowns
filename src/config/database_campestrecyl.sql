-- Crear la base de datos (si no existe)
CREATE DATABASE IF NOT EXISTS campestrecyl_campings;
USE campestrecyl_campings;

-- ================================
-- Tabla Usuarios
-- ================================
CREATE TABLE Usuarios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre_usuario VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (email)
) ENGINE=InnoDB;

-- ================================
-- Tabla Campings
-- ================================
CREATE TABLE Campings (
    n_registro VARCHAR(255) NOT NULL,
    nombre_camping VARCHAR(50) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    municipio VARCHAR(50) NOT NULL,
    localidad VARCHAR(50) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    web VARCHAR(255),
    plazas INT,
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 9),
    PRIMARY KEY (n_registro)
) ENGINE=InnoDB;

-- ================================
-- Tabla Favoritos (Relación N:M entre Usuarios y Campings)
-- ================================
CREATE TABLE Favoritos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    id_usuario INT(11) NOT NULL,
    id_camping VARCHAR(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_camping) REFERENCES Campings(n_registro) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ================================
-- Tabla Imagenes
-- ================================
CREATE TABLE Imagenes (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre_fichero VARCHAR(255) NOT NULL,
    titulo VARCHAR(50),
    PRIMARY KEY (id)
) ENGINE=InnoDB;