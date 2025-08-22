# Deployment Guide

## Windows Deployment

### 1. Using Windows Script
```cmd
# Run the setup script
setup.bat

# Manual steps if script fails:
npm install
copy .env.example .env
# Edit .env with your database settings
npm run db:push
npm run dev:windows
```

### 2. Manual Windows Setup
```cmd
# Install Node.js 18+ from https://nodejs.org/
# Open Command Prompt or PowerShell as Administrator

# Navigate to project directory
cd path\to\word-to-text-converter

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your database configuration
notepad .env

# Setup database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

## Linux/macOS Deployment

### 1. Using Shell Script
```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh

# Manual steps if script fails:
npm install
cp .env.example .env
# Edit .env with your database settings
npm run db:push
npm run dev:unix
```

### 2. Manual Linux/macOS Setup
```bash
# Install Node.js 18+ (using nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Navigate to project directory
cd /path/to/word-to-text-converter

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database configuration
nano .env

# Setup database
npm run db:generate
npm run db:push

# Start development server
npm run dev
```

## Docker Deployment (Cross-Platform)

### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]
```

### 2. Create docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/word_converter
    depends_on:
      - db
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=word_converter
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 3. Run with Docker
```bash
# Build and start
docker-compose up --build

# Run in background
docker-compose up -d
```

## Production Deployment

### 1. Build for Production
```bash
npm run build
```

### 2. Environment Configuration
```env
NODE_ENV=production
DATABASE_URL=your_production_database_url
PORT=5000
```

### 3. Process Manager (PM2)
```bash
# Install PM2 globally
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start dist/index.js --name "word-converter"

# Save PM2 configuration
pm2 save
pm2 startup
```

## Database Configuration

### Local PostgreSQL
```env
DATABASE_URL="postgresql://username:password@localhost:5432/word_converter"
```

### Neon Database (Recommended)
```env
DATABASE_URL="postgresql://username:password@ep-example.us-east-1.aws.neon.tech/word_converter?sslmode=require"
```

### Railway
```env
DATABASE_URL="postgresql://postgres:password@containers-us-west-x.railway.app:5432/railway"
```

## Troubleshooting

### Windows Common Issues
1. **Node.js not found**: Install from https://nodejs.org/
2. **Permission denied**: Run as Administrator
3. **Port 5000 taken**: Kill process using `netstat -ano | findstr :5000`

### Linux Common Issues
1. **Permission denied**: Use `sudo` or fix npm permissions
2. **Node.js version**: Use nvm to manage Node.js versions
3. **Database connection**: Check PostgreSQL service status

### General Issues
1. **Dependencies fail**: Clear cache and reinstall
2. **Database errors**: Check connection string and database exists
3. **Build errors**: Ensure all environment variables are set

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host:5432/db |
| NODE_ENV | Application environment | development/production |
| PORT | Server port | 5000 |