CREATE DATABASE IF NOT EXISTS tarot_app;
USE tarot_app;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spread_type VARCHAR(20) NOT NULL,
    question TEXT,
    cards JSON NOT NULL,
    interpretation_en TEXT,
    interpretation_he TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
