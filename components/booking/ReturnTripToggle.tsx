'use client';

interface ReturnTripToggleProps {
  needsReturnTrip: boolean;
  onToggle: (value: boolean) => void;
}

export default function ReturnTripToggle({ needsReturnTrip, onToggle }: ReturnTripToggleProps) {
  return (
    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={needsReturnTrip}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 text-luxury-gold border-white/30 rounded focus:ring-luxury-gold bg-white/5"
        />
        <div>
          <span className="font-semibold text-white">Add Return Trip</span>
          <p className="text-sm text-white/70">Need a ride back? Enable return transfer</p>
        </div>
      </label>
    </div>
  );
}

