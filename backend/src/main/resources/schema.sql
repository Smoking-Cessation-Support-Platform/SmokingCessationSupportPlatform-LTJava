-- Drop tables in correct order (children first)
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS smoking_data;
DROP TABLE IF EXISTS consult_questions;
DROP TABLE IF EXISTS duoc_pham;
DROP TABLE IF EXISTS quit_plans;
-- Temporarily drop foreign key constraint before dropping tables
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS commitments;
DROP TABLE IF EXISTS coaches;
DROP TABLE IF EXISTS user_badges;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Create tables
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    gender VARCHAR(10),
    active BOOLEAN DEFAULT FALSE,
    days_without_smoking INT DEFAULT 0,
    quit_start_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    subscription VARCHAR(255) NOT NULL DEFAULT 'paid',
    role VARCHAR(50) DEFAULT 'user',
    CONSTRAINT email_unique UNIQUE (email)
);

CREATE TABLE quit_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    step_number INT NOT NULL,
    step_description VARCHAR(255) NOT NULL,
    personal_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_step (user_id, step_number)
);

CREATE TABLE commitments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    commitment_text TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

CREATE TABLE coaches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    specialization VARCHAR(100),
    experience TEXT,
    active BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE consult_questions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'unanswered',
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    answer TEXT,
    user_id BIGINT,
    coach_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (coach_id) REFERENCES coaches(id)
);

CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DOUBLE NOT NULL,
    payment_type ENUM('USER_SUBSCRIPTION', 'COACH_REGISTRATION') NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'EXPIRED') NOT NULL DEFAULT 'PENDING',
    order_code VARCHAR(255) UNIQUE,
    payment_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    user_id BIGINT,
    coach_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (coach_id) REFERENCES coaches(id)
);

CREATE TABLE smoking_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    date DATE NOT NULL,
    score INT DEFAULT 0,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_score_range CHECK (score >= 0 AND score <= 10),
    CONSTRAINT chk_status CHECK (status IN ('active', 'inactive', 'deleted')),
    UNIQUE KEY unique_user_date (user_id, date, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better query performance
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_coach_id ON payments(coach_id);
CREATE INDEX idx_payments_order_code ON payments(order_code);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- Add index for smoking_data
CREATE INDEX idx_smoking_data_user ON smoking_data(user_id);
CREATE INDEX idx_smoking_data_date ON smoking_data(date);
CREATE INDEX idx_smoking_data_status ON smoking_data(status);
