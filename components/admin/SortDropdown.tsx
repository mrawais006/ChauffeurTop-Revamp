'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SortConfig, SortDirection } from '@/types/admin';

interface SortDropdownProps {
  sortConfig: SortConfig;
  onSortChange: (config: SortConfig) => void;
  options: { value: string; label: string }[];
}

export function SortDropdown({ sortConfig, onSortChange, options }: SortDropdownProps) {
  const toggleDirection = () => {
    const newDirection: SortDirection = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ ...sortConfig, direction: newDirection });
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={sortConfig.field}
        onValueChange={(value) =>
          onSortChange({ field: value as any, direction: sortConfig.direction })
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={toggleDirection}>
        {sortConfig.direction === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

