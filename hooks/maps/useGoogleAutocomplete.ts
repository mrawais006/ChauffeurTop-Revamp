'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { mapsLoader } from '@/lib/maps/loader';
import { sessionTokenManager } from '@/lib/maps/sessionToken';
import { BASIC_AUTOCOMPLETE_FIELDS, createAustraliaBounds } from '@/lib/maps/config';

interface UseGoogleAutocompleteProps {
  onPlaceSelect: (address: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

export function useGoogleAutocomplete({
  onPlaceSelect,
  placeholder = 'Enter address',
  defaultValue = '',
}: UseGoogleAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const onPlaceSelectRef = useRef(onPlaceSelect); // Stable ref for callback
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [value, setValue] = useState(defaultValue);

  // Update ref when callback changes
  useEffect(() => {
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onPlaceSelect]);

  // Sync value with defaultValue changes (e.g. auto-population)
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // Handle place selection
  const handlePlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    const address = place.formatted_address || place.name || '';

    if (address) {
      console.log('[Autocomplete] Place selected:', address);
      setValue(address);
      if (onPlaceSelectRef.current) {
        onPlaceSelectRef.current(address);
      }

      // Complete session for cost optimization
      sessionTokenManager.completeSession();
    }
  }, []);

  // Initialize autocomplete
  useEffect(() => {
    if (!inputRef.current || autocompleteRef.current) {
      return;
    }

    const initAutocomplete = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // Load Google Maps API
        await mapsLoader.loadGoogleMapsApi();

        if (!window.google?.maps?.places) {
          throw new Error('Places API not available');
        }

        // Create bounds for better results
        const bounds = createAustraliaBounds();

        // Create autocomplete instance with cost-optimized settings
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current!,
          {
            types: ['geocode', 'establishment'],
            componentRestrictions: { country: 'au' },
            fields: BASIC_AUTOCOMPLETE_FIELDS as any, // ⚠️ CRITICAL: Only Basic fields!
            bounds,
            strictBounds: false,
          }
        );

        // Add listener for place selection
        autocomplete.addListener('place_changed', handlePlaceChanged);

        autocompleteRef.current = autocomplete;
        setIsLoading(false);

        console.log('[Autocomplete] Initialized with cost-optimized settings');
      } catch (error) {
        console.error('[Autocomplete] Failed to initialize:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    initAutocomplete();

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, [handlePlaceChanged]); // strictly dependent only on stable dependencies

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onPlaceSelect(newValue); // Propagate changes immediately to parent
  };

  // Handle blur (save manual entry final check)
  const handleBlur = () => {
    if (inputRef.current) {
      const currentValue = inputRef.current.value;
      // Ensure specific consistency on blur
      if (currentValue !== value) {
         setValue(currentValue);
         onPlaceSelect(currentValue);
      }
    }
  };

  return {
    inputRef,
    value,
    isLoading,
    hasError,
    handleInputChange,
    handleBlur,
    placeholder: hasError ? `${placeholder} (manual entry)` : placeholder,
  };
}

