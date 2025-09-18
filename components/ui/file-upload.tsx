"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, FileIcon, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export interface FileUploadProps {
  className?: string;
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
  accept?: Record<string, string[]>
  value?: File[]
  onChange?: (files: File[]) => void
  showFileList?: boolean
  error?: string
}

export function FileUpload({
  className,
  onFilesSelected,
  maxFiles = 5,
  maxSize = 104857600, // 100MB
  accept = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/msword': ['.doc'],
    'model/stl': ['.stl'],
    'model/obj': ['.obj'],
    'model/step': ['.step', '.stp'],
    'application/x-step': ['.step', '.stp'],
    'model/iges': ['.iges', '.igs'],
  },
  value = [],
  onChange,
  showFileList = true,
  error,
  ...props
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>(value)
  const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>({})
  const [uploadStatus, setUploadStatus] = React.useState<Record<string, 'pending' | 'success' | 'error'>>({})

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
    setFiles(newFiles)
    onChange?.(newFiles)
    onFilesSelected(acceptedFiles)

    // Simulate upload progress
    acceptedFiles.forEach(file => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }))
        }
        setUploadProgress(prev => ({ ...prev, [file.name]: Math.min(progress, 100) }))
      }, 500)
    })
  }, [files, maxFiles, onChange, onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
  })

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter(file => file !== fileToRemove)
    setFiles(newFiles)
    onChange?.(newFiles)
  }

  return (
    <div className={cn("space-y-4", className)} {...props}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary",
          error && "border-red-500"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive ? (
              "Drop the files here..."
            ) : (
              <>
                Drag & drop files here, or <span className="text-primary">browse</span>
                <br />
                <span className="text-xs text-gray-500">
                  Max {maxFiles} files, up to {maxSize / 1048576}MB each
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}

      {showFileList && files.length > 0 && (
        <ul className="space-y-2">
          <AnimatePresence>
            {files.map((file) => (
              <motion.li
                key={file.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)}KB</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {uploadProgress[file.name] !== undefined && (
                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                      <motion.div
                        className="bg-primary h-1.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress[file.name]}%` }}
                      />
                    </div>
                  )}
                  {uploadStatus[file.name] === 'success' && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                    onClick={() => removeFile(file)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
