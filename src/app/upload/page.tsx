'use client';

import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DocumentType } from '@/types/document';
import { uploadDocument, UploadDocumentResponse } from '@/services/documentService';

const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const documentTypeOptions = [
  { value: 'PURCHASE_ORDER', label: 'Purchase Order (PO)' },
  { value: 'GRN', label: 'Goods Received Note (GRN)' },
  { value: 'INVOICE', label: 'Invoice' },
];

export default function UploadPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documentType, setDocumentType] = useState<DocumentType>('PURCHASE_ORDER');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [lastUploadedResult, setLastUploadedResult] = useState<UploadDocumentResponse | null>(null);

  const { mutate: executeUpload, isPending } = useMutation({
    mutationFn: uploadDocument,
    onSuccess: (data) => {
      toast.success('Document uploaded and parsed successfully');
      setLastUploadedResult(data);
      setSelectedFile(null);
      setUploadProgress(0);
      setValidationError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (err: unknown) => {
      setUploadProgress(0);
      let errorMsg = 'Failed to upload document.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
        errorMsg = axiosErr.response?.data?.message || axiosErr.response?.data?.error || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setValidationError(errorMsg);
      toast.error(errorMsg);
    },
  });

  const validateFile = (file: File): boolean => {
    setValidationError(null);

    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidType = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(fileExt);

    if (!isValidType) {
      setValidationError('Invalid file type. Only PDF, PNG, and JPEG files are accepted.');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setValidationError('File size exceeds maximum allowed limit of 10MB.');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationError('Please select a file to upload.');
      return;
    }

    if (!validateFile(selectedFile)) {
      return;
    }

    setUploadProgress(1);
    executeUpload({
      file: selectedFile,
      documentType,
      onUploadProgress: (percent) => {
        setUploadProgress(percent);
      },
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header */}
          <div className="border-b border-zinc-800 pb-5">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">Document Upload</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Ingest Purchase Orders, Goods Received Notes, or Invoices for Gemini AI parsing and 3-way reconciliation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Upload Form Card */}
            <Card className="border-zinc-800 bg-zinc-900/80">
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Upload Document</CardTitle>
                  <CardDescription className="text-xs">
                    Select the document category and attach a supported file
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Document Type Dropdown */}
                  <Select
                    label="Document Type"
                    value={documentType}
                    options={documentTypeOptions}
                    onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                    disabled={isPending}
                    helperText="Specify whether this document is a PO, GRN, or Invoice"
                  />

                  {/* File Upload Dropzone */}
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-zinc-300">
                      Document File (PDF, PNG, JPEG)
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="file-upload-input"
                    />

                    {!selectedFile ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                          isDragOver
                            ? 'border-zinc-400 bg-zinc-800/60'
                            : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 mb-3">
                          <Upload className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-medium text-zinc-200">
                          Click to browse or drag & drop file here
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-1 font-mono">
                          Supported formats: .pdf, .png, .jpeg (Max: 10MB)
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-3.5 rounded-lg border border-zinc-700 bg-zinc-950">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-zinc-800 text-zinc-200">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-zinc-100 truncate">{selectedFile.name}</p>
                            <p className="text-[11px] text-zinc-400 font-mono">
                              {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Document'}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          disabled={isPending}
                          className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50"
                          title="Remove file"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Validation Error Display */}
                  {validationError && (
                    <div className="flex items-center gap-2 rounded-md border border-rose-900/80 bg-rose-950/60 p-3 text-xs text-rose-300">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* Upload Progress Bar */}
                  {isPending && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs text-zinc-400 font-mono">
                        <span>Uploading & Parsing...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-zinc-100 transition-all duration-150 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-end gap-3">
                  {selectedFile && (
                    <Button
                      type="button"
                      variant="outline"
                      size="md"
                      onClick={() => {
                        setSelectedFile(null);
                        setValidationError(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!selectedFile || isPending}
                    isLoading={isPending}
                  >
                    {isPending ? 'Uploading Document...' : 'Submit & Ingest'}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Ingestion Output Result Card */}
            {lastUploadedResult && (
              <Card className="border-emerald-800/60 bg-zinc-900/90 shadow-xl">
                <CardHeader className="pb-3 border-b border-zinc-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <CardTitle className="text-sm font-semibold text-emerald-300">
                        Ingestion Response Output
                      </CardTitle>
                    </div>
                    <Badge variant="success">Parsed Successfully</Badge>
                  </div>
                  <CardDescription className="text-xs text-zinc-400">
                    Document raw parser payload returned from POST /api/v1/documents/upload
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <pre className="p-4 rounded-md bg-zinc-950 border border-zinc-800 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-96 leading-relaxed">
                    {JSON.stringify(lastUploadedResult, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
