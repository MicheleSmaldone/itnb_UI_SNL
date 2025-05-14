"use client"

import { useState, useRef } from "react"
import { Upload, X, File } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onClear: () => void
  selectedFile: File | null
  isDraggingGlobal?: boolean
}

export function FileUpload({ onFileSelect, onClear, selectedFile, isDraggingGlobal }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    if (e.dataTransfer.files?.length) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onFileSelect(e.target.files[0])
    }
  }

  return (
    <div className="relative">
      {selectedFile ? (
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-gray-800 dark:bg-gray-800">
          <File className="h-4 w-4 text-[#1e3fec]" />
          <span className="flex-1 truncate text-gray-700 dark:text-gray-300">
            {selectedFile.name}
          </span>
          <button
            onClick={onClear}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed px-6 py-4 transition-colors ${
            isDragging || isDraggingGlobal
              ? "border-[#1e3fec] bg-[#1e3fec]/5"
              : "border-gray-200 hover:border-[#1e3fec] dark:border-gray-800 dark:hover:border-[#1e3fec]"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Upload className="h-4 w-4" />
            <span>Drop a file or click to upload</span>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt"
      />
    </div>
  )
} 