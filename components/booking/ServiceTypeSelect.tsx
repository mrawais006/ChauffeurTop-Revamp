'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ServiceTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ServiceTypeSelect({ value, onChange }: ServiceTypeSelectProps) {
  const serviceTypes = [
    { value: 'Airport Transfer', label: 'Airport Transfer' },
    { value: 'Corporate Travel', label: 'Corporate Travel' },
    { value: 'Special Events', label: 'Special Events' },
    { value: 'Winery Tours', label: 'Winery Tours' },
    { value: 'Point to Point', label: 'Point to Point' },
    { value: 'Hourly Charter', label: 'Hourly Charter' },
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm text-luxury-gold uppercase tracking-wider font-bold">
        Service Type <span className="text-red-400">*</span>
      </label>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full px-4 py-4 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 transition-all hover:border-luxury-gold min-h-[48px]">
          <SelectValue placeholder="Select a service type" />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-luxury-gold/40 text-luxury-black">
          {serviceTypes.map((type) => (
            <SelectItem 
              key={type.value} 
              value={type.value}
              className="focus:bg-luxury-gold/10 focus:text-luxury-gold cursor-pointer py-3 text-base min-h-[44px]"
            >
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

