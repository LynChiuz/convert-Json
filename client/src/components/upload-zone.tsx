import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloudUpload, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface UploadZoneProps {
  onFileUploaded: (documentId: string) => void;
}

export default function UploadZone({ onFileUploaded }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log('Uploading file:', file.name, file.type, file.size);
      const formData = new FormData();
      formData.append('document', file);
      
      const response = await apiRequest('POST', '/api/documents/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Upload success:', data);
      toast({
        title: "File uploaded successfully",
        description: "Your document is being processed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      onFileUploaded(data.documentId);
    },
    onError: (error: Error) => {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file.name, file.type, file.size);
    
    if (!file.name.toLowerCase().endsWith('.docx')) {
      toast({
        title: "Invalid file type",
        description: "Please select a .docx file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB
      toast({
        title: "File too large",
        description: "Please select a file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    console.log('File validation passed, uploading...');
    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
        isDragOver 
          ? 'border-primary bg-blue-50' 
          : 'border-gray-300 hover:border-primary hover:bg-blue-50'
      } ${uploadMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={!uploadMutation.isPending ? handleClick : undefined}
      data-testid="upload-zone"
    >
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
          <CloudUpload className="text-gray-400 text-2xl" />
        </div>
        <div>
          <p className="text-lg font-medium text-gray-700">
            {uploadMutation.isPending ? 'Uploading...' : 'Drag and drop your Word file here'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {uploadMutation.isPending ? 'Please wait' : 'or click to browse files'}
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Info className="w-4 h-4" />
          <span>Supports .docx files up to 50MB</span>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".docx"
        onChange={handleFileChange}
        disabled={uploadMutation.isPending}
        data-testid="file-input"
      />
    </div>
  );
}
