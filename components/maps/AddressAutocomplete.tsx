'use client';

import { useGoogleAutocomplete } from '@/hooks/maps/useGoogleAutocomplete';

interface AddressAutocompleteProps {
  id?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  onAddressSelect: (address: string) => void;
  className?: string;
}

export default function AddressAutocomplete({
  id = 'address',
  name = 'address',
  placeholder = 'Enter address',
  defaultValue = '',
  required = false,
  onAddressSelect,
  className = '',
}: AddressAutocompleteProps) {
  const {
    inputRef,
    value,
    isLoading,
    hasError,
    handleInputChange,
    handleBlur,
    placeholder: dynamicPlaceholder,
  } = useGoogleAutocomplete({
    onPlaceSelect: onAddressSelect,
    placeholder,
    defaultValue,
  });

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder={dynamicPlaceholder}
        required={required}
        disabled={isLoading}
        className={`
          w-full px-4 py-3 bg-white/5 border border-white/10 rounded 
          text-white text-sm placeholder:text-white/30 
          focus:border-luxury-gold focus:outline-none transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error indicator */}
      {hasError && (
        <p className="mt-1 text-xs text-luxury-gold/70">
          ⚠️ Address suggestions unavailable. Please type manually.
        </p>
      )}
    </div>
  );
}

