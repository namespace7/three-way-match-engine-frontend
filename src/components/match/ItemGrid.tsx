import React, { memo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MatchItem } from '@/types/match';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, PackageCheck } from 'lucide-react';

import { formatCurrency } from '@/utils/currency';

export interface ItemGridProps {
  items: MatchItem[];
  type?: 'po' | 'delivery' | 'fulfillment' | 'all';
  currency?: string;
}

export const ItemGrid: React.FC<ItemGridProps> = memo(({
  items,
  type = 'all',
  currency = 'INR',
}) => {
  if (!items || items.length === 0) {
    return (
      <Card className="p-8 text-center border-zinc-800 bg-zinc-900/40">
        <p className="text-xs text-zinc-400">No line items recorded for this document.</p>
      </Card>
    );
  }

  const formatPrice = (val?: number) => {
    if (val === undefined || val === null) return '—';
    return formatCurrency(val, currency === 'INR' ? 'INR ' : `${currency} `);
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/70 p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 font-mono">
              <th className="py-3 px-4 font-semibold whitespace-nowrap">SKU Code</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              {(type === 'all' || type === 'po' || type === 'delivery') && <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Ordered Qty</th>}
              {(type === 'all' || type === 'po') && <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">PO Unit Price</th>}
              {(type === 'all' || type === 'delivery') && <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Received Qty</th>}
              {(type === 'all' || type === 'delivery') && <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Rejected Qty</th>}
              {(type === 'all' || type === 'delivery') && <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Pending Qty</th>}
              {(type === 'all' || type === 'fulfillment') && <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Invoice Qty</th>}
              {(type === 'all' || type === 'fulfillment') && <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Invoice Unit Price</th>}
              <th className="py-3 px-4 text-center font-semibold whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {items.map((item, idx) => {
              const hasDiscrepancy =
                item.isDiscrepancy ||
                item.matched === false ||
                (item.discrepancies && item.discrepancies.length > 0);

              const reasons = item.discrepancies || item.reasonCodes || [];
              const ordered = item.poQuantity ?? item.orderedQuantity ?? 0;
              const received = item.grnQuantity ?? item.receivedQuantity ?? 0;
              const rejected = item.grnRejectedQuantity ?? item.rejectedQuantity ?? 0;
              const pending = item.pendingQuantity ?? Math.max(0, ordered - received - rejected);
              const rejectionReason = item.rejectionReason;

              const isPartialDelivery = !hasDiscrepancy && (received < ordered || rejected > 0);

              return (
                <tr
                  key={item.id || item.skuCode || item.sku || idx}
                  className={cn(
                    'transition-colors',
                    hasDiscrepancy
                      ? 'bg-rose-950/20 hover:bg-rose-950/30 border-l-4 border-l-rose-600'
                      : isPartialDelivery
                      ? 'bg-amber-950/10 hover:bg-amber-950/20 border-l-4 border-l-amber-500'
                      : 'hover:bg-zinc-800/40 border-l-4 border-l-emerald-600/40'
                  )}
                >
                  {/* SKU Code */}
                  <td className="py-3.5 px-4 font-mono font-medium text-zinc-100">
                    {item.skuCode || item.sku}
                  </td>

                  {/* Description & Mismatch / Rejection details */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-medium text-zinc-200">{item.skuName || item.description || 'Standard Item'}</div>
                    {(type === 'delivery' || type === 'all') && rejectionReason && (
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-1 rounded bg-amber-950/80 border border-amber-800/80 px-1.5 py-0.5 text-[10px] text-amber-300 font-mono">
                          <span>Reason: {rejectionReason}</span>
                        </span>
                      </div>
                    )}
                    {hasDiscrepancy && reasons.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {reasons.map((reason, rIdx) => (
                          <span
                            key={rIdx}
                            className="inline-flex items-center gap-1 rounded bg-rose-950 border border-rose-800 px-1.5 py-0.5 text-[10px] text-rose-300 font-mono"
                          >
                            <AlertCircle className="h-2.5 w-2.5 text-rose-400 shrink-0" />
                            <span>{reason}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Ordered Qty */}
                  {(type === 'all' || type === 'po' || type === 'delivery') && (
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {ordered}
                    </td>
                  )}

                  {/* PO Unit Price */}
                  {(type === 'all' || type === 'po') && (
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {formatPrice(item.poUnitPrice ?? item.orderedPrice)}
                    </td>
                  )}

                  {/* Received Qty */}
                  {(type === 'all' || type === 'delivery') && (
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {received}
                    </td>
                  )}

                  {/* Rejected Qty */}
                  {(type === 'all' || type === 'delivery') && (
                    <td className="py-3.5 px-4 text-right font-mono text-rose-400 font-semibold">
                      {rejected}
                    </td>
                  )}

                  {/* Pending Qty */}
                  {(type === 'all' || type === 'delivery') && (
                    <td className="py-3.5 px-4 text-right font-mono text-amber-400">
                      {pending}
                    </td>
                  )}

                  {/* Invoice Qty */}
                  {(type === 'all' || type === 'fulfillment') && (
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {item.invoiceQuantity ?? item.invoicedQuantity ?? '—'}
                    </td>
                  )}

                  {/* Invoice Unit Price */}
                  {(type === 'all' || type === 'fulfillment') && (
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {formatPrice(item.invoiceUnitPrice)}
                    </td>
                  )}

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {hasDiscrepancy ? (
                      <Badge variant="error" className="inline-flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>DISCREPANCY</span>
                      </Badge>
                    ) : type === 'fulfillment' ? (
                      <Badge variant="success" className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>MATCHED</span>
                      </Badge>
                    ) : type === 'po' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-[11px] text-zinc-300 font-mono font-semibold">
                        <PackageCheck className="h-3 w-3 text-zinc-400" />
                        <span>ORDERED</span>
                      </span>
                    ) : isPartialDelivery ? (
                      <Badge variant="warning" className="inline-flex items-center gap-1 border-amber-800/80 bg-amber-950/80 text-amber-300 font-mono">
                        <AlertCircle className="h-3 w-3 text-amber-400" />
                        <span>PARTIAL DELIVERY</span>
                      </Badge>
                    ) : (
                      <Badge variant="success" className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>MATCHED</span>
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
});

ItemGrid.displayName = 'ItemGrid';

export default ItemGrid;
