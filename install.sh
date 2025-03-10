#!/bin/bash

echo "🚀 Starting ProcAI Installation..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js version 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d "v" -f 2 | cut -d "." -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Check if MongoDB is installed
echo "🔍 Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB and ensure it's running."
    echo "📝 Installation guides:"
    echo "   Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/"
    echo "   macOS: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/"
    echo "   Linux: https://docs.mongodb.com/manual/administration/install-on-linux/"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create necessary directories
echo "📁 Creating required directories..."
mkdir -p backend/uploads

# Set up environment variables
echo "🔧 Setting up environment variables..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "⚙️ Please update backend/.env with your configuration"
fi

# Create MongoDB indexes
echo "📊 Setting up database..."
cd backend
node -e "
const mongoose = require('mongoose');
const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/procai')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
"
cd ..

echo "
✅ Installation complete!

To start the application:

1. Update the environment variables in backend/.env
2. Start the backend server:
   cd backend && npm run dev

3. In a new terminal, start the frontend:
   npm run dev

4. Open http://localhost:3000 in your browser

For more information, check the README.md file.
"
