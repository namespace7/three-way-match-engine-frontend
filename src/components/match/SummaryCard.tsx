import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { StatCard } from './StatCard';
import { ReasonBadge } from './ReasonBadge';
import { MatchData } from '@/types/match';
import { DollarSign, PackageCheck, FileCheck, Layers } from 'lucide-react';

export interface SummaryCardProps {
  matchData: MatchData;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ matchData }) => {
  const currency = matchData.overallTotals?.currency || matchData.currency || 'USD';
  const totals = matchData.overallTotals || {};
  const quantities = matchData.aggregatedQuantities || {};
  const counts = matchData.documentCounts || {};
  const reasons = matchData.reasons || matchData.reasonCodes || [];

  const poTotal = totals.poTotal ?? 0;
  const invoiceTotal = totals.invoiceTotal ?? 0;
  const priceDiff = totals.priceDifference ?? Math.abs(poTotal - invoiceTotal);

  return (
    <div className="space-y-6">
      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="PO Total"
          value={`${currency} ${poTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Invoice Total"
          value={`${currency} ${invoiceTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          variant={priceDiff > 0 ? 'danger' : 'success'}
          icon={<DollarSign className="h-4 w-4" />}
          subValue={priceDiff > 0 ? `Diff: ${currency} ${priceDiff.toFixed(2)}` : 'Fully Reconciled'}
        />
        <StatCard
          label="Ordered Qty"
          value={quantities.totalOrdered ?? 0}
          icon={<PackageCheck className="h-4 w-4" />}
        />
        <StatCard
          label="Received Qty"
          value={quantities.totalReceived ?? 0}
          icon={<PackageCheck className="h-4 w-4" />}
        />
        <StatCard
          label="Invoiced Qty"
          value={quantities.totalInvoiced ?? 0}
          icon={<PackageCheck className="h-4 w-4" />}
        />
        <StatCard
          label="Pending Qty"
          value={quantities.totalPending ?? 0}
          variant={(quantities.totalPending ?? 0) > 0 ? 'warning' : 'default'}
          icon={<PackageCheck className="h-4 w-4" />}
        />
      </div>

      {/* Grid: Document Breakdown & Discrepancy Reasons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document Counts Card */}
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardHeader className="pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-zinc-400" />
              <CardTitle className="text-sm font-semibold">Document Breakdown</CardTitle>
            </div>
            <CardDescription className="text-xs">Linked documents in this 3-Way match session</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs">
              <span className="text-zinc-400">Purchase Orders (PO)</span>
              <span className="font-mono font-semibold text-zinc-100">{counts.poCount ?? 1}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs">
              <span className="text-zinc-400">Goods Received Notes (GRN)</span>
              <span className="font-mono font-semibold text-zinc-100">{counts.grnCount ?? 1}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs">
              <span className="text-zinc-400">Invoices</span>
              <span className="font-mono font-semibold text-zinc-100">{counts.invoiceCount ?? 1}</span>
            </div>
          </CardContent>
        </Card>

        {/* Reason Codes / Discrepancy Breakdown Card */}
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardHeader className="pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-zinc-400" />
              <CardTitle className="text-sm font-semibold">Reconciliation Evaluation & Reason Codes</CardTitle>
            </div>
            <CardDescription className="text-xs">Discrepancy audit findings</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {reasons.length > 0 ? (
              <div className="space-y-2">
                {reasons.map((reason, idx) => (
                  <ReasonBadge key={idx} reason={reason} className="w-full justify-start py-2" />
                ))}
              </div>
            ) : (
              <div className="p-4 rounded bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 font-medium">
                No discrepancy codes generated. All line items, quantities, and prices strictly match across PO, GRN, and Invoice.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SummaryCard;
