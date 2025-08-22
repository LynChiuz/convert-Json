import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { FileText, Upload, Shield, Zap } from "lucide-react";
import UploadZone from "@/components/upload-zone";
import FilePreview from "@/components/file-preview";
import ProcessingProgress from "@/components/processing-progress";
import TextResult from "@/components/text-result";
import type { Document } from "@shared/schema";

export default function Home() {
  const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null);
  const [processedFilesCount, setProcessedFilesCount] = useState(0);

  // Fetch processed documents count
  const { data: documents } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    refetchInterval: uploadedDocumentId ? 2000 : false, // Poll while processing
  });

  useEffect(() => {
    if (documents) {
      setProcessedFilesCount(documents.length);
    }
  }, [documents]);

  const currentDocument = documents?.find(doc => doc.id === uploadedDocumentId);

  const handleFileUploaded = (documentId: string) => {
    setUploadedDocumentId(documentId);
  };

  const handleClearFiles = () => {
    setUploadedDocumentId(null);
  };

  return (
    <div className="font-inter bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Word to Text Converter</h1>
                <p className="text-sm text-gray-500">Convert your Word documents to plain text</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                <span data-testid="processed-files-count">{processedFilesCount}</span> files processed
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Document</h2>
              <p className="text-gray-600">Upload your Word document (.docx) to extract text content. Supports files up to 200+ pages.</p>
            </div>

            {!currentDocument && (
              <UploadZone onFileUploaded={handleFileUploaded} />
            )}

            {currentDocument?.processingStatus === "pending" && (
              <FilePreview document={currentDocument} onClear={handleClearFiles} />
            )}

            {currentDocument?.processingStatus === "processing" && (
              <ProcessingProgress document={currentDocument} />
            )}

            {(currentDocument?.processingStatus === "completed" || currentDocument?.processingStatus === "failed") && (
              <div className="flex space-x-4">
                <button
                  onClick={handleClearFiles}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                  data-testid="button-upload-new"
                >
                  <Upload className="w-4 h-4 mr-2 inline" />
                  Upload New Document
                </button>
              </div>
            )}
          </div>

          {/* Result Section */}
          <TextResult document={currentDocument} />
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Why Choose Our Word to Text Converter?</h3>
            <p className="text-gray-600">Professional-grade document processing with enterprise-level reliability</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="text-primary text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Fast Processing</h4>
              <p className="text-gray-600">Convert large documents (200+ pages) in seconds with optimized processing algorithms</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="text-secondary text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Secure & Private</h4>
              <p className="text-gray-600">Your documents are processed locally and never stored on our servers</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <FileText className="text-accent text-2xl" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">High Accuracy</h4>
              <p className="text-gray-600">Advanced text extraction maintains formatting and preserves document structure</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="text-white" />
                </div>
                <span className="font-bold text-lg">Word to Text</span>
              </div>
              <p className="text-gray-400 text-sm">Professional document conversion tool for businesses and individuals.</p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Bulk Conversion</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Format Preservation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Progress Tracking</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Report Issues</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; 2024 Word to Text Converter. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
