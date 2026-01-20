'use client';

import { useGoogleAutocomplete } from '@/hooks/maps/useGoogleAutocomplete';
import { MapPin, AlertCircle } from 'lucide-react';

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
    predictions,
    showPredictions,
    handleInputChange,
    handleBlur,
    handleFocus,
    handlePredictionClick,
    placeholder: dynamicPlaceholder,
    errorMessage,
  } = useGoogleAutocomplete({
    onPlaceSelect: onAddressSelect,
    placeholder,
    defaultValue,
  });

  return (
    <div className="relative w-full">
      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={dynamicPlaceholder}
        required={required}
        autoComplete="off"
        className={`
          w-full px-4 py-3 bg-white rounded-md
          border-2 border-luxury-gold/40
          text-luxury-black text-base
          focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/30
          transition-all duration-200
          disabled:opacity-60 disabled:cursor-not-allowed
          min-h-[48px]
          ${hasError ? 'border-amber-500/50' : ''}
          ${className}
        `}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-5 h-5 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error Indicator with Tooltip */}
      {hasError && !isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 group pointer-events-auto">
          <AlertCircle className="w-5 h-5 text-amber-500 cursor-help" />
          <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-amber-900/95 border border-amber-500/50 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none shadow-lg">
            <p className="text-xs text-amber-200 font-medium leading-tight">
              {errorMessage || 'Address suggestions unavailable. Please type your address manually.'}
            </p>
          </div>
        </div>
      )}

      {/* Predictions Dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div 
          className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-luxury-gold/40 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
          role="listbox"
          aria-label="Address suggestions"
        >
          {predictions.map((prediction, index) => (
            <button
              key={prediction.placeId}
              type="button"
              onClick={() => handlePredictionClick(prediction)}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
              className={`
                w-full px-4 py-3 text-left flex items-start gap-3
                hover:bg-luxury-gold/10 focus:bg-luxury-gold/10
                transition-colors duration-150
                ${index !== predictions.length - 1 ? 'border-b border-gray-100' : ''}
              `}
              role="option"
              aria-selected="false"
            >
              <MapPin className="w-4 h-4 text-luxury-gold flex-shrink-0 mt-1" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-luxury-black truncate">
                  {prediction.mainText}
                </p>
                {prediction.secondaryText && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {prediction.secondaryText}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message (when searching but no results) */}
      {showPredictions && predictions.length === 0 && value.length >= 3 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <p className="text-sm text-gray-500 text-center">
            No addresses found. Please try a different search or enter the address manually.
          </p>
        </div>
      )}
    </div>
  );
}
