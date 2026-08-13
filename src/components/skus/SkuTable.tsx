import React, { memo } from 'react';
import { Eye, Edit2, Trash2, Database, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SKU } from '@/types/sku';
import { formatINR } from '@/utils/currency';

export interface SkuTableProps {
  skus: SKU[];
  isLoading: boolean;
  onView: (sku: SKU) => void;
  onEdit: (sku: SKU) => void;
  onDelete: (sku: SKU) => void;
  onNewSku?: () => void;
}

export const SkuTable: React.FC<SkuTableProps> = memo(({
  skus,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onNewSku,
}) => {
  if (isLoading) {
    return (
      <Card className="border-zinc-800 bg-zinc-900/60 p-0 overflow-hidden">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded bg-zinc-800/60" />
          ))}
        </div>
      </Card>
    );
  }

  if (!skus || skus.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 border-dashed border-zinc-800 bg-zinc-900/40 text-center">
        <div className="p-3.5 rounded-full bg-zinc-800/80 text-zinc-300 mb-4 border border-zinc-700/60 shadow-inner">
          <Database className="h-8 w-8 text-zinc-300" />
        </div>
        <h3 className="text-base font-bold text-zinc-100 tracking-tight">No SKUs Found</h3>
        <p className="text-xs text-zinc-400 mt-1.5 max-w-md leading-relaxed">
          Create your first SKU to enable Master SKU resolution during 3-Way Match validation.
        </p>
        {onNewSku && (
          <Button
            variant="primary"
            size="sm"
            onClick={onNewSku}
            className="mt-5 gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition-all focus:ring-2 focus:ring-emerald-400 focus:outline-none cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create SKU</span>
          </Button>
        )}
        <p className="text-[11px] text-zinc-500 mt-5 font-mono">
          SKU Master is used to map ERP Codes and EAN Codes during document reconciliation.
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-zinc-800 bg-zinc-900/70 p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 font-mono">
              <th className="py-3 px-4 font-semibold">SKU Code</th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Aliases</th>
              <th className="py-3 px-4 text-right font-semibold">Unit Price</th>
              <th className="py-3 px-4 text-right font-semibold">Tolerance %</th>
              <th className="py-3 px-4 text-center font-semibold">Unit</th>
              <th className="py-3 px-4 text-center font-semibold">Status</th>
              <th className="py-3 px-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {skus.map((sku) => {
              const isActive = (sku.status || 'ACTIVE').toUpperCase() === 'ACTIVE';

              return (
                <tr key={sku.id || sku.skuCode} className="hover:bg-zinc-800/40 transition-colors">
                  {/* SKU Code */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-zinc-100">
                    {sku.skuCode}
                  </td>

                  {/* Name */}
                  <td className="py-3.5 px-4 font-medium text-zinc-200 max-w-xs truncate">
                    {sku.name}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 text-zinc-400 font-mono">
                    {sku.category || '—'}
                  </td>

                  {/* Aliases */}
                  <td className="py-3.5 px-4 font-mono text-xs">
                    {sku.aliases && sku.aliases.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {sku.aliases.map((alias, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-emerald-400 border border-zinc-700 font-mono"
                            title={alias.vendorGstin ? `Vendor: ${alias.vendorGstin}` : 'Global Alias'}
                          >
                            {alias.code}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-zinc-500">—</span>
                    )}
                  </td>

                  {/* Unit Price */}
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-zinc-100">
                    {formatINR(sku.unitPrice)}
                  </td>

                  {/* Tolerance % */}
                  <td className="py-3.5 px-4 text-right font-mono text-zinc-300">
                    {sku.tolerancePercent !== undefined ? `${sku.tolerancePercent}%` : '0.0%'}
                  </td>

                  {/* Unit of Measure */}
                  <td className="py-3.5 px-4 text-center font-mono text-zinc-300">
                    {sku.unitOfMeasure || 'EA'}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={isActive ? 'success' : 'outline'}>
                      {isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(sku)}
                        className="h-8 px-2 text-xs gap-1 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors focus:ring-1 focus:ring-zinc-400 cursor-pointer"
                        aria-label={`View SKU details for ${sku.skuCode}`}
                        title="View SKU"
                      >
                        <Eye className="h-3.5 w-3.5 text-zinc-400" />
                        <span className="hidden sm:inline">View</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(sku)}
                        className="h-8 px-2 text-xs gap-1 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition-colors focus:ring-1 focus:ring-zinc-400 cursor-pointer"
                        aria-label={`Edit SKU ${sku.skuCode}`}
                        title="Edit SKU"
                      >
                        <Edit2 className="h-3.5 w-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Edit</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(sku)}
                        className="h-8 px-2 text-xs gap-1 text-zinc-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors focus:ring-1 focus:ring-rose-500 cursor-pointer"
                        aria-label={`Delete SKU ${sku.skuCode}`}
                        title="Delete SKU"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    </div>
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

SkuTable.displayName = 'SkuTable';

export default SkuTable;
