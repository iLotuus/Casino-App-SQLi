#!/bin/bash

# Script to setup MySQL database for Casino App on Ubuntu

DB_NAME="casino_db"
DB_USER="casino_user"
DB_PASS="casino_password_secure" # Change this in production

echo "Updating package list..."
sudo apt-get update

echo "Installing MySQL Server..."
sudo apt-get install -y mysql-server

echo "Starting MySQL Service..."
sudo systemctl start mysql
sudo systemctl enable mysql

echo "Creating Database and User..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS ${DB_NAME};"
sudo mysql -e "CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';"
sudo mysql -e "GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

echo "Importing Schema..."
# Assumes schema.sql is in the same directory or provide full path
sudo mysql ${DB_NAME} < schema.sql

echo "Database setup complete!"
echo "Database: ${DB_NAME}"
echo "User: ${DB_USER}"
echo "Password: ${DB_PASS}"
