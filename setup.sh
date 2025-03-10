#!/bin/bash

echo "Setting up ProcAI Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js version 18 or higher."
    exit 1
fi

# Check if MongoDB is installed and running
echo "Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Please install MongoDB and ensure it's running."
    exit 1
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install

# Create necessary directories
echo "Creating required directories..."
mkdir -p uploads

# Set up environment variables
echo "Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Please update the .env file with your OpenAI API key and other configurations."
fi

# Run database seed
echo "Would you like to seed the database with sample data? (y/n)"
read -r response
if [ "$response" = "y" ]; then
    npm run seed
fi

echo "Setup complete! You can now start the application:"
echo "1. Start the backend: cd backend && npm run dev"
echo "2. Start the frontend: npm run dev (in the root directory)"
