'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PriceRangeFilterProps {
  priceMin: number | null;
  priceMax: number | null;
  onPriceMinChange: (value: number | null) => void;
  onPriceMaxChange: (value: number | null) => void;
}

export function PriceRangeFilter({
  priceMin,
  priceMax,
  onPriceMinChange,
  onPriceMaxChange,
}: PriceRangeFilterProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onPriceMinChange(value ? parseFloat(value) : null);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onPriceMaxChange(value ? parseFloat(value) : null);
  };

  const handleClear = () => {
    onPriceMinChange(null);
    onPriceMaxChange(null);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">Price Range (AUD)</label>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Min"
          value={priceMin ?? ''}
          onChange={handleMinChange}
          className="w-full"
        />
        <span className="flex items-center text-gray-500">-</span>
        <Input
          type="number"
          placeholder="Max"
          value={priceMax ?? ''}
          onChange={handleMaxChange}
          className="w-full"
        />
        {(priceMin !== null || priceMax !== null) && (
          <Button variant="ghost" size="icon" onClick={handleClear} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

