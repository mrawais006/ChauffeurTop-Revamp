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
    <div className="space-y-2">
      <label className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold">
        Service Type <span className="text-red-400">*</span>
      </label>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full px-4 py-6 bg-white/5 border border-white/10 rounded text-white focus:border-luxury-gold focus:ring-0 transition-all hover:bg-white/10">
          <SelectValue placeholder="Select a service type" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10 text-white">
          {serviceTypes.map((type) => (
            <SelectItem 
              key={type.value} 
              value={type.value}
              className="focus:bg-white/10 focus:text-luxury-gold cursor-pointer"
            >
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

