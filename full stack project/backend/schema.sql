-- MySQL bootstrap for NexusCare
-- Run in MySQL CLI: SOURCE backend/schema.sql;

CREATE DATABASE IF NOT EXISTS nexuscare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nexuscare;

-- Optional: create dedicated DB user (adjust password as needed)
-- CREATE USER IF NOT EXISTS 'nexuscare'@'localhost' IDENTIFIED BY 'nexuscare';
-- GRANT ALL PRIVILEGES ON nexuscare.* TO 'nexuscare'@'localhost';
-- FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin','resident','security','medical') NOT NULL DEFAULT 'resident',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('open','in_progress','resolved','deleted') NOT NULL DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    CONSTRAINT fk_complaints_user FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    actor_id INT NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    details TEXT,
    CONSTRAINT fk_audit_actor FOREIGN KEY (actor_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;
