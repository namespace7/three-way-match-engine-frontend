'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SKU, CreateSKUDto, UpdateSKUDto, SkuFilterState } from '@/types/sku';
import { getSkus, createSku, updateSku, deleteSku } from '@/services/skuService';
import { SearchToolbar } from '@/components/skus/SearchToolbar';
import { SkuTable } from '@/components/skus/SkuTable';
import { SkuModal } from '@/components/skus/SkuModal';
import { DeleteDialog } from '@/components/skus/DeleteDialog';

export default function SKUsPage() {
  const queryClient = useQueryClient();

  // Filter state
  const [filters, setFilters] = useState<SkuFilterState>({
    searchCode: '',
    searchName: '',
    status: 'ALL',
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSku, setEditingSku] = useState<SKU | null>(null);

  // View Modal state
  const [viewSku, setViewSku] = useState<SKU | null>(null);

  // Delete Dialog state
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [deletingSku, setDeletingSku] = useState<SKU | null>(null);

  // TanStack Query: Fetch SKUs
  const {
    data: skus = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['skus'],
    queryFn: getSkus,
  });

  // Mutation: Create SKU
  const createMutation = useMutation({
    mutationFn: createSku,
    onSuccess: () => {
      toast.success('SKU created successfully');
      queryClient.invalidateQueries({ queryKey: ['skus'] });
      setIsModalOpen(false);
      setEditingSku(null);
    },
    onError: (err: unknown) => {
      let msg = 'Failed to create SKU.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
        msg = axiosErr.response?.data?.message || axiosErr.response?.data?.error || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(msg);
    },
  });

  // Mutation: Update SKU
  const updateMutation = useMutation({
    mutationFn: updateSku,
    onSuccess: () => {
      toast.success('SKU updated successfully');
      queryClient.invalidateQueries({ queryKey: ['skus'] });
      setIsModalOpen(false);
      setEditingSku(null);
    },
    onError: (err: unknown) => {
      let msg = 'Failed to update SKU.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
        msg = axiosErr.response?.data?.message || axiosErr.response?.data?.error || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(msg);
    },
  });

  // Mutation: Delete SKU
  const deleteMutation = useMutation({
    mutationFn: deleteSku,
    onSuccess: () => {
      toast.success('SKU deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['skus'] });
      setIsDeleteOpen(false);
      setDeletingSku(null);
    },
    onError: (err: unknown) => {
      let msg = 'Failed to delete SKU.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string; error?: string } } };
        msg = axiosErr.response?.data?.message || axiosErr.response?.data?.error || msg;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      toast.error(msg);
    },
  });

  // Filtered SKUs
  const filteredSkus = useMemo(() => {
    return skus.filter((sku) => {
      const codeMatch =
        !filters.searchCode ||
        sku.skuCode.toLowerCase().includes(filters.searchCode.toLowerCase());

      const nameMatch =
        !filters.searchName ||
        sku.name.toLowerCase().includes(filters.searchName.toLowerCase());

      const statusMatch =
        filters.status === 'ALL' ||
        (filters.status === 'ACTIVE' && (sku.status || 'ACTIVE').toUpperCase() === 'ACTIVE') ||
        (filters.status === 'INACTIVE' && (sku.status || 'ACTIVE').toUpperCase() === 'INACTIVE');

      return codeMatch && nameMatch && statusMatch;
    });
  }, [skus, filters]);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingSku(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sku: SKU) => {
    setEditingSku(sku);
    setIsModalOpen(true);
  };

  const handleOpenDeleteDialog = (sku: SKU) => {
    setDeletingSku(sku);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (dto: CreateSKUDto) => {
    if (editingSku) {
      const updateDto: UpdateSKUDto = { ...dto };
      await updateMutation.mutateAsync({ id: editingSku.id || editingSku.skuCode, dto: updateDto });
    } else {
      await createMutation.mutateAsync(dto);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingSku) {
      await deleteMutation.mutateAsync(deletingSku.id || deletingSku.skuCode);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b border-zinc-800 pb-5">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">SKU Master Catalog</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Manage Stock Keeping Units, prices, and unit tolerances for 3-Way Match validation.
            </p>
          </div>

          {/* Search & Filter Toolbar */}
          <SearchToolbar
            filters={filters}
            onFilterChange={setFilters}
            onRefresh={() => refetch()}
            onNewSku={handleOpenCreateModal}
            isRefreshing={isRefetching}
          />

          {/* Error State */}
          {isError ? (
            <Card className="border-rose-900 bg-rose-950/20 p-6 text-center space-y-3">
              <div className="flex justify-center text-rose-400">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h2 className="text-sm font-semibold text-rose-300">Failed to Load SKU Catalog</h2>
              <p className="text-xs text-rose-400/80 max-w-md mx-auto">
                {error instanceof Error ? error.message : 'Unable to connect to backend SKU master service.'}
              </p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
                Retry Connection
              </Button>
            </Card>
          ) : (
            /* Main SKU Table */
            <SkuTable
              skus={filteredSkus}
              isLoading={isLoading}
              onView={(sku) => setViewSku(sku)}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteDialog}
            />
          )}

          {/* Create & Edit SKU Modal */}
          <SkuModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingSku(null);
            }}
            initialData={editingSku}
            onSubmit={handleFormSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />

          {/* Delete SKU Confirmation Dialog */}
          <DeleteDialog
            isOpen={isDeleteOpen}
            onClose={() => {
              setIsDeleteOpen(false);
              setDeletingSku(null);
            }}
            onConfirm={handleDeleteConfirm}
            sku={deletingSku}
            isLoading={deleteMutation.isPending}
          />

          {/* View SKU Details Modal */}
          {viewSku && (
            <Modal
              isOpen={Boolean(viewSku)}
              onClose={() => setViewSku(null)}
              title={`SKU Details: ${viewSku.skuCode}`}
              description="Catalog item specifications"
            >
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 p-3 rounded bg-zinc-950 border border-zinc-800">
                  <div>
                    <span className="text-zinc-500 font-mono">SKU Code</span>
                    <p className="font-semibold text-zinc-100 font-mono mt-0.5">{viewSku.skuCode}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-mono">Status</span>
                    <p className="font-semibold text-zinc-100 font-mono mt-0.5">{viewSku.status}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-mono">Name</span>
                    <p className="font-semibold text-zinc-100 mt-0.5">{viewSku.name}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-mono">Category</span>
                    <p className="font-semibold text-zinc-100 mt-0.5">{viewSku.category || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-mono">Unit Price</span>
                    <p className="font-semibold text-zinc-100 font-mono mt-0.5">${viewSku.unitPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-mono">Unit of Measure</span>
                    <p className="font-semibold text-zinc-100 font-mono mt-0.5">{viewSku.unitOfMeasure}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-mono">Tolerance</span>
                    <p className="font-semibold text-zinc-100 font-mono mt-0.5">{viewSku.tolerancePercent ?? 0}%</p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button variant="outline" size="sm" onClick={() => setViewSku(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
