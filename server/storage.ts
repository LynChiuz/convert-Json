import { type User, type InsertUser, type Document, type InsertDocument, type UpdateDocument } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createDocument(document: InsertDocument): Promise<Document>;
  getDocument(id: string): Promise<Document | undefined>;
  updateDocument(id: string, updates: UpdateDocument): Promise<Document | undefined>;
  getAllDocuments(): Promise<Document[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private documents: Map<string, Document>;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      extractedText: null,
      extractedQuestions: null,
      wordCount: null,
      characterCount: null,
      pageCount: null,
      questionCount: null,
      processingStatus: "pending",
      conversionTime: null,
      createdAt: new Date(),
      completedAt: null,
    };
    this.documents.set(id, document);
    return document;
  }

  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async updateDocument(id: string, updates: UpdateDocument): Promise<Document | undefined> {
    const existingDoc = this.documents.get(id);
    if (!existingDoc) return undefined;

    const updatedDoc: Document = {
      ...existingDoc,
      ...updates,
    };
    this.documents.set(id, updatedDoc);
    return updatedDoc;
  }

  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
}

export const storage = new MemStorage();
