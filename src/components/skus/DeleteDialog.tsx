import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SKU } from '@/types/sku';

export interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  sku?: SKU | null;
  isLoading?: boolean;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  sku,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete SKU Confirmation"
      description="This action cannot be undone."
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-md border border-rose-900/60 bg-rose-950/40 p-4">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300">
            Are you sure you want to delete SKU item{' '}
            <span className="font-mono font-bold text-rose-300">{sku?.skuCode}</span> ({sku?.name})?
            Future 3-Way Match parsing may fail to reconcile lines linked to this item.
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" size="md" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm} isLoading={isLoading}>
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDialog;
