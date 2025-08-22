import { useEffect, useState } from "react";
import { Cog } from "lucide-react";
import type { Document } from "@shared/schema";

interface ProcessingProgressProps {
  document: Document;
}

const processingMessages = [
  "Analyzing document structure...",
  "Extracting text content...",
  "Processing formatting...",
  "Calculating statistics...",
  "Finalizing conversion...",
];

export default function ProcessingProgress({ document }: ProcessingProgressProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % processingMessages.length);
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6" data-testid="processing-progress">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900">Processing Document</span>
          <span className="text-sm text-gray-500" data-testid="progress-percentage">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
            data-testid="progress-bar"
          />
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Cog className="w-4 h-4 animate-spin text-primary" />
          <span data-testid="progress-status">{processingMessages[messageIndex]}</span>
        </div>
      </div>
    </div>
  );
}
