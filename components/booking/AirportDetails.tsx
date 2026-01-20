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
    <div className="p-6 bg-luxury-gold/20 border-2 border-luxury-gold/40 rounded-lg space-y-4">
      <h3 className="text-lg font-serif text-luxury-gold">Airport Transfer Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flight Number */}
        <div>
          <label htmlFor="flightNumber" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Flight Number
          </label>
          <input
            type="text"
            id="flightNumber"
            value={flightNumber}
            onChange={(e) => onFlightNumberChange(e.target.value)}
            placeholder=""
            className="w-full px-4 py-3 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base placeholder:text-transparent focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all min-h-[48px]"
          />
        </div>

        {/* Terminal */}
        <div>
          <label htmlFor="terminal" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold mb-2">
            Terminal
          </label>
          <select
            id="terminal"
            value={terminalType}
            onChange={(e) => onTerminalTypeChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all min-h-[48px]"
          >
            <option value="" className="text-gray-500">Select terminal</option>
            <option value="Domestic">Domestic</option>
            <option value="International">International</option>
          </select>
        </div>
      </div>
    </div>
  );
}

