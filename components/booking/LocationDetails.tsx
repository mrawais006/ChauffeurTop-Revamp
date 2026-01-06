'use client';

import AddressAutocomplete from '@/components/maps/AddressAutocomplete';
import { FormDestination } from '@/types/booking';

interface LocationDetailsProps {
  pickup: string;
  destinations: FormDestination[];
  onPickupChange: (value: string) => void;
  onDestinationChange: (index: number, value: string) => void;
  onAddDestination: () => void;
  onRemoveDestination: (index: number) => void;
  canAddMoreDestinations: boolean;
}

export default function LocationDetails({
  pickup,
  destinations,
  onPickupChange,
  onDestinationChange,
  onAddDestination,
  onRemoveDestination,
  canAddMoreDestinations,
}: LocationDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-serif text-white border-b border-white/10 pb-2">Trip Details</h3>
      
      {/* Pickup Location with Autocomplete */}
      <div>
        <label htmlFor="pickup" className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold mb-2">
          Pickup Location <span className="text-red-400">*</span>
        </label>
        <AddressAutocomplete
          id="pickup"
          name="pickup_location"
          placeholder="Enter pickup address (e.g., 123 Collins St, Melbourne)"
          defaultValue={pickup}
          required
          onAddressSelect={onPickupChange}
        />
      </div>

      {/* Destinations with Autocomplete */}
      <div className="space-y-3">
        <label className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold">
          Destination(s) <span className="text-red-400">*</span>
        </label>
        
        {destinations.map((dest, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <AddressAutocomplete
                id={`destination-${index}`}
                name={`destination_${index}`}
                placeholder={`Destination ${index + 1} (e.g., Melbourne Airport)`}
                defaultValue={dest.address}
                required
                onAddressSelect={(address) => onDestinationChange(index, address)}
              />
            </div>
            {destinations.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveDestination(index)}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors border border-red-500/30"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {canAddMoreDestinations && (
          <button
            type="button"
            onClick={onAddDestination}
            className="mt-2 px-4 py-2 bg-luxury-gold/10 text-luxury-gold rounded hover:bg-luxury-gold/20 transition-colors text-sm font-semibold border border-luxury-gold/30"
          >
            + Add Another Destination (Max 4)
          </button>
        )}
      </div>
    </div>
  );
}

