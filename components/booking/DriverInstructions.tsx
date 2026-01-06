'use client';

export default function DriverInstructions() {
  return (
    <div className="space-y-2">
      <label htmlFor="instructions" className="block text-[10px] text-luxury-gold uppercase tracking-wider font-bold">
        Special Instructions for Driver
      </label>
      <textarea
        id="instructions"
        name="driver_instructions"
        rows={4}
        placeholder="Any special requests or information for your driver? (e.g., child seat required, meet at specific location)"
        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded text-white text-sm placeholder:text-white/30 focus:border-luxury-gold focus:outline-none transition-all resize-none"
      />
    </div>
  );
}

