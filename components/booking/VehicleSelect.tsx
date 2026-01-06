'use client';

import Image from 'next/image';
import { vehicles } from '@/lib/vehicles';

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
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white focus:border-luxury-gold focus:outline-none transition-all"
      >
        <option value="" className="bg-black text-white">Choose your vehicle</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.category} value={vehicle.category} className="bg-black text-white">
            {vehicle.name} - Up to {vehicle.passengers} passengers
          </option>
        ))}
      </select>
      
      {value && (
        <div className="mt-3 p-4 bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg">
          {vehicles
            .filter((v) => v.category === value)
            .map((vehicle) => (
              <div key={vehicle.category} className="flex flex-col md:flex-row gap-4">
                {/* Vehicle Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    width={200}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                </div>
                
                {/* Vehicle Details */}
                <div className="flex-1">
                  <p className="font-semibold text-white text-lg">{vehicle.name}</p>
                  <p className="text-sm text-white/70 mt-1">{vehicle.models}</p>
                  <p className="text-sm text-white/70 mt-2">{vehicle.description}</p>
                  <div className="mt-3 flex gap-4 text-sm">
                    <span className="text-luxury-gold">
                      👥 {vehicle.passengers} passengers
                    </span>
                    <span className="text-luxury-gold">
                      🧳 {vehicle.luggage} luggage
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

