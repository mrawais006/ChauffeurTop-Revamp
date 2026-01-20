'use client';

export default function DriverInstructions() {
  return (
    <div className="space-y-3">
      <label htmlFor="instructions" className="block text-sm text-luxury-gold uppercase tracking-wider font-bold">
        Special Instructions for Driver
      </label>
      <textarea
        id="instructions"
        name="driver_instructions"
        rows={4}
        placeholder=""
        className="w-full px-4 py-4 bg-white border-2 border-luxury-gold/40 rounded-md text-luxury-black text-base placeholder:text-transparent focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 transition-all resize-none min-h-[120px]"
      />
    </div>
  );
}

