#!/bin/bash

echo "Installing PM2 globally..."
sudo npm install -g pm2

echo "Starting Casino Backend with PM2..."
pm2 start server.cjs --name "casino-backend"

echo "Saving PM2 process list..."
pm2 save

echo "Setting up PM2 startup hook..."
pm2 startup | bash

echo "========================================"
echo "Backend is now running in the background!"
echo "Useful commands:"
echo "  pm2 status        - Check status"
echo "  pm2 logs          - View logs"
echo "  pm2 restart all   - Restart app"
echo "  pm2 stop all      - Stop app"
echo "========================================"
