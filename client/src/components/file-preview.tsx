import { FileText, X } from "lucide-react";
import type { Document } from "@shared/schema";

interface FilePreviewProps {
  document: Document;
  onClear: () => void;
}

export default function FilePreview({ document, onClear }: FilePreviewProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4" data-testid="file-preview">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <FileText className="text-primary text-lg" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate" data-testid="file-name">
            {document.filename}
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span data-testid="file-size">{formatFileSize(document.originalSize)}</span>
            {document.pageCount && (
              <span data-testid="file-pages">{document.pageCount} pages</span>
            )}
          </div>
        </div>
        <button 
          className="text-gray-400 hover:text-error transition-colors"
          onClick={onClear}
          data-testid="button-remove-file"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
