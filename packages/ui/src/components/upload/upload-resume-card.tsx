'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { UploadCloud, FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from '@repo/ui';

interface UploadResumeCardProps {
  onUpload: (file: File) => Promise<void>;
}

export default function UploadResumeCard({ onUpload }: UploadResumeCardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  async function handleFile(selectedFile: File) {
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Only PDF, DOC or DOCX files allowed');
      return;
    }

    setFile(selectedFile);

    try {
      await onUpload(selectedFile);
      toast.success('Resume uploaded successfully');
    } catch {
      toast.error('Failed to upload resume');
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  }

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  return (
    <Card className="w-full max-w-lg border-dashed border-2">
      <CardHeader className="items-center text-center">
        <UploadCloud className="h-8 w-8 text-muted-foreground" />
        <CardTitle className="mt-2 text-lg">Upload Resume</CardTitle>
      </CardHeader>

      <CardContent>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center gap-4 rounded-lg border border-dashed p-8 text-center transition',
            dragActive && 'border-primary bg-muted/30'
          )}
        >
          {/* File input should ALWAYS exist */}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            onChange={handleChange}
            className="hidden"
          />

          {!file ? (
            <>
              <p className="text-sm text-muted-foreground">Drag & drop your resume here</p>

              <p className="text-xs text-muted-foreground">Supported formats: PDF, DOC, DOCX</p>

              <Button variant="outline" onClick={openFileDialog}>
                Browse File
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" size="sm" onClick={openFileDialog}>
                  Change File
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }

                    toast.info('File removed');
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
