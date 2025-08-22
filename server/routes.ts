import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import mammoth from "mammoth";
import { storage } from "./storage";
import { insertDocumentSchema, updateDocumentSchema, type Question } from "@shared/schema";
import { z } from "zod";

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req: any, file: any, cb: any) => {
    console.log('File filter - filename:', file.originalname, 'mimetype:', file.mimetype);
    
    // Accept both proper MIME type and common variations
    const validMimeTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/octet-stream', // Some browsers might send this
      'application/zip' // .docx is essentially a zip file
    ];
    
    const isValidExtension = file.originalname && file.originalname.toLowerCase().endsWith('.docx');
    const isValidMimeType = validMimeTypes.includes(file.mimetype);
    
    if (isValidExtension || isValidMimeType) {
      cb(null, true);
    } else {
      cb(new Error(`Only .docx files are allowed. Received: ${file.mimetype}, filename: ${file.originalname}`));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload and process Word document
  app.post("/api/documents/upload", upload.single('document'), async (req: RequestWithFile, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Validate file data
      const documentData = insertDocumentSchema.parse({
        filename: req.file.originalname,
        originalSize: req.file.size,
      });

      // Create document record
      const document = await storage.createDocument(documentData);

      // Return document ID for processing
      res.json({ 
        documentId: document.id,
        message: "File uploaded successfully" 
      });

      // Process the document asynchronously
      processDocument(document.id, req.file.buffer);

    } catch (error) {
      console.error('Upload error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid file data", errors: error.errors });
      }
      if (error instanceof multer.MulterError) {
        return res.status(400).json({ message: error.message });
      }
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      res.status(500).json({ message: errorMessage });
    }
  });

  // Get document status and result
  app.get("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      console.error('Get document error:', error);
      res.status(500).json({ message: "Failed to retrieve document" });
    }
  });

  // Get all documents
  app.get("/api/documents", async (req, res) => {
    try {
      const documents = await storage.getAllDocuments();
      res.json(documents);
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({ message: "Failed to retrieve documents" });
    }
  });

  // Download extracted text
  app.get("/api/documents/:id/download", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      if (!document.extractedText) {
        return res.status(400).json({ message: "Document not yet processed" });
      }

      const filename = document.filename.replace('.docx', '.txt');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'text/plain');
      res.send(document.extractedText);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ message: "Download failed" });
    }
  });

  // Download extracted questions as JSON
  app.get("/api/documents/:id/download-json", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      if (!document.extractedQuestions) {
        return res.status(400).json({ message: "Questions not yet extracted" });
      }

      const filename = document.filename.replace('.docx', '.json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', 'application/json');
      res.send(document.extractedQuestions);
    } catch (error) {
      console.error('Download JSON error:', error);
      res.status(500).json({ message: "Download failed" });
    }
  });

  // Get extracted questions
  app.get("/api/documents/:id/questions", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      if (!document.extractedQuestions) {
        return res.status(400).json({ message: "Questions not yet extracted" });
      }

      const questions = JSON.parse(document.extractedQuestions);
      res.json({ questions, count: questions.length });
    } catch (error) {
      console.error('Get questions error:', error);
      res.status(500).json({ message: "Failed to retrieve questions" });
    }
  });

  // Reprocess document with updated logic
  app.post("/api/documents/:id/reprocess", async (req, res) => {
    try {
      const document = await storage.getDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      if (!document.extractedText) {
        return res.status(400).json({ message: "Document not yet processed" });
      }

      // Extract questions from existing text with updated logic
      const questions = extractQuestionsFromText(document.extractedText);
      const extractedQuestions = JSON.stringify(questions, null, 2);
      const questionCount = questions.length;

      // Update document with new questions
      await storage.updateDocument(req.params.id, {
        extractedQuestions,
        questionCount,
      });

      console.log(`Document ${req.params.id} reprocessed with ${questionCount} questions`);
      res.json({ message: "Document reprocessed successfully", questionCount });
    } catch (error) {
      console.error('Reprocess error:', error);
      res.status(500).json({ message: "Failed to reprocess document" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Function to extract questions from text
function extractQuestionsFromText(text: string): Question[] {
  const questions: Question[] = [];
  
  // Split by question patterns and process each section
  const sections = text.split(/(?=Đoạn văn câu hỏi)/i);
  
  for (const section of sections) {
    if (!section.trim() || !section.match(/Đoạn văn câu hỏi/i)) continue;
    
    // Extract question text (after "Đoạn văn câu hỏi" and before "Select one")
    const questionMatch = section.match(/Đoạn văn câu hỏi\s*[:\-]?\s*([\s\S]*?)(?=Select one)/i);
    if (!questionMatch) continue;
    
    const questionText = questionMatch[1].trim();
    
    // Extract answers (a., b., c., d.)
    const answers: Array<{ text: string; isCorrect: boolean }> = [];
    
    // Extract answer a.
    const answerAMatch = section.match(/a\.\s*([\s\S]*?)(?=b\.)/i);
    if (answerAMatch) {
      answers.push({ text: answerAMatch[1].trim(), isCorrect: false });
    }
    
    // Extract answer b.
    const answerBMatch = section.match(/b\.\s*([\s\S]*?)(?=c\.)/i);
    if (answerBMatch) {
      answers.push({ text: answerBMatch[1].trim(), isCorrect: false });
    }
    
    // Extract answer c.
    const answerCMatch = section.match(/c\.\s*([\s\S]*?)(?=d\.)/i);
    if (answerCMatch) {
      answers.push({ text: answerCMatch[1].trim(), isCorrect: false });
    }
    
    // Extract answer d.
    const answerDMatch = section.match(/d\.\s*([\s\S]*?)(?=Phản hồi)/i);
    if (answerDMatch) {
      answers.push({ text: answerDMatch[1].trim(), isCorrect: false });
    }
    
    // Extract correct answer (after "Đáp án đúng là:" and before "Vì:")
    const correctAnswerMatch = section.match(/Đáp án đúng là:\s*([^Vì]*?)(?=Vì:|$)/i);
    const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1].trim() : "";
    
    // Mark the correct answer in the answers array
    if (correctAnswer) {
      const correctLetter = correctAnswer.toLowerCase().charAt(0);
      const correctIndex = ['a', 'b', 'c', 'd'].indexOf(correctLetter);
      if (correctIndex >= 0 && answers[correctIndex]) {
        answers[correctIndex].isCorrect = true;
      }
    }
    
    // Extract explanation (after "Vì:" and before "Tham khảo")
    const explainMatch = section.match(/Vì:\s*([\s\S]*?)(?=Tham khảo|Câu hỏi|$)/i);
    const explain = explainMatch ? explainMatch[1].trim() : "";
    
    // Extract reference (after "Tham khảo:" and before "Câu hỏi")
    const referenceMatch = section.match(/Tham khảo:\s*([\s\S]*?)(?=Câu hỏi|$)/i);
    const reference = referenceMatch ? referenceMatch[1].trim() : "";
    
    // Only add if we have a valid question and at least one answer
    if (questionText && answers.length > 0) {
      questions.push({
        question: questionText,
        answers,
        correctAnswer: correctAnswer || undefined,
        explain: explain || undefined,
        reference: reference || undefined,
      });
    }
  }
  
  return questions;
}

// Asynchronous document processing function
async function processDocument(documentId: string, fileBuffer: Buffer) {
  const startTime = Date.now();
  
  try {
    // Update status to processing
    await storage.updateDocument(documentId, {
      processingStatus: "processing"
    });

    // Extract text using mammoth
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    const extractedText = result.value;

    // Extract questions from text
    const questions = extractQuestionsFromText(extractedText);
    const extractedQuestions = JSON.stringify(questions, null, 2);

    // Calculate statistics
    const wordCount = extractedText.split(/\s+/).filter(word => word.length > 0).length;
    const characterCount = extractedText.length;
    const pageCount = Math.ceil(wordCount / 250); // Estimate pages (250 words per page)
    const questionCount = questions.length;

    const conversionTime = Date.now() - startTime;

    // Update document with results
    await storage.updateDocument(documentId, {
      extractedText,
      extractedQuestions,
      wordCount,
      characterCount,
      pageCount,
      questionCount,
      processingStatus: "completed",
      conversionTime,
      completedAt: new Date(),
    });

    console.log(`Document ${documentId} processed successfully in ${conversionTime}ms`);
    console.log(`Extracted ${questionCount} questions`);
  } catch (error) {
    console.error(`Document processing failed for ${documentId}:`, error);
    
    // Update status to failed
    await storage.updateDocument(documentId, {
      processingStatus: "failed",
      conversionTime: Date.now() - startTime,
    });
  }
}
