'use client';

import React, { use, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, Truck, Receipt, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { getMatchByPoNumber } from '@/services/matchService';
import { StatusBadge } from '@/components/match/StatusBadge';
import { ReasonBadge } from '@/components/match/ReasonBadge';
import { DocumentHeader } from '@/components/match/DocumentHeader';
import { ItemGrid } from '@/components/match/ItemGrid';
import { PDFViewer } from '@/components/match/PDFViewer';
import { SummaryCard } from '@/components/match/SummaryCard';
import { getErrorMessage } from '@/utils/error';
import { cn } from '@/lib/utils';

export interface MatchPageProps {
  params: Promise<{
    poNumber: string;
  }>;
}

type TabType = 'po' | 'delivery' | 'fulfillment' | 'summary';

export default function MatchPage({ params }: MatchPageProps) {
  const resolvedParams = use(params);
  const poNumber = resolvedParams.poNumber;

  const [activeTab, setActiveTab] = useState<TabType>('po');

  const {
    data: matchData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['match', poNumber],
    queryFn: () => getMatchByPoNumber(poNumber),
    enabled: Boolean(poNumber),
  });

  // Extract linked documents if available
  const poDoc = matchData?.linkedDocuments?.po;
  const grnDoc = matchData?.linkedDocuments?.grns?.[0];
  const invoiceDoc = matchData?.linkedDocuments?.invoices?.[0];

  const currency = matchData?.currency || matchData?.overallTotals?.currency || poDoc?.currency || 'USD';
  const reasons = matchData?.reasons || matchData?.reasonCodes || [];

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {/* Top Section Banner */}
          <div className="border-b border-zinc-800 pb-5 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold tracking-tight font-mono text-zinc-100">
                    PO: {poNumber}
                  </h1>
                  {matchData?.status && <StatusBadge status={matchData.status} size="md" />}
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  Three-Way Reconciliation Analysis • Matched across Purchase Order, GRN, and Invoice
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isRefetching}
                  className="gap-1.5"
                >
                  <RefreshCw className={cn('h-3.5 w-3.5', isRefetching && 'animate-spin')} />
                  <span>Refresh Match</span>
                </Button>
              </div>
            </div>

            {/* Reason Summary Badges */}
            {reasons.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900">
                <span className="text-xs font-mono text-zinc-400">Discrepancy Reasons:</span>
                {reasons.map((reason, idx) => (
                  <ReasonBadge key={idx} reason={reason} />
                ))}
              </div>
            )}
          </div>

          {/* Loading & Error States */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-16 space-y-3">
              <Spinner size="lg" />
              <p className="text-xs text-zinc-400 font-mono">Fetching 3-Way Match Data for {poNumber}...</p>
            </div>
          ) : isError ? (
            <Card className="border-rose-900 bg-rose-950/20 p-6 text-center space-y-3">
              <div className="flex justify-center text-rose-400">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h2 className="text-sm font-semibold text-rose-300">Failed to Load Match Data</h2>
              <p className="text-xs text-rose-400/80 max-w-md mx-auto">
                {getErrorMessage(error, `No match evaluation record found for PO "${poNumber}".`)}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
                Retry Query
              </Button>
            </Card>
          ) : matchData ? (
            <div className="space-y-6">
              {/* Tab Navigation Controls */}
              <div className="flex border-b border-zinc-800 space-x-1 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab('po')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                    activeTab === 'po'
                      ? 'border-zinc-100 text-zinc-100 bg-zinc-900/50'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  )}
                >
                  <FileText className="h-4 w-4" />
                  <span>Purchase Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('delivery')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                    activeTab === 'delivery'
                      ? 'border-zinc-100 text-zinc-100 bg-zinc-900/50'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  )}
                >
                  <Truck className="h-4 w-4" />
                  <span>Delivery (GRN)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('fulfillment')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                    activeTab === 'fulfillment'
                      ? 'border-zinc-100 text-zinc-100 bg-zinc-900/50'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  )}
                >
                  <Receipt className="h-4 w-4" />
                  <span>Fulfillment (Invoice)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('summary')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap',
                    activeTab === 'summary'
                      ? 'border-zinc-100 text-zinc-100 bg-zinc-900/50'
                      : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  )}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Summary</span>
                </button>
              </div>

              {/* TAB 1: PURCHASE ORDER */}
              {activeTab === 'po' && (
                <div className="space-y-6">
                  <DocumentHeader
                    title="Purchase Order Details"
                    items={[
                      { label: 'Buyer', value: matchData.buyer || poDoc?.buyer },
                      { label: 'Supplier', value: matchData.supplier || poDoc?.supplier },
                      { label: 'Issue Date', value: matchData.issueDate || poDoc?.issueDate },
                      { label: 'Currency', value: currency },
                      {
                        label: 'PO Amount',
                        value: matchData.overallTotals?.poTotal
                          ? `${currency} ${matchData.overallTotals.poTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                          : poDoc?.totalAmount
                          ? `${currency} ${poDoc.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                          : '—',
                      },
                      { label: 'Payment Terms', value: matchData.paymentTerms || poDoc?.paymentTerms },
                    ]}
                  />

                  {/* Grid: PDF Preview & Line Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PDFViewer
                      documentId={poDoc?.id}
                      documentName={poDoc?.originalName || `PO_${poNumber}.pdf`}
                      documentType="Purchase Order"
                    />

                    <div className="space-y-2">
                      <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
                        PO Line Items
                      </h3>
                      <ItemGrid
                        items={matchData.itemLevelResults || []}
                        type="po"
                        currency={currency}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DELIVERY (GRN) */}
              {activeTab === 'delivery' && (
                <div className="space-y-6">
                  <DocumentHeader
                    title="Goods Received Note (GRN) Details"
                    items={[
                      { label: 'GRN Number', value: grnDoc?.originalName || `GRN-${poNumber}` },
                      { label: 'Warehouse', value: matchData.warehouse || grnDoc?.warehouse },
                      { label: 'Received By', value: matchData.receivedBy || grnDoc?.receivedBy },
                      { label: 'Received Date', value: matchData.receivedDate || grnDoc?.receivedDate },
                      { label: 'Total Ordered', value: matchData.aggregatedQuantities?.totalOrdered },
                      { label: 'Total Received', value: matchData.aggregatedQuantities?.totalReceived },
                    ]}
                  />

                  {/* Grid: PDF Preview & Line Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PDFViewer
                      documentId={grnDoc?.id}
                      documentName={grnDoc?.originalName || `GRN_${poNumber}.pdf`}
                      documentType="Goods Received Note"
                    />

                    <div className="space-y-2">
                      <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
                        Delivery Line Items & Rejected Quantities
                      </h3>
                      <ItemGrid
                        items={matchData.itemLevelResults || []}
                        type="delivery"
                        currency={currency}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FULFILLMENT (INVOICE) */}
              {activeTab === 'fulfillment' && (
                <div className="space-y-6">
                  <DocumentHeader
                    title="Invoice Fulfillment Details"
                    items={[
                      { label: 'Invoice Ref', value: invoiceDoc?.originalName || `INV-${poNumber}` },
                      { label: 'Supplier', value: matchData.supplier || invoiceDoc?.supplier },
                      { label: 'Issue Date', value: matchData.issueDate || invoiceDoc?.issueDate },
                      { label: 'Due Date', value: matchData.dueDate || invoiceDoc?.dueDate },
                      {
                        label: 'Invoice Total',
                        value: matchData.overallTotals?.invoiceTotal
                          ? `${currency} ${matchData.overallTotals.invoiceTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                          : invoiceDoc?.totalAmount
                          ? `${currency} ${invoiceDoc.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                          : '—',
                      },
                      { label: 'Currency', value: currency },
                    ]}
                  />

                  {/* Grid: PDF Preview & Line Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <PDFViewer
                      documentId={invoiceDoc?.id}
                      documentName={invoiceDoc?.originalName || `INV_${poNumber}.pdf`}
                      documentType="Invoice"
                    />

                    <div className="space-y-2">
                      <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase">
                        Invoice Line Items & Billed Rates
                      </h3>
                      <ItemGrid
                        items={matchData.itemLevelResults || []}
                        type="fulfillment"
                        currency={currency}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SUMMARY */}
              {activeTab === 'summary' && (
                <SummaryCard matchData={matchData} />
              )}
            </div>
          ) : null}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
