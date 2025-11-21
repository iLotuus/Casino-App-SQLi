#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "==========================================="
echo "   Casino App Auto-Installer for Ubuntu"
echo "==========================================="

# 1. Update System Packages
echo ""
echo "[1/6] Updating system packages..."
sudo apt-get update -y
sudo apt-get install -y curl git build-essential

# 2. Install Node.js (v20 LTS)
echo ""
echo "[2/6] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "Installing Node.js v20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed: $(node -v)"
fi

# 3. Install MySQL Server
echo ""
echo "[3/6] Checking MySQL installation..."
if ! command -v mysql &> /dev/null; then
    echo "Installing MySQL Server..."
    sudo apt-get install -y mysql-server
    sudo systemctl start mysql
    sudo systemctl enable mysql
else
    echo "MySQL is already installed."
fi

# 4. Install Project Dependencies
echo ""
echo "[4/6] Installing project dependencies (npm install)..."
if [ -f "package.json" ]; then
    npm install
else
    echo "Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# 5. Setup Database
echo ""
echo "[5/6] Setting up MySQL Database..."
if [ -f "database/setup_db.sh" ] && [ -f "database/schema.sql" ]; then
    echo "Running database setup script..."
    chmod +x database/setup_db.sh
    
    # Navigate to database directory to ensure relative paths in setup_db.sh work (e.g. schema.sql)
    cd database
    ./setup_db.sh
    cd ..
else
    echo "Error: database/setup_db.sh or database/schema.sql not found."
    echo "Skipping database setup. Please check your files."
fi

# 6. Build Frontend
echo ""
echo "[6/6] Building Frontend for production..."
npm run build

echo ""
echo "==========================================="
echo "      Installation Complete! Success!"
echo "==========================================="
echo ""
echo "Next Steps:"
echo "1. Start the Backend Server:"
echo "   node server.cjs"
echo ""
echo "2. Serve the Frontend:"
echo "   npm run preview"
echo "   (Or configure Nginx/Apache to serve the 'dist' folder)"
echo ""
echo "3. Admin Panel Access:"
echo "   The database has been set up."
echo "   To promote a user to admin, run: ./make_admin_mysql.sh <username>"
echo ""
