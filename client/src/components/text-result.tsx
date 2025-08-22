import { useState } from "react";
import { Download, Copy, FileText, CheckCircle, FileJson2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Document, Question } from "@shared/schema";
import QuestionsViewer from "./questions-viewer";

interface TextResultProps {
  document?: Document;
}

export default function TextResult({ document }: TextResultProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDownload = () => {
    if (!document?.id) return;
    
    const link = window.document.createElement('a');
    link.href = `/api/documents/${document.id}/download`;
    link.download = document.filename.replace('.docx', '.txt');
    link.click();
  };

  const handleDownloadJSON = () => {
    if (!document?.id) return;
    
    const link = window.document.createElement('a');
    link.href = `/api/documents/${document.id}/download-json`;
    link.download = document.filename.replace('.docx', '.json');
    link.click();
  };

  const reprocessMutation = useMutation({
    mutationFn: async () => {
      if (!document?.id) throw new Error("No document ID");
      return fetch(`/api/documents/${document.id}/reprocess`, {
        method: "POST",
      }).then(res => res.json());
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/documents', document?.id, 'questions'] });
      toast({
        title: "Success",
        description: "Questions extracted successfully with updated logic!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reprocess document",
        variant: "destructive",
      });
    },
  });

  const handleCopyToClipboard = async () => {
    if (!document?.extractedText) return;

    try {
      await navigator.clipboard.writeText(document.extractedText);
      setCopied(true);
      toast({
        title: "Text copied to clipboard",
        description: "The extracted text has been copied successfully.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatConversionTime = (ms: number | null) => {
    if (!ms) return "N/A";
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const isCompleted = document?.processingStatus === "completed";
  const isFailed = document?.processingStatus === "failed";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Extracted Text</h2>
          <p className="text-gray-600">Preview and download your converted text</p>
        </div>
        {isCompleted && (
          <div className="flex items-center space-x-3" data-testid="result-actions">
            <button 
              className="px-4 py-2 text-sm bg-secondary text-white rounded-lg hover:bg-emerald-600 transition-colors"
              onClick={handleDownload}
              data-testid="button-download"
            >
              <Download className="w-4 h-4 mr-2 inline" />
              Download TXT
            </button>
            {document.extractedQuestions && (
              <>
                <button 
                  className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={handleDownloadJSON}
                  data-testid="button-download-json"
                >
                  <FileJson2 className="w-4 h-4 mr-2 inline" />
                  Download JSON
                </button>
                <button 
                  className="px-4 py-2 text-sm border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                  onClick={() => reprocessMutation.mutate()}
                  disabled={reprocessMutation.isPending}
                  data-testid="button-reprocess"
                >
                  {reprocessMutation.isPending ? (
                    <RefreshCw className="w-4 h-4 mr-2 inline animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2 inline" />
                  )}
                  {reprocessMutation.isPending ? 'Processing...' : 'Reprocess'}
                </button>
              </>
            )}
            <button 
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={handleCopyToClipboard}
              data-testid="button-copy"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 mr-2 inline text-green-600" />
              ) : (
                <Copy className="w-4 h-4 mr-2 inline" />
              )}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 min-h-[500px]" data-testid="text-preview">
        {!document && (
          <div className="flex flex-col items-center justify-center h-[500px] text-gray-400" data-testid="empty-state">
            <FileText className="text-6xl mb-4" />
            <p className="text-lg font-medium">No document converted yet</p>
            <p className="text-sm">Upload and convert a Word document to see the extracted text here</p>
          </div>
        )}

        {isFailed && (
          <div className="flex flex-col items-center justify-center h-[500px] text-red-400" data-testid="error-state">
            <FileText className="text-6xl mb-4" />
            <p className="text-lg font-medium">Conversion failed</p>
            <p className="text-sm">There was an error processing your document. Please try again.</p>
          </div>
        )}

        {isCompleted && document.extractedText && (
          <div className="p-6" data-testid="text-content">
            <div className="space-y-6">
              {/* Text Stats */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div>
                    <span className="font-medium" data-testid="stat-words">
                      {document.wordCount?.toLocaleString() || 0}
                    </span>
                    <span> words</span>
                  </div>
                  <div>
                    <span className="font-medium" data-testid="stat-characters">
                      {document.characterCount?.toLocaleString() || 0}
                    </span>
                    <span> characters</span>
                  </div>
                  <div>
                    <span className="font-medium" data-testid="stat-pages">
                      {document.pageCount || 0}
                    </span>
                    <span> pages</span>
                  </div>
                  {document.questionCount && document.questionCount > 0 && (
                    <div>
                      <span className="font-medium" data-testid="stat-questions">
                        {document.questionCount}
                      </span>
                      <span> questions</span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Converted in <span data-testid="conversion-time">{formatConversionTime(document.conversionTime)}</span>
                </div>
              </div>

              {/* Questions Viewer */}
              {document.questionCount && document.questionCount > 0 && (
                <QuestionsViewer documentId={document.id} />
              )}

              {/* Text Display */}
              <div className="prose max-w-none">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Full Text Content</h4>
                <div 
                  className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto text-sm leading-relaxed text-gray-800 whitespace-pre-wrap"
                  data-testid="extracted-text"
                >
                  {document.extractedText}
                </div>
              </div>

              {/* Quality Indicator */}
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  <span className="text-gray-600">Conversion completed successfully</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
