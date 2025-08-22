import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalSize: integer("original_size").notNull(),
  extractedText: text("extracted_text"),
  extractedQuestions: text("extracted_questions"), // JSON string of questions array
  wordCount: integer("word_count"),
  characterCount: integer("character_count"),
  pageCount: integer("page_count"),
  questionCount: integer("question_count"), // number of questions found
  processingStatus: text("processing_status").notNull().default("pending"), // pending, processing, completed, failed
  conversionTime: integer("conversion_time"), // in milliseconds
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  filename: true,
  originalSize: true,
});

export const updateDocumentSchema = createInsertSchema(documents).pick({
  extractedText: true,
  extractedQuestions: true,
  wordCount: true,
  characterCount: true,
  pageCount: true,
  questionCount: true,
  processingStatus: true,
  conversionTime: true,
  completedAt: true,
}).partial();

// Question schema for JSON storage
export const questionSchema = z.object({
  question: z.string(),
  answers: z.array(z.object({
    text: z.string(),
    isCorrect: z.boolean().default(false),
  })),
  correctAnswer: z.string().optional(),
  explain: z.string().optional(),
  reference: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type UpdateDocument = z.infer<typeof updateDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type Question = z.infer<typeof questionSchema>;
