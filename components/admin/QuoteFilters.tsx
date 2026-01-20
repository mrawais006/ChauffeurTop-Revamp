'use client';

import { Button } from '@/components/ui/button';
import { FilterDropdown } from './FilterDropdown';
import { DateRangePicker } from './DateRangePicker';
import { PriceRangeFilter } from './PriceRangeFilter';
import { X, Filter } from 'lucide-react';
import type { QuoteFilters } from '@/types/admin';
import { countActiveQuoteFilters, getDefaultQuoteFilters } from '@/lib/filters';

interface QuoteFiltersProps {
  filters: QuoteFilters;
  onFiltersChange: (filters: QuoteFilters) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export function QuoteFilters({
  filters,
  onFiltersChange,
  isExpanded,
  onToggleExpanded,
}: QuoteFiltersProps) {
  const activeCount = countActiveQuoteFilters(filters);

  const handleClearAll = () => {
    onFiltersChange(getDefaultQuoteFilters());
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
          <FilterDropdown
            label="Status"
            value={filters.status}
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'pending', label: 'Pending' },
              { value: 'contacted', label: 'Contacted' },
              { value: 'quoted', label: 'Quoted' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            onChange={(value) => onFiltersChange({ ...filters, status: value as any })}
          />

          <FilterDropdown
            label="Service Type"
            value={filters.serviceType}
            options={[
              { value: 'all', label: 'All Services' },
              { value: 'Point to Point', label: 'Point to Point' },
              { value: 'Airport Transfer', label: 'Airport Transfer' },
              { value: 'Hourly Booking', label: 'Hourly Booking' },
            ]}
            onChange={(value) => onFiltersChange({ ...filters, serviceType: value })}
          />

          <FilterDropdown
            label="Vehicle Type"
            value={filters.vehicleType}
            options={[
              { value: 'all', label: 'All Vehicles' },
              { value: 'Sedan', label: 'Sedan' },
              { value: 'SUV', label: 'SUV' },
              { value: 'Van', label: 'Van' },
              { value: 'Luxury', label: 'Luxury' },
            ]}
            onChange={(value) => onFiltersChange({ ...filters, vehicleType: value })}
          />

          <div className="md:col-span-2">
            <DateRangePicker
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              onDateFromChange={(date) => onFiltersChange({ ...filters, dateFrom: date })}
              onDateToChange={(date) => onFiltersChange({ ...filters, dateTo: date })}
            />
          </div>

          <PriceRangeFilter
            priceMin={filters.priceMin}
            priceMax={filters.priceMax}
            onPriceMinChange={(value) => onFiltersChange({ ...filters, priceMin: value })}
            onPriceMaxChange={(value) => onFiltersChange({ ...filters, priceMax: value })}
          />
        </div>
      )}
    </div>
  );
}

