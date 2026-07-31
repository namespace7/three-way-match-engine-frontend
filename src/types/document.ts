export type DocumentType = 'PURCHASE_ORDER' | 'PO' | 'GRN' | 'INVOICE';

export interface DocumentItem {
  id: string;
  filename: string;
  originalName: string;
  documentType: DocumentType;
  poNumber?: string;
  uploadedAt: string;
  status: 'PENDING' | 'PARSED' | 'FAILED';
  parsedData?: Record<string, unknown>;
}

export interface DocumentUploadResponse {
  success: boolean;
  data: DocumentItem;
}
