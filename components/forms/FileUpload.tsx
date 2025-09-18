'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  X, 
  File, 
  FileText, 
  Image as ImageIcon, 
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

interface FileUploadProps {
  maxFiles?: number;
  maxSizePerFile?: number; // in MB
  acceptedTypes?: string[];
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
}

interface FileWithPreview extends File {
  id: string;
  preview?: string;
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  maxFiles = 5,
  maxSizePerFile = 100, // 100MB default for CAD files
  acceptedTypes = [
    'image/*',
    'application/pdf',
    '.dwg',
    '.dxf',
    '.step',
    '.stp',
    '.iges',
    '.igs',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  onFilesChange,
  disabled = false,
  className = ''
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File type icons
  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    }
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (file.name.toLowerCase().includes('.dwg') || file.name.toLowerCase().includes('.dxf')) {
      return <File className="h-8 w-8 text-green-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  // Process files
  const processFiles = useCallback((fileList: FileList) => {
    // Validate file function moved inside useCallback
    const validateFile = (file: File): string | null => {
      // Check file size
      if (file.size > maxSizePerFile * 1024 * 1024) {
        return `File size exceeds ${maxSizePerFile}MB limit`;
      }

      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes('*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType);
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
      }

      return null;
    };

    const newFiles: FileWithPreview[] = [];
    const newErrors: string[] = [];

    // Check total file count
    if (files.length + fileList.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} files allowed`);
      setErrors(newErrors);
      return;
    }

    Array.from(fileList).forEach((file) => {
      // Check for duplicates
      const isDuplicate = files.some(existingFile => 
        existingFile.name === file.name && existingFile.size === file.size
      );

      if (isDuplicate) {
        newErrors.push(`Duplicate file: ${file.name}`);
        return;
      }

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        newErrors.push(`${file.name}: ${validationError}`);
        return;
      }

      // Create file with preview
      const fileWithPreview: FileWithPreview = Object.assign(file, {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        uploadStatus: 'pending' as const,
        uploadProgress: 0
      });

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          fileWithPreview.preview = e.target?.result as string;
          setFiles(prev => [...prev]);
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(fileWithPreview);
    });

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    }

    if (newErrors.length > 0) {
      setErrors(prev => [...prev, ...newErrors]);
      // Clear errors after 5 seconds
      setTimeout(() => {
        setErrors(prev => prev.filter(error => !newErrors.includes(error)));
      }, 5000);
    }
  }, [files, maxFiles, maxSizePerFile, acceptedTypes, onFilesChange]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles?.length > 0) {
      processFiles(droppedFiles);
    }
  }, [disabled, processFiles]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      processFiles(e.target.files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  // Remove file
  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`
          border-2 border-dashed transition-colors cursor-pointer
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 px-4 text-center">
          <Upload className={`h-12 w-12 mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-700">
              {dragActive ? 'Drop files here' : 'Upload project files'}
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Max {maxFiles} files, {maxSizePerFile}MB each
            </p>
            <p className="text-xs text-gray-400">
              Supports: Images, PDF, CAD files (.dwg, .dxf, .step), Documents
            </p>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="mt-4"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Choose Files
          </Button>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
        aria-label="Choose files to upload"
      />

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">
            Selected Files ({files.length}/{maxFiles})
          </h4>
          
          <div className="space-y-2">
            {files.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center gap-3">
                  {/* File Icon/Preview */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <Image 
                        src={file.preview} 
                        alt={`Preview of ${file.name}`}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-cover rounded border"
                      />
                    ) : (
                      getFileIcon(file)
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>

                    {/* Upload Progress */}
                    {file.uploadStatus === 'uploading' && (
                      <div className="mt-2">
                        <Progress value={file.uploadProgress || 0} className="h-1" />
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading... {file.uploadProgress || 0}%
                        </p>
                      </div>
                    )}

                    {/* Upload Status */}
                    {file.uploadStatus === 'success' && (
                      <div className="flex items-center gap-1 mt-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600">Uploaded</span>
                      </div>
                    )}

                    {file.uploadStatus === 'error' && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <span className="text-xs text-red-600">
                          {file.error || 'Upload failed'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {file.uploadStatus === 'uploading' && (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                    )}
                    {file.uploadStatus === 'success' && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {file.uploadStatus === 'error' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={disabled || file.uploadStatus === 'uploading'}
                    className="flex-shrink-0 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Summary */}
      {files.length > 0 && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <p>
            <strong>{files.length}</strong> file{files.length !== 1 ? 's' : ''} selected
            {files.length > 0 && (
              <span className="ml-2">
                ({formatFileSize(files.reduce((total, file) => total + file.size, 0))} total)
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
