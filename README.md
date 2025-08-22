# Word-to-Text Converter

A React and Express.js web application for efficient Word document processing and text extraction with Vietnamese question parsing capabilities.

## Features

- Upload and convert .docx files to text
- Extract structured questions in JSON format
- Support for Vietnamese quiz format parsing
- Real-time processing status
- Download extracted text and JSON
- Modern responsive UI

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **File Processing**: Mammoth.js for Word document parsing

## Prerequisites

- Node.js 18+ (recommend using Node.js 20)
- PostgreSQL database
- npm or yarn package manager

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd word-to-text-converter
```

### 2. Install dependencies
```bash
npm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a database for the project
3. Set the `DATABASE_URL` environment variable

#### Option B: Neon Database (Recommended)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new database
3. Copy the connection string

### 4. Environment Variables
Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
NODE_ENV=development
```

### 5. Database Migration
```bash
npm run db:generate
npm run db:push
```

### 6. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Cross-Platform Scripts

### Windows (PowerShell/CMD)
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Database operations
npm run db:generate
npm run db:push
```

### Linux/macOS (Bash)
```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Database operations
npm run db:generate
npm run db:push
```

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Database layer
├── shared/                 # Shared types/schemas
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server (frontend + backend)
- `npm run build` - Build for production
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Apply database changes
- `npm run db:studio` - Open database studio (if available)

## API Endpoints

- `POST /api/upload` - Upload Word document
- `GET /api/documents` - List all documents
- `GET /api/documents/:id` - Get document details
- `GET /api/documents/:id/download` - Download extracted text
- `GET /api/documents/:id/download-json` - Download JSON questions
- `GET /api/documents/:id/questions` - Get extracted questions
- `POST /api/documents/:id/reprocess` - Reprocess with updated logic

## Question Extraction Format

The application parses Vietnamese quiz format with these patterns:
- Question: Text after "Đoạn văn câu hỏi" and before "Select one"
- Answers: a., b., c., d. options
- Correct Answer: Text after "Đáp án đúng là:" and before "Vì:"
- Explanation: Text after "Vì:" and before "Tham khảo"
- Reference: Text after "Tham khảo:" and before next question

## Troubleshooting

### Windows Issues
1. **Permission errors**: Run terminal as Administrator
2. **Path issues**: Use forward slashes in paths or escape backslashes
3. **Node.js version**: Ensure Node.js 18+ is installed

### Linux Issues
1. **Permission errors**: Use `sudo` if needed for global installations
2. **Port conflicts**: Change port in environment variables if 5000 is taken
3. **Database connection**: Ensure PostgreSQL service is running

### Common Issues
1. **Database connection failed**: Check DATABASE_URL in .env file
2. **Port already in use**: Change port or kill existing process
3. **Build failures**: Clear node_modules and npm cache, reinstall dependencies

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.