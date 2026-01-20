'use client';

interface ReturnTripToggleProps {
  needsReturnTrip: boolean;
  onToggle: (value: boolean) => void;
}

export default function ReturnTripToggle({ needsReturnTrip, onToggle }: ReturnTripToggleProps) {
  return (
    <div className="p-4 bg-luxury-gold/10 border-2 border-luxury-gold/40 rounded-lg">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={needsReturnTrip}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-6 h-6 text-luxury-gold border-luxury-gold/40 rounded focus:ring-luxury-gold bg-white"
        />
        <div>
          <span className="font-semibold text-luxury-black">Add Return Trip</span>
          <p className="text-sm text-luxury-black/70">Need a ride back? Enable return transfer</p>
        </div>
      </label>
    </div>
  );
}

