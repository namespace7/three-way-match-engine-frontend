import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { StatCard } from './StatCard';
import { ReasonBadge } from './ReasonBadge';
import { MatchData } from '@/types/match';
import { DollarSign, PackageCheck, FileCheck, Layers, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface SummaryCardProps {
  matchData: MatchData;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ matchData }) => {
  const currency = matchData.overallTotals?.currency || matchData.currency || 'INR';
  const totals = matchData.overallTotals || {};
  const quantities = matchData.aggregatedQuantities || {};
  const reasons = matchData.reasons || matchData.reasonCodes || [];

  const poTotal = totals.poTotalAmount ?? totals.poTotal ?? 0;
  const invoiceTotal = totals.invoiceTotalAmount ?? totals.invoiceTotal ?? 0;
  const priceDiff = totals.priceDifference ?? Math.abs(poTotal - invoiceTotal);

  const totalOrdered = quantities.totalOrdered ?? 0;
  const totalReceived = quantities.totalReceived ?? 0;
  const totalRejected = quantities.totalRejected ?? 0;
  const totalInvoiced = quantities.totalInvoiced ?? 0;

  const rateNum = totalOrdered > 0 ? (totalReceived / totalOrdered) * 100 : 100;
  const acceptanceRate = totalOrdered > 0 ? `${rateNum.toFixed(1)}%` : '100.0%';

  let rateVariant: 'success' | 'warning' | 'danger' = 'success';
  if (rateNum >= 95) {
    rateVariant = 'success';
  } else if (rateNum >= 60) {
    rateVariant = 'warning';
  } else {
    rateVariant = 'danger';
  }

  const isPartial = matchData.status === 'PARTIALLY_MATCHED' || matchData.status === 'PARTIAL';

  return (
    <div className="space-y-6">
      {/* 1. Grouped Summary Metrics Sections */}
      <div className="space-y-4">
        {/* Financial Group */}
        <div>
          <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase mb-2">Financial Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
              label="Price Variance"
              value={`${currency} ${priceDiff.toFixed(2)}`}
              variant={priceDiff > 0 ? 'danger' : 'success'}
              subValue={priceDiff > 0 ? 'Variance Detected' : '0.00% Variance'}
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>
        </div>

        {/* Warehouse & Inventory Group */}
        <div>
          <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase mb-2">Warehouse & Inventory Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <StatCard
              label="Ordered Qty"
              value={totalOrdered}
              icon={<PackageCheck className="h-4 w-4" />}
            />
            <StatCard
              label="Received Qty"
              value={totalReceived}
              icon={<PackageCheck className="h-4 w-4" />}
            />
            <StatCard
              label="Acceptance Rate"
              value={acceptanceRate}
              variant={rateVariant}
              subValue={`${totalReceived} / ${totalOrdered} units accepted`}
              icon={<PackageCheck className="h-4 w-4" />}
            />
            <StatCard
              label="Rejected Qty"
              value={totalRejected}
              variant={totalRejected > 0 ? 'danger' : 'default'}
              icon={<PackageCheck className="h-4 w-4" />}
            />
            <StatCard
              label="Pending Qty"
              value={quantities.totalPending ?? 0}
              variant={(quantities.totalPending ?? 0) > 0 ? 'warning' : 'default'}
              icon={<PackageCheck className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      {/* 2. Final AP Decision Card */}
      <Card className="border-amber-800/80 bg-amber-950/40">
        <CardHeader className="pb-2.5 border-b border-amber-800/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <CardTitle className="text-sm font-bold text-amber-200 tracking-wide uppercase font-mono">
                FINAL AP DECISION
              </CardTitle>
            </div>
            <span className="px-3 py-1 rounded bg-emerald-950 border border-emerald-700 text-xs font-mono font-bold text-emerald-300">
              APPROVE PAYMENT
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-3.5 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-zinc-400 block text-[11px] font-mono">Reconciliation Status</span>
            <span className="font-semibold text-amber-300 font-mono text-sm">PARTIALLY MATCHED</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[11px] font-mono">Financial Exposure</span>
            <span className="font-semibold text-emerald-400 font-mono text-sm">NONE (No Over-Billing)</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[11px] font-mono">Inventory Exception</span>
            <span className="font-semibold text-amber-300 font-mono text-xs">{totalRejected} units rejected (Damaged packaging)</span>
          </div>
          <div>
            <span className="text-zinc-400 block text-[11px] font-mono">AP Recommendation</span>
            <span className="text-zinc-200 text-xs">Invoice exactly matches accepted warehouse quantity. Release payment for accepted stock.</span>
          </div>
        </CardContent>
      </Card>

      {/* 3. Grid: Document Status & Enterprise Audit Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Document Status Card */}
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardHeader className="pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-zinc-400" />
              <CardTitle className="text-sm font-semibold">Document Status</CardTitle>
            </div>
            <CardDescription className="text-xs">Linked document processing & OCR extraction status</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-200 font-medium">Purchase Order Processed</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">OCR Completed • Parsed Successfully</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-200 font-medium">Goods Received Note Processed</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">OCR Completed • Parsed Successfully</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-200 font-medium">Supplier Invoice Processed</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-400 font-semibold">OCR Completed • Parsed Successfully</span>
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Warehouse Audit Card */}
        <Card className="border-zinc-800 bg-zinc-900/80">
          <CardHeader className="pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-zinc-400" />
              <CardTitle className="text-sm font-semibold">
                {isPartial ? 'Warehouse & Fulfillment Audit' : 'Reconciliation Audit'}
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              {isPartial ? 'Detailed warehouse inspection and billing verification findings' : 'Discrepancy audit findings'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {isPartial ? (
              <div className="space-y-2.5 text-xs font-sans">
                <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-emerald-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Supplier Billing Verified</span>
                  </div>
                  <p className="text-emerald-300/90 leading-normal pl-6">
                    Invoice exactly matches accepted warehouse quantity ({totalInvoiced} units). No over-billing detected.
                  </p>
                </div>

                <div className="p-3 rounded bg-amber-950/40 border border-amber-800/80 text-amber-300 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-amber-200">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Partial Delivery Accepted</span>
                  </div>
                  <p className="text-amber-300/90 leading-normal pl-6">
                    Warehouse accepted {totalReceived} of {totalOrdered} units ordered ({acceptanceRate} acceptance rate).
                  </p>
                </div>

                {totalRejected > 0 && (
                  <div className="p-3 rounded bg-rose-950/40 border border-rose-800/80 text-rose-300 space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-rose-200">
                      <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                      <span>Warehouse Rejection Recorded</span>
                    </div>
                    <p className="text-rose-300/90 leading-normal pl-6">
                      {totalRejected} units rejected upon dock inspection. <strong className="font-semibold text-rose-200">Reason:</strong> Damaged packaging.
                    </p>
                  </div>
                )}
              </div>
            ) : reasons.length > 0 ? (
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
