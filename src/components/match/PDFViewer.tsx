'use client';

import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, AlertCircle, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import api from '@/services/api';

export interface PDFViewerProps {
  documentId?: string;
  documentName?: string;
  documentType?: string;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  documentId,
  documentName,
  documentType = 'Document',
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);

  useEffect(() => {
    if (!documentId) return;

    let isMounted = true;
    let createdUrl: string | null = null;

    const fetchDocumentBlob = async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const response = await api.get(`/documents/${encodeURIComponent(documentId)}/file`, {
          responseType: 'blob',
        });

        if (isMounted) {
          const rawContentType = response.headers['content-type'];
          const contentType = typeof rawContentType === 'string' ? rawContentType : 'application/pdf';
          const blob = new Blob([response.data], { type: contentType });
          createdUrl = URL.createObjectURL(blob);
          setBlobUrl(createdUrl);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to stream authenticated document blob:', err);
          setLoadError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDocumentBlob();

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [documentId]);

  if (!documentId) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 border border-zinc-800 bg-zinc-900/60 text-center space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
          <FileText className="h-5 w-5 text-zinc-300" />
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-200">
            {documentName ? documentName : `${documentType} Ingested`}
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Parsed document record linked in MongoDB database
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-[11px] text-emerald-300 font-mono">
          <span>Uploaded & Processed</span>
        </div>
      </Card>
    );
  }

  const handleOpenOriginal = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownload = () => {
    if (blobUrl) {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = documentName || `${documentType}_${documentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/80 p-0 overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="h-4 w-4 text-zinc-400 shrink-0" />
          <span className="text-xs font-medium text-zinc-200 truncate">
            {documentName || `${documentType} Preview`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {blobUrl && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="text-xs gap-1.5 h-7"
              >
                <Download className="h-3 w-3" />
                <span>Download</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenOriginal}
                className="text-xs gap-1.5 h-7"
              >
                <span>Open Original</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Embedded PDF Viewer area */}
      <div className="relative min-h-[400px] w-full bg-zinc-950 flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-3">
            <Spinner size="md" />
            <p className="text-xs text-zinc-400 font-mono">Loading authenticated PDF preview...</p>
          </div>
        ) : blobUrl && !loadError ? (
          <iframe
            src={`${blobUrl}#toolbar=0&navpanes=0`}
            className="w-full h-[500px] border-0"
            onError={() => setLoadError(true)}
            title={documentName || `${documentType} PDF`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 mb-3 border border-zinc-800">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-xs font-medium text-zinc-200">PDF Preview Unavailable</p>
            <p className="text-[11px] text-zinc-500 mt-1 mb-4">
              {loadError ? 'Failed to stream document content.' : 'No preview URL available for this document.'}
            </p>
            {blobUrl && (
              <Button variant="secondary" size="sm" onClick={handleOpenOriginal} className="gap-1.5">
                <span>Open Original Document</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default PDFViewer;
