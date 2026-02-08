#!/bin/bash

# Lewis Portfolio Website - Development Setup Script
echo "🚀 Setting up Lewis Portfolio Website development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if MongoDB is running (optional for development with Atlas)
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB detected"
else
    echo "⚠️  MongoDB not detected locally. Make sure to configure MongoDB Atlas URI in backend/.env"
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Create backend .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration before starting the servers"
else
    echo "✅ Backend .env file already exists"
fi

cd ..

# Create frontend .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating frontend .env.local file..."
    cat > .env.local << EOL
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOL
    echo "✅ Frontend .env.local file created"
else
    echo "✅ Frontend .env.local file already exists"
fi

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your MongoDB URI and email configuration"
echo "2. Start the backend server: cd backend && npm run dev"
echo "3. Start the frontend server: npm run dev"
echo "4. Visit http://localhost:3000 to see your portfolio"
echo ""
echo "🧪 To run tests:"
echo "- Frontend tests: npm test"
echo "- Backend tests: cd backend && npm test"
echo ""
echo "📚 For more information, see README.md"