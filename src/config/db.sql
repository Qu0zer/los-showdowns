-- Crear la base de datos (opcional)
CREATE DATABASE IF NOT EXISTS gestion_campings;
USE gestion_campings;

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
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre_camping VARCHAR(50) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    provincia VARCHAR(50) NOT NULL,
    municipio VARCHAR(50) NOT NULL,
    localidad VARCHAR(50) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    web VARCHAR(255),
    plazas INT,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ================================
-- Tabla Favoritos (Relación N:M entre Usuarios y Campings)
-- ================================
CREATE TABLE Favoritos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    id_usuario INT(11) NOT NULL,
    id_camping INT(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_camping) REFERENCES Campings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ================================
-- Tabla Posicion (Relación 1:1 con Campings)
-- ================================
CREATE TABLE Posicion (
    id INT(11) NOT NULL AUTO_INCREMENT,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 9) NOT NULL,
    id_campings INT(11) NOT NULL UNIQUE,
    PRIMARY KEY (id),
    FOREIGN KEY (id_campings) REFERENCES Campings(id) ON DELETE CASCADE
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