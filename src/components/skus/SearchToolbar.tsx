import React from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SkuFilterState } from '@/types/sku';

export interface SearchToolbarProps {
  filters: SkuFilterState;
  onFilterChange: (newFilters: SkuFilterState) => void;
  onRefresh: () => void;
  onNewSku: () => void;
  isRefreshing?: boolean;
}

const statusOptions = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'ACTIVE', label: 'Active Only' },
  { value: 'INACTIVE', label: 'Inactive Only' },
];

export const SearchToolbar: React.FC<SearchToolbarProps> = ({
  filters,
  onFilterChange,
  onRefresh,
  onNewSku,
  isRefreshing = false,
}) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search by Code */}
        <div className="relative flex-1">
          <Input
            placeholder="Search by SKU Code..."
            value={filters.searchCode}
            onChange={(e) => onFilterChange({ ...filters, searchCode: e.target.value })}
            className="pl-9"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
        </div>

        {/* Search by Name */}
        <div className="relative flex-1">
          <Input
            placeholder="Search by Name..."
            value={filters.searchName}
            onChange={(e) => onFilterChange({ ...filters, searchName: e.target.value })}
            className="pl-9"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500 pointer-events-none" />
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-44">
          <Select
            value={filters.status}
            options={statusOptions}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE',
              })
            }
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="md"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-1.5 shrink-0"
          title="Refresh SKU catalog"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onNewSku}
          className="gap-1.5 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New SKU</span>
        </Button>
      </div>
    </div>
  );
};

export default SearchToolbar;
