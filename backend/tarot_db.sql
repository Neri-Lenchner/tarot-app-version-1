CREATE DATABASE IF NOT EXISTS tarot_app;
USE tarot_app;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    gender VARCHAR(10) NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    daily_question_count INT NOT NULL DEFAULT 0,
    daily_question_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL DEFAULT 0,
    spread_type VARCHAR(20) NOT NULL,
    question TEXT,
    question_he TEXT,
    cards JSON NOT NULL,
    interpretation_en TEXT,
    interpretation_he TEXT,
    followup_question TEXT,
    followup_answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Single-row settings table (id is always 1) — see maintenance.service.ts.
CREATE TABLE IF NOT EXISTS app_settings (
    id INT PRIMARY KEY DEFAULT 1,
    maintenanceMode BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT IGNORE INTO app_settings (id, maintenanceMode) VALUES (1, FALSE);
