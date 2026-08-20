'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw } from 'lucide-react';

interface ImageUploadZoneProps {
  onImageSelect: (file: File, previewUrl: string) => void;
  disabled?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageUploadZone({ onImageSelect, disabled = false }: ImageUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!file.type.startsWith('image/')) {
        setError('Only image files are accepted (JPG, PNG, WEBP, etc.)');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError('Image must be smaller than 20 MB.');
        return;
      }
      const url = URL.createObjectURL(file);
      setPreview(url);
      setFileName(file.name);
      setFileSize(file.size);
      onImageSelect(file, url);
    },
    [onImageSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset so same file can be re-selected
    e.target.value = '';
  };

  const handleClear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFileName(null);
    setFileSize(null);
    setError(null);
  };

  const openBrowser = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        disabled={disabled}
      />

      {!preview ? (
        /* Drop zone */
        <div
          onClick={openBrowser}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center
            min-h-[260px] rounded-xl cursor-pointer select-none
            border-2 border-dashed transition-all duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${
              isDragOver
                ? 'border-[#4C6FFF] bg-[#4C6FFF]/10 scale-[1.01]'
                : 'border-white/20 bg-[#12151B] hover:border-[#4C6FFF]/60 hover:bg-[#4C6FFF]/5'
            }
          `}
        >
          <div
            className={`
              flex items-center justify-center w-16 h-16 rounded-full mb-4
              transition-colors duration-200
              ${isDragOver ? 'bg-[#4C6FFF]/20' : 'bg-[#191D25]'}
            `}
          >
            {isDragOver ? (
              <Upload className="w-8 h-8 text-[#4C6FFF]" />
            ) : (
              <ImageIcon className="w-8 h-8 text-[#9096A3]" />
            )}
          </div>

          <p className="text-[#EDEEF1] font-semibold text-base mb-1">
            {isDragOver ? 'Drop image here' : 'Drag & drop evidence photo'}
          </p>
          <p className="text-[#9096A3] text-sm mb-3">or click to browse files</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#191D25] border border-white/10 text-xs text-[#9096A3]">
            Accepts JPG, PNG, WEBP · Max 20 MB
          </span>

          {isDragOver && (
            <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-[#4C6FFF] animate-pulse" />
          )}
        </div>
      ) : (
        /* Preview */
        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#12151B]">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Evidence preview"
              className="w-full object-cover"
              style={{ maxHeight: '320px' }}
            />
            <button
              onClick={handleClear}
              disabled={disabled}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-[#EF4444]/80 transition-colors disabled:opacity-50"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-white/7">
            <div className="flex flex-col min-w-0">
              <span className="text-[#EDEEF1] text-sm font-medium truncate">{fileName}</span>
              <span className="text-[#5B6070] text-xs">{fileSize !== null ? formatBytes(fileSize) : ''}</span>
            </div>
            <button
              onClick={openBrowser}
              disabled={disabled}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-[#191D25] text-[#9096A3] text-sm hover:text-[#EDEEF1] hover:border-white/20 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Change Image
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-[#EF4444] text-sm flex items-center gap-1.5">
          <X className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
