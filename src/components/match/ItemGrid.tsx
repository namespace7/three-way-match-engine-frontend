import React, { memo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MatchItem } from '@/types/match';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

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
    return `${currency} ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <Card className="border-zinc-800 bg-zinc-900/70 p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 font-mono">
              <th className="py-3 px-4 font-semibold">SKU Code</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              {(type === 'all' || type === 'po') && <th className="py-3 px-4 text-right font-semibold">PO Qty</th>}
              {(type === 'all' || type === 'po') && <th className="py-3 px-4 text-right font-semibold">PO Unit Price</th>}
              {(type === 'all' || type === 'delivery') && <th className="py-3 px-4 text-right font-semibold">Received Qty</th>}
              {(type === 'all' || type === 'delivery') && <th className="py-3 px-4 text-right font-semibold">Rejected Qty</th>}
              {(type === 'all' || type === 'fulfillment') && <th className="py-3 px-4 text-right font-semibold">Invoice Qty</th>}
              {(type === 'all' || type === 'fulfillment') && <th className="py-3 px-4 text-right font-semibold">Invoice Unit Price</th>}
              <th className="py-3 px-4 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {items.map((item, idx) => {
              const hasDiscrepancy =
                item.isDiscrepancy ||
                item.matched === false ||
                (item.discrepancies && item.discrepancies.length > 0);

              const reasons = item.discrepancies || item.reasonCodes || [];

              return (
                <tr
                  key={item.id || item.skuCode || idx}
                  className={cn(
                    'transition-colors',
                    hasDiscrepancy
                      ? 'bg-rose-950/20 hover:bg-rose-950/30 border-l-4 border-l-rose-600'
                      : 'hover:bg-zinc-800/40 border-l-4 border-l-emerald-600/40'
                  )}
                >
                  {/* SKU Code */}
                  <td className="py-3.5 px-4 font-mono font-medium text-zinc-100">
                    {item.skuCode}
                  </td>

                  {/* Description & Mismatch details */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="font-medium text-zinc-200">{item.skuName || item.description || 'Standard Item'}</div>
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

                  {/* PO Qty */}
                  {(type === 'all' || type === 'po') && (
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {item.poQuantity ?? '—'}
                    </td>
                  )}

                  {/* PO Unit Price */}
                  {(type === 'all' || type === 'po') && (
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {formatPrice(item.poUnitPrice)}
                    </td>
                  )}

                  {/* Received Qty */}
                  {(type === 'all' || type === 'delivery') && (
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {item.grnQuantity ?? '—'}
                    </td>
                  )}

                  {/* Rejected Qty */}
                  {(type === 'all' || type === 'delivery') && (
                    <td className="py-3.5 px-4 text-right font-mono text-rose-400">
                      {item.grnRejectedQuantity ?? 0}
                    </td>
                  )}

                  {/* Invoice Qty */}
                  {(type === 'all' || type === 'fulfillment') && (
                    <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                      {item.invoiceQuantity ?? '—'}
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
