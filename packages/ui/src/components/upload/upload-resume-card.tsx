'use client';

import { useState, useRef } from 'react';
import type { DragEvent, ChangeEvent } from 'react';
import { UploadCloud, FileText, X, RefreshCw } from 'lucide-react';
import { cn, Text, toast } from '@repo/ui';
import type { UploadResumeCardProps } from '@repo/types';

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export default function UploadResumeCard({ onUpload }: UploadResumeCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function handleFile(selectedFile: File) {
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      toast.error('Only PDF, DOC or DOCX files are allowed');
      return;
    }
    setFile(selectedFile);
    try {
      await onUpload(selectedFile);
    } catch {
      toast.error('Failed to upload resume');
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  }

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  function removeFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="flex flex-col gap-2">
      <Text size="sm" weight="medium" className="text-foreground">
        Resume
      </Text>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={!file ? openFileDialog : undefined}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3',
          'rounded-xl border-2 border-dashed p-8 text-center',
          'transition-all duration-200 cursor-pointer',
          dragActive
            ? 'border-primary bg-primary/5 scale-[1.01]'
            : file
              ? 'border-primary/40 bg-primary/5 cursor-default'
              : 'border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5'
        )}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          ref={fileInputRef}
          onChange={handleChange}
          className="hidden"
        />

        {!file ? (
          <>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <UploadCloud className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Text size="sm" weight="medium" className="text-foreground">
                Drop your resume here
              </Text>
              <Text size="xs" className="text-muted-foreground mt-1">
                or click to browse — PDF, DOC, DOCX
              </Text>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {['PDF', 'DOC', 'DOCX'].map((fmt) => (
                <Text
                  key={fmt}
                  as="span"
                  size="xs"
                  className="text-muted-foreground/60 bg-muted px-2 py-0.5 rounded"
                >
                  {fmt}
                </Text>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Text size="sm" weight="medium" className="text-foreground max-w-[200px] truncate">
                {file.name}
              </Text>
              <Text size="xs" className="text-muted-foreground mt-1">
                {(file.size / 1024).toFixed(0)} KB · Ready to analyze
              </Text>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Change file
              </button>
              <Text as="span" size="xs" className="text-muted-foreground/40">
                ·
              </Text>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
                Remove
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
