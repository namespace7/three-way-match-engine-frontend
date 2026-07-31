import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SKU, CreateSKUDto } from '@/types/sku';

const skuFormSchema = z.object({
  skuCode: z.string().min(1, 'SKU Code is required'),
  name: z.string().min(1, 'Name is required'),
  category: z.string().optional(),
  unitPrice: z.number({ message: 'Unit Price must be a valid number' }).min(0, 'Unit Price must be >= 0'),
  tolerancePercent: z.number({ message: 'Tolerance must be a valid number' }).min(0, 'Tolerance must be >= 0').optional(),
  unitOfMeasure: z.string().min(1, 'Unit of Measure is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
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
    handleSubmit,
    formState: { errors },
  } = useForm<SkuFormData>({
    resolver: zodResolver(skuFormSchema),
    defaultValues: {
      skuCode: initialData?.skuCode || '',
      name: initialData?.name || '',
      category: initialData?.category || '',
      unitPrice: initialData?.unitPrice ?? 0,
      tolerancePercent: initialData?.tolerancePercent ?? 0,
      unitOfMeasure: initialData?.unitOfMeasure || 'EA',
      status: initialData?.status || 'ACTIVE',
    },
  });

  const handleFormSubmit = async (data: SkuFormData) => {
    await onSubmit({
      skuCode: data.skuCode,
      name: data.name,
      category: data.category,
      unitPrice: data.unitPrice,
      tolerancePercent: data.tolerancePercent ?? 0,
      unitOfMeasure: data.unitOfMeasure,
      status: data.status,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="SKU Code *"
          placeholder="e.g. SKU-1001"
          disabled={isEditing || isLoading}
          {...register('skuCode')}
          error={errors.skuCode?.message}
        />

        <Input
          label="SKU Name *"
          placeholder="e.g. Industrial Bolt M8"
          disabled={isLoading}
          {...register('name')}
          error={errors.name?.message}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Category"
          placeholder="e.g. Fasteners"
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
          label="Unit Price *"
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
