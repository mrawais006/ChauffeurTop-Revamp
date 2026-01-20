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
    <div className="space-y-3">
      <label className="block text-sm text-luxury-gold uppercase tracking-wider font-bold">
        Select Vehicle <span className="text-red-400">*</span>
      </label>
      
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full px-4 py-4 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base focus:border-luxury-gold focus:ring-2 focus:ring-luxury-gold/30 transition-all hover:border-luxury-gold min-h-[48px]">
          <SelectValue placeholder="Choose your vehicle" />
        </SelectTrigger>
        <SelectContent className="bg-white border-2 border-luxury-gold/40 text-luxury-black max-h-[320px]">
          {vehicles.map((vehicle) => (
            <SelectItem 
              key={vehicle.category} 
              value={vehicle.category}
              className="focus:bg-luxury-gold/10 focus:text-luxury-gold cursor-pointer py-3 min-h-[52px]"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-base">{vehicle.name}</span>
                <span className="text-sm text-luxury-black/70">Up to {vehicle.passengers} passengers</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {value && (
        <div className="mt-5 p-6 bg-luxury-gold/10 border-2 border-luxury-gold/30 rounded-lg animate-in fade-in slide-in-from-top-4 duration-500">
          {vehicles
            .filter((v) => v.category === value)
            .map((vehicle) => (
              <div key={vehicle.category} className="flex flex-col md:flex-row gap-6 items-center">
                {/* Vehicle Image */}
                <div className="flex-shrink-0 w-full md:w-1/3 relative aspect-[4/3] rounded-lg overflow-hidden bg-white/50">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-contain p-2 hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Vehicle Details - Senior Readable */}
                <div className="flex-1 space-y-4 w-full text-center md:text-left">
                  <div>
                    <h4 className="text-2xl font-serif text-luxury-black">{vehicle.name}</h4>
                    <p className="text-base text-luxury-gold">{vehicle.models}</p>
                  </div>
                  
                  <p className="text-base text-luxury-black/70 leading-relaxed max-w-lg">
                    {vehicle.description}
                  </p>
                  
                  <div className="flex gap-8 text-base justify-center md:justify-start pt-3 border-t border-luxury-gold/20">
                    <span className="flex items-center gap-2 text-luxury-black/80 font-medium">
                      <span className="text-luxury-gold text-xl">👥</span> {vehicle.passengers} Passengers
                    </span>
                    <span className="flex items-center gap-2 text-luxury-black/80 font-medium">
                      <span className="text-luxury-gold text-xl">🧳</span> {vehicle.luggage} Luggage
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

