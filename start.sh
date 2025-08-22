#!/bin/bash

echo "Starting Word-to-Text Converter on Linux/macOS..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please run setup.sh first or install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Dependencies not installed. Installing now..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

echo "Starting development server..."
echo
echo "Application will be available at: http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo

export NODE_ENV=development
tsx server/index.ts