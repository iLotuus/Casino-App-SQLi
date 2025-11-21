-- Schema for Casino Application
-- Created based on existing SQLite structure

CREATE DATABASE IF NOT EXISTS casino_db;
USE casino_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 1000.00,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- Note: In a real app, use a hashed password. Here we will insert it via the app or use a pre-calculated hash.
-- For this example, we'll rely on the app registration or manual insertion. 
-- Let's insert a raw one for now, assuming the app uses bcrypt. 
-- Hash for 'admin123' is roughly '$2a$10$...' 
-- We will handle the admin creation via a script or just let the user register and then manually promote them.
-- Better yet, let's just add the column definition.

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'deposit', 'withdraw', 'win', 'loss'
    amount DECIMAL(10, 2) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
