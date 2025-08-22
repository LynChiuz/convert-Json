# Overview

This is a Word-to-Text converter application that allows users to upload .docx files and extract their text content. The application features a modern web interface built with React and TypeScript, using shadcn/ui components for a polished user experience. Users can upload Word documents, view processing progress in real-time, and download the extracted text or copy it to their clipboard.

# User Preferences

Preferred communication style: Simple, everyday language.

# Recent Changes

## Question Extraction Logic (Latest Update)
- Updated question extraction to parse Vietnamese text pattern: "Đáp án đúng là:" instead of "Đáp án đúng:"
- Added reprocess API endpoint and UI button to re-extract questions with updated logic
- JSON format includes: question, answers[], correctAnswer, explain, reference fields
- Questions are parsed from structured Vietnamese quiz format with specific delimiters

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessibility and customization
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **File Handling**: Native HTML5 file upload with drag-and-drop support via custom upload zone component

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **File Processing**: Multer for multipart file uploads and Mammoth.js for Word document text extraction
- **API Design**: RESTful API with structured error handling and request logging middleware
- **Development Setup**: Vite integration for hot module replacement and unified development experience

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: PostgreSQL-based session storage using connect-pg-simple
- **Fallback Storage**: In-memory storage implementation for development/testing scenarios

## Database Schema
- **Users Table**: Basic user management with username/password authentication
- **Documents Table**: Comprehensive document tracking including:
  - File metadata (filename, original size)
  - Processing status (pending, processing, completed, failed)
  - Extracted content (text, word count, character count, page count)
  - Performance metrics (conversion time)
  - Timestamps (created, completed)

## Authentication & Authorization
- **Session-based Authentication**: Traditional server-side sessions stored in PostgreSQL
- **Password Security**: Basic password storage (implementation details in user schema)
- **Request Validation**: Zod schemas for type-safe API request/response validation

## File Processing Pipeline
- **Upload Validation**: File type restrictions (.docx only) and size limits (50MB)
- **Asynchronous Processing**: Background document processing to avoid blocking uploads
- **Progress Tracking**: Real-time status updates through polling mechanism
- **Text Extraction**: Mammoth.js library for reliable Word document parsing
- **Statistics Generation**: Automatic calculation of document metrics (word count, character count, page count)

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm & drizzle-kit**: Type-safe ORM and database toolkit
- **express**: Node.js web application framework
- **multer**: Multipart/form-data handling for file uploads
- **mammoth**: Word document (.docx) text extraction

## Frontend UI Dependencies
- **@radix-ui/***: Comprehensive set of low-level UI primitives for accessibility
- **@tanstack/react-query**: Powerful data synchronization for React applications
- **wouter**: Minimalist routing library for React
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Tool for creating type-safe component variants
- **clsx & tailwind-merge**: Utility libraries for conditional CSS classes

## Development & Build Tools
- **vite**: Fast build tool and development server
- **typescript**: Static type checking
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **esbuild**: Fast JavaScript bundler for production builds

## Validation & Utilities
- **zod**: TypeScript-first schema validation
- **date-fns**: Modern JavaScript date utility library
- **nanoid**: URL-safe unique string ID generator

The application uses a monorepo structure with shared TypeScript definitions between client and server, ensuring type safety across the full stack. The architecture emphasizes real-time user feedback, robust error handling, and a smooth file processing experience.