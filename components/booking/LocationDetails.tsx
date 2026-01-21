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
  pickupPrePopulated?: boolean;
  destinationPrePopulated?: boolean;
}

export default function LocationDetails({
  pickup,
  destinations,
  onPickupChange,
  onDestinationChange,
  onAddDestination,
  onRemoveDestination,
  canAddMoreDestinations,
  pickupPrePopulated,
  destinationPrePopulated,
}: LocationDetailsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-serif text-luxury-black border-b-2 border-luxury-gold/30 pb-3">Trip Details</h3>
      
      {/* Pickup Location with Autocomplete - Senior Accessible */}
      <div className={pickupPrePopulated ? 'ring-2 ring-luxury-gold/50 rounded-lg p-2 -m-2' : ''}>
        <label htmlFor="pickup" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
          Pickup Location <span className="text-red-400">*</span>
        </label>
        <AddressAutocomplete
          id="pickup"
          name="pickup_location"
          placeholder=""
          defaultValue={pickup}
          required
          onAddressSelect={onPickupChange}
        />
        {pickupPrePopulated && (
          <p className="text-xs text-luxury-gold mt-1">Pre-filled from your selection</p>
        )}
      </div>

      {/* Destinations with Autocomplete - Senior Accessible */}
      <div className="space-y-4">
        <label className="block text-sm text-luxury-gold uppercase tracking-wider font-bold">
          Destination(s) <span className="text-red-400">*</span>
        </label>
        
        {destinations.map((dest, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-1">
              <AddressAutocomplete
                id={`destination-${index}`}
                name={`destination_${index}`}
                placeholder=""
                defaultValue={dest.address}
                required
                onAddressSelect={(address) => onDestinationChange(index, address)}
              />
            </div>
            {destinations.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveDestination(index)}
                className="px-5 py-3 bg-red-500/20 text-red-700 rounded-md hover:bg-red-500/30 transition-colors border-2 border-red-500/40 min-h-[48px] text-lg font-bold"
                aria-label={`Remove destination ${index + 1}`}
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
            className="mt-3 px-6 py-3 bg-luxury-gold/20 text-luxury-gold rounded-md hover:bg-luxury-gold/30 transition-colors text-base font-bold border-2 border-luxury-gold/40 min-h-[48px]"
          >
            + Add Another Destination (Max 4)
          </button>
        )}
      </div>
    </div>
  );
}

