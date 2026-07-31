import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { SkuForm } from './SkuForm';
import { SKU, CreateSKUDto } from '@/types/sku';

export interface SkuModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: SKU | null;
  onSubmit: (data: CreateSKUDto) => Promise<void>;
  isLoading?: boolean;
}

export const SkuModal: React.FC<SkuModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const isEditing = Boolean(initialData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit SKU: ${initialData?.skuCode}` : 'Create New SKU Master'}
      description={
        isEditing
          ? 'Modify unit price, tolerance, or metadata for this item.'
          : 'Define a new Stock Keeping Unit for 3-Way Match catalog matching.'
      }
    >
      <SkuForm
        initialData={initialData}
        onSubmit={onSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
};

export default SkuModal;
