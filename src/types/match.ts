export type MatchStatus = 'MATCHED' | 'DISCREPANCY' | 'PENDING' | 'NOT_FOUND';

export interface LineItemMatch {
  skuCode: string;
  poQuantity: number;
  poUnitPrice: number;
  grnQuantity: number;
  invoiceQuantity: number;
  invoiceUnitPrice: number;
  matched: boolean;
  discrepancies: string[];
}

export interface MatchResult {
  poNumber: string;
  status: MatchStatus;
  lineItems: LineItemMatch[];
  totalPoAmount: number;
  totalInvoiceAmount: number;
  priceDiscrepancy: number;
  quantityDiscrepancy: number;
  evaluatedAt: string;
}

export interface MatchSummary {
  poNumber: string;
  poDocumentId?: string;
  grnDocumentId?: string;
  invoiceDocumentId?: string;
  matchStatus: MatchStatus;
  itemCount: number;
  discrepancyCount: number;
  createdAt: string;
}
