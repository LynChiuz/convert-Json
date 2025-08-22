#!/bin/bash

echo "Setting up Word-to-Text Converter on Linux/macOS..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "Node.js is installed"
node --version

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm is not installed"
    echo "Please install npm or use the Node.js installer from https://nodejs.org/"
    exit 1
fi

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

echo ""
echo "Setup completed successfully!"
echo ""
echo "This application uses in-memory storage - no database required!"
echo "Next steps:"
echo "1. Run: ./start.sh"
echo "2. Or run: npm run dev"
echo ""