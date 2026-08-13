import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SKU, CreateSKUDto } from '@/types/sku';

const aliasFormSchema = z.object({
  code: z.string().trim().min(1, 'External Item Code is required'),
  vendorGstin: z.string().trim().optional(),
});

const skuFormSchema = z
  .object({
    skuCode: z.string().min(1, 'SKU Code is required'),
    name: z.string().min(1, 'Name is required'),
    category: z.string().optional(),
    unitPrice: z.number({ message: 'Unit Price must be a valid number' }).min(0, 'Unit Price must be >= 0'),
    tolerancePercent: z.number({ message: 'Tolerance must be a valid number' }).min(0, 'Tolerance must be >= 0').optional(),
    unitOfMeasure: z.string().min(1, 'Unit of Measure is required'),
    status: z.enum(['ACTIVE', 'INACTIVE']),
    aliases: z.array(aliasFormSchema).optional().default([]),
  })
  .superRefine((data, ctx) => {
    if (data.aliases && data.aliases.length > 0) {
      const seen = new Set<string>();
      data.aliases.forEach((alias, index) => {
        const cleanCode = alias.code.trim().toUpperCase();
        const cleanGstin = (alias.vendorGstin || '').trim().toUpperCase();
        const uniqueKey = `${cleanCode}::${cleanGstin}`;

        if (seen.has(uniqueKey)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Duplicate alias "${cleanCode}" for vendor "${cleanGstin || 'GLOBAL'}"`,
            path: ['aliases', index, 'code'],
          });
        }
        seen.add(uniqueKey);
      });
    }
  });

export type SkuFormData = z.infer<typeof skuFormSchema>;

export interface SkuFormProps {
  initialData?: SKU | null;
  onSubmit: (data: CreateSKUDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const statusFormOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

export const SkuForm: React.FC<SkuFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditing = Boolean(initialData);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SkuFormData>({
    resolver: zodResolver(skuFormSchema),
    defaultValues: {
      skuCode: initialData?.skuCode || '',
      name: initialData?.name || '',
      category: initialData?.category || '',
      unitPrice: initialData?.unitPrice ?? 0,
      tolerancePercent: initialData?.tolerancePercent ?? initialData?.priceTolerance ? (initialData.priceTolerance * 100) : 0,
      unitOfMeasure: initialData?.unitOfMeasure || initialData?.unit || 'EA',
      status: (initialData?.status || (initialData?.isActive === false ? 'INACTIVE' : 'ACTIVE')) as 'ACTIVE' | 'INACTIVE',
      aliases: initialData?.aliases?.map((a) => ({
        code: a.code,
        vendorGstin: a.vendorGstin || '',
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'aliases',
  });

  const handleFormSubmit = async (data: SkuFormData) => {
    const formattedAliases = (data.aliases || [])
      .filter((a) => a.code.trim().length > 0)
      .map((a) => ({
        code: a.code.trim().toUpperCase(),
        vendorGstin: a.vendorGstin?.trim() ? a.vendorGstin.trim().toUpperCase() : null,
      }));

    await onSubmit({
      skuCode: data.skuCode.trim().toUpperCase(),
      name: data.name.trim(),
      category: data.category?.trim(),
      unitPrice: data.unitPrice,
      tolerancePercent: data.tolerancePercent ?? 0,
      unitOfMeasure: data.unitOfMeasure.trim().toUpperCase(),
      status: data.status,
      aliases: formattedAliases,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="SKU Code *"
          placeholder="e.g. MOMOS-VEG-24"
          disabled={isEditing || isLoading}
          {...register('skuCode')}
          error={errors.skuCode?.message}
        />

        <Input
          label="SKU Name *"
          placeholder="e.g. Cheesy Spicy Veg Momos 24Pcs"
          disabled={isLoading}
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Category"
          placeholder="e.g. Frozen Foods"
          disabled={isLoading}
          {...register('category')}
          error={errors.category?.message}
        />

        <Input
          label="Unit of Measure *"
          placeholder="e.g. EA, KG, BOX"
          disabled={isLoading}
          {...register('unitOfMeasure')}
          error={errors.unitOfMeasure?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Unit Price (₹) *"
          type="number"
          step="0.01"
          placeholder="0.00"
          disabled={isLoading}
          {...register('unitPrice', { valueAsNumber: true })}
          error={errors.unitPrice?.message}
        />

        <Input
          label="Tolerance %"
          type="number"
          step="0.1"
          placeholder="0.0"
          disabled={isLoading}
          {...register('tolerancePercent', { valueAsNumber: true })}
          error={errors.tolerancePercent?.message}
        />

        <Select
          label="Status *"
          options={statusFormOptions}
          disabled={isLoading}
          {...register('status')}
          error={errors.status?.message}
        />
      </div>

      {/* Aliases Management Section */}
      <div className="pt-3 border-t border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              External Code Aliases
            </h4>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ code: '', vendorGstin: '' })}
            disabled={isLoading}
            className="text-xs gap-1.5 border-zinc-700 text-zinc-200 hover:bg-zinc-800"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Alias</span>
          </Button>
        </div>

        <p className="text-[11px] text-zinc-400">
          Map vendor/ERP item codes (e.g., PO code <code className="font-mono text-zinc-300">11423</code> or Invoice code <code className="font-mono text-zinc-300">FG-P-F-0503</code>) to this canonical SKU.
        </p>

        {fields.length === 0 ? (
          <div className="p-3 text-center rounded border border-dashed border-zinc-800 bg-zinc-950/40 text-xs text-zinc-500 font-mono">
            No external aliases mapped. Click &quot;Add Alias&quot; to configure PO / Invoice code resolution.
          </div>
        ) : (
          <div className="space-y-2.5">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-end gap-2.5 bg-zinc-950 p-2.5 rounded border border-zinc-800">
                <div className="flex-1">
                  <Input
                    label="External Code *"
                    placeholder="e.g. 11423 or FG-P-F-0503"
                    disabled={isLoading}
                    {...register(`aliases.${index}.code` as const)}
                    error={errors.aliases?.[index]?.code?.message}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Vendor GSTIN (Optional)"
                    placeholder="e.g. 27ABACA2423J1Z0"
                    disabled={isLoading}
                    {...register(`aliases.${index}.vendorGstin` as const)}
                    error={errors.aliases?.[index]?.vendorGstin?.message}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  disabled={isLoading}
                  className="h-9 px-2 text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 border border-zinc-800 shrink-0"
                  title="Remove alias"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
        <Button type="button" variant="outline" size="md" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
          {isEditing ? 'Update SKU' : 'Create SKU'}
        </Button>
      </div>
    </form>
  );
};

export default SkuForm;
