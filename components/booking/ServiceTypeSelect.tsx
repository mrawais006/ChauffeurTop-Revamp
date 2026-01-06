'use client';

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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white focus:border-luxury-gold focus:outline-none transition-all"
      >
        <option value="" className="bg-black text-white">Select a service type</option>
        {serviceTypes.map((type) => (
          <option key={type.value} value={type.value} className="bg-black text-white">
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}

