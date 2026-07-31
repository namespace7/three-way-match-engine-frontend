'use client';

import React, { useState } from 'react';
import { FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getDocumentFileUrl } from '@/services/matchService';

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
  const [loadError, setLoadError] = useState<boolean>(false);

  if (!documentId) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 border-dashed border-zinc-800 bg-zinc-900/40 text-center">
        <FileText className="h-8 w-8 text-zinc-600 mb-2" />
        <p className="text-xs font-medium text-zinc-400">No {documentType} Document Attached</p>
        <p className="text-[11px] text-zinc-600 mt-0.5">The document file is not linked to this purchase order.</p>
      </Card>
    );
  }

  const fileUrl = getDocumentFileUrl(documentId);

  const handleOpenOriginal = () => {
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
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
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenOriginal}
          className="text-xs gap-1.5 h-7"
        >
          <span>Open Original Document</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      {/* Embedded PDF Viewer area */}
      <div className="relative min-h-[400px] w-full bg-zinc-950 flex flex-col items-center justify-center">
        {!loadError ? (
          <iframe
            src={`${fileUrl}#toolbar=0&navpanes=0`}
            className="w-full h-[500px] border-0"
            onError={() => setLoadError(true)}
            title={documentName || `${documentType} PDF`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-400 mb-3 border border-zinc-800">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-xs font-medium text-zinc-200">Unable to Render PDF Preview directly</p>
            <p className="text-[11px] text-zinc-500 mt-1 mb-4">
              Browser security policies or network configuration may prevent iframe embedding.
            </p>
            <Button variant="secondary" size="sm" onClick={handleOpenOriginal} className="gap-1.5">
              <span>Open Original Document</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PDFViewer;
