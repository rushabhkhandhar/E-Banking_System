#!/bin/bash

# E-Banking System Setup Script
echo "🏦 Setting up E-Banking System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Create .env file from example
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file from example. Please update with your configurations."
fi

# Go back to root and install frontend dependencies
cd ../frontend
echo "📦 Installing frontend dependencies..."
npm install
echo "✅ Frontend dependencies installed"

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your MongoDB URI and JWT secret"
echo "2. Make sure MongoDB is running"
echo "3. Start the backend: cd backend && npm run dev"
echo "4. Start the frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Frontend will run on: http://localhost:5173"
echo "🚀 Backend will run on: http://localhost:5000"
