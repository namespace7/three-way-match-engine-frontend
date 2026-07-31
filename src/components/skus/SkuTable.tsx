import React from 'react';
import { Eye, Edit2, Trash2, Database } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SKU } from '@/types/sku';

export interface SkuTableProps {
  skus: SKU[];
  isLoading: boolean;
  onView: (sku: SKU) => void;
  onEdit: (sku: SKU) => void;
  onDelete: (sku: SKU) => void;
}

export const SkuTable: React.FC<SkuTableProps> = ({
  skus,
  isLoading,
  onView,
  onEdit,
  onDelete,
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
        <Database className="h-10 w-10 text-zinc-600 mb-3" />
        <h3 className="text-sm font-semibold text-zinc-200">No SKU Records Found</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm">
          No Stock Keeping Units match your search criteria or the catalog is currently empty.
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

                  {/* Unit Price */}
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-zinc-100">
                    ${sku.unitPrice?.toFixed(2) ?? '0.00'}
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
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(sku)}
                        className="h-7 w-7 p-0"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(sku)}
                        className="h-7 w-7 p-0 text-zinc-300 hover:text-zinc-100"
                        title="Edit SKU"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(sku)}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/40"
                        title="Delete SKU"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
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
};

export default SkuTable;
