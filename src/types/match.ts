export type MatchStatus = 'MATCHED' | 'DISCREPANCY' | 'MISMATCH' | 'FLAGGED' | 'PENDING' | 'NOT_FOUND';

export interface StructuredEntity {
  name?: string;
  companyName?: string;
  title?: string;
  address?: string;
  taxId?: string;
  vatId?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface LinkedDocument {
  id: string;
  filename: string;
  originalName: string;
  documentType: 'PO' | 'GRN' | 'INVOICE' | 'PURCHASE_ORDER';
  uploadedAt?: string;
  buyer?: string | StructuredEntity;
  supplier?: string | StructuredEntity;
  issueDate?: string;
  dueDate?: string;
  totalAmount?: number;
  currency?: string;
  paymentTerms?: string;
  warehouse?: string;
  receivedBy?: string | StructuredEntity;
  receivedDate?: string;
}

export interface MatchItem {
  id?: string;
  skuCode: string;
  skuName?: string;
  description?: string;
  poQuantity?: number;
  poUnitPrice?: number;
  grnQuantity?: number;
  grnRejectedQuantity?: number;
  invoiceQuantity?: number;
  invoiceUnitPrice?: number;
  matched?: boolean;
  isDiscrepancy?: boolean;
  discrepancies?: string[];
  reasonCodes?: string[];
}

export interface AggregatedQuantities {
  totalOrdered?: number;
  totalReceived?: number;
  totalInvoiced?: number;
  totalPending?: number;
  totalRejected?: number;
}

export interface OverallTotals {
  poTotal?: number;
  invoiceTotal?: number;
  priceDifference?: number;
  quantityDifference?: number;
  currency?: string;
}

export interface DocumentCounts {
  poCount?: number;
  grnCount?: number;
  invoiceCount?: number;
  totalDocuments?: number;
}

export interface LinkedDocumentsGroup {
  po?: LinkedDocument | null;
  grns?: LinkedDocument[];
  invoices?: LinkedDocument[];
}

export interface MatchData {
  poNumber: string;
  status: MatchStatus;
  reasons?: string[];
  reasonCodes?: string[];
  linkedDocuments?: LinkedDocumentsGroup;
  itemLevelResults?: MatchItem[];
  aggregatedQuantities?: AggregatedQuantities;
  overallTotals?: OverallTotals;
  documentCounts?: DocumentCounts;
  evaluatedAt?: string;
  buyer?: string | StructuredEntity;
  supplier?: string | StructuredEntity;
  issueDate?: string;
  currency?: string;
  paymentTerms?: string;
  warehouse?: string;
  receivedBy?: string | StructuredEntity;
  receivedDate?: string;
  dueDate?: string;
}

export interface MatchResponse {
  success: boolean;
  data: MatchData;
  message?: string;
}
