'use client';

interface AirportDetailsProps {
  flightNumber: string;
  terminalType: string;
  onFlightNumberChange: (value: string) => void;
  onTerminalTypeChange: (value: string) => void;
}

export default function AirportDetails({
  flightNumber,
  terminalType,
  onFlightNumberChange,
  onTerminalTypeChange,
}: AirportDetailsProps) {
  return (
    <div className="p-6 bg-luxury-gold/5 border border-luxury-gold/30 rounded-lg space-y-4">
      <h3 className="text-lg font-serif text-luxury-gold">Airport Transfer Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flight Number */}
        <div>
          <label htmlFor="flightNumber" className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Flight Number
          </label>
          <input
            type="text"
            id="flightNumber"
            value={flightNumber}
            onChange={(e) => onFlightNumberChange(e.target.value)}
            placeholder="e.g., QF123"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm placeholder:text-white/30 focus:border-luxury-gold focus:outline-none transition-all"
          />
        </div>

        {/* Terminal */}
        <div>
          <label htmlFor="terminal" className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Terminal
          </label>
          <select
            id="terminal"
            value={terminalType}
            onChange={(e) => onTerminalTypeChange(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm focus:border-luxury-gold focus:outline-none transition-all"
          >
            <option value="" className="bg-black text-white">Select terminal</option>
            <option value="Domestic" className="bg-black text-white">Domestic</option>
            <option value="International" className="bg-black text-white">International</option>
          </select>
        </div>
      </div>
    </div>
  );
}

