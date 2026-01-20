'use client';

import { Button } from '@/components/ui/button';
import { FilterDropdown } from './FilterDropdown';
import { DateRangePicker } from './DateRangePicker';
import { X, Filter } from 'lucide-react';
import type { ContactFilters } from '@/types/admin';
import { countActiveContactFilters, getDefaultContactFilters } from '@/lib/filters';

interface ContactFiltersComponentProps {
  filters: ContactFilters;
  onFiltersChange: (filters: ContactFilters) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export function ContactFiltersComponent({
  filters,
  onFiltersChange,
  isExpanded,
  onToggleExpanded,
}: ContactFiltersComponentProps) {
  const activeCount = countActiveContactFilters(filters);

  const handleClearAll = () => {
    onFiltersChange(getDefaultContactFilters());
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onToggleExpanded}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </Button>

        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="gap-2">
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border">
          <FilterDropdown
            label="Status"
            value={filters.status}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'resolved', label: 'Resolved' },
            ]}
            onChange={(value) => onFiltersChange({ ...filters, status: value as any })}
          />

          <DateRangePicker
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            onDateFromChange={(date) => onFiltersChange({ ...filters, dateFrom: date })}
            onDateToChange={(date) => onFiltersChange({ ...filters, dateTo: date })}
          />
        </div>
      )}
    </div>
  );
}

