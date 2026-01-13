'use client';

import Image from 'next/image';
import { vehicles } from '@/lib/vehicles';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VehicleSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function VehicleSelect({ value, onChange }: VehicleSelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold">
        Select Vehicle <span className="text-red-400">*</span>
      </label>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full px-4 py-6 bg-white/5 border border-white/10 rounded text-white focus:border-luxury-gold focus:ring-0 transition-all hover:bg-white/10">
          <SelectValue placeholder="Choose your vehicle" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-white/10 text-white max-h-[300px]">
          {vehicles.map((vehicle) => (
            <SelectItem 
              key={vehicle.category} 
              value={vehicle.category}
              className="focus:bg-white/10 focus:text-luxury-gold cursor-pointer py-3"
            >
              <div className="flex flex-col">
                <span className="font-semibold">{vehicle.name}</span>
                <span className="text-xs text-white/50">Up to {vehicle.passengers} passengers</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {value && (
        <div className="mt-4 p-5 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-lg animate-in fade-in slide-in-from-top-4 duration-500">
          {vehicles
            .filter((v) => v.category === value)
            .map((vehicle) => (
              <div key={vehicle.category} className="flex flex-col md:flex-row gap-6 items-center">
                {/* Vehicle Image */}
                <div className="flex-shrink-0 w-full md:w-1/3 relative aspect-[4/3] rounded-lg overflow-hidden bg-black/20">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-contain p-2 hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Vehicle Details */}
                <div className="flex-1 space-y-3 w-full text-center md:text-left">
                  <div>
                    <h4 className="text-xl font-serif text-white">{vehicle.name}</h4>
                    <p className="text-sm text-luxury-gold/80">{vehicle.models}</p>
                  </div>
                  
                  <p className="text-sm text-white/60 leading-relaxed max-w-lg">
                    {vehicle.description}
                  </p>
                  
                  <div className="flex gap-6 text-sm justify-center md:justify-start pt-2 border-t border-white/5">
                    <span className="flex items-center gap-2 text-white/70">
                      <span className="text-luxury-gold">👥</span> {vehicle.passengers} Passengers
                    </span>
                    <span className="flex items-center gap-2 text-white/70">
                      <span className="text-luxury-gold">🧳</span> {vehicle.luggage} Luggage
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

