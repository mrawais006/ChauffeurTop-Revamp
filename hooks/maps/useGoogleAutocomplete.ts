'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { mapsLoader } from '@/lib/maps/loader';
import { sessionTokenManager } from '@/lib/maps/sessionToken';
import { AUSTRALIA_BOUNDS } from '@/lib/maps/config';

// Debounce delay in milliseconds (500ms as requested)
const DEBOUNCE_DELAY = 500;

interface Prediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

interface UseGoogleAutocompleteProps {
  onPlaceSelect: (address: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

interface UseGoogleAutocompleteReturn {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  isLoading: boolean;
  hasError: boolean;
  predictions: Prediction[];
  showPredictions: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  handleFocus: () => void;
  handlePredictionClick: (prediction: Prediction) => void;
  placeholder: string;
  errorMessage: string;
}

export function useGoogleAutocomplete({
  onPlaceSelect,
  placeholder = 'Enter address',
  defaultValue = '',
}: UseGoogleAutocompleteProps): UseGoogleAutocompleteReturn {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onPlaceSelectRef = useRef(onPlaceSelect);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [value, setValue] = useState(defaultValue);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [apiReady, setApiReady] = useState(false);

  // Update ref when callback changes
  useEffect(() => {
    onPlaceSelectRef.current = onPlaceSelect;
  }, [onPlaceSelect]);

  // Sync value with defaultValue changes (e.g. auto-population)
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // Initialize AutocompleteService
  useEffect(() => {
    let isMounted = true;

    const initService = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        setErrorMessage('');

        // Load Google Maps API
        await mapsLoader.loadGoogleMapsApi();

        if (!window.google?.maps?.places) {
          throw new Error('Places API not available');
        }

        if (!isMounted) return;

        // Create AutocompleteService instance
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
        setApiReady(true);
        setIsLoading(false);

        console.log('[Autocomplete] AutocompleteService initialized with debounce and session tokens');
      } catch (error) {
        if (!isMounted) return;
        console.error('[Autocomplete] Failed to initialize:', error);
        setHasError(true);
        setErrorMessage('Address suggestions unavailable. Please type manually.');
        setIsLoading(false);
      }
    };

    initService();

    // Cleanup
    return () => {
      isMounted = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Fetch predictions with debouncing and session tokens
  const fetchPredictions = useCallback((searchText: string) => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't search if text is too short
    if (searchText.length < 3) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    // Don't search if API is not ready
    if (!apiReady || !autocompleteServiceRef.current) {
      return;
    }

    // Set up debounced search (500ms delay)
    debounceTimerRef.current = setTimeout(() => {
      setIsSearching(true);
      
      // Get or create session token (UUID v4)
      // This ensures all predictions in this typing session are billed as ONE
      const sessionToken = sessionTokenManager.getOrCreateToken();

      const request: google.maps.places.AutocompletionRequest = {
        input: searchText,
        componentRestrictions: { country: 'au' },
        types: ['geocode', 'establishment'],
        ...(sessionToken && { sessionToken }),
        // Location bias for Victoria/SA
        locationBias: new google.maps.LatLngBounds(
          new google.maps.LatLng(AUSTRALIA_BOUNDS.south, AUSTRALIA_BOUNDS.west),
          new google.maps.LatLng(AUSTRALIA_BOUNDS.north, AUSTRALIA_BOUNDS.east)
        ),
      };

      autocompleteServiceRef.current!.getPlacePredictions(
        request,
        (results, status) => {
          setIsSearching(false);

          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const formattedPredictions: Prediction[] = results.map((result) => ({
              placeId: result.place_id,
              description: result.description,
              mainText: result.structured_formatting?.main_text || result.description,
              secondaryText: result.structured_formatting?.secondary_text || '',
            }));
            setPredictions(formattedPredictions);
            setShowPredictions(true);
            setHasError(false);
            setErrorMessage('');
          } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setPredictions([]);
            setShowPredictions(false);
          } else if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT) {
            // API quota exceeded - graceful degradation
            console.warn('[Autocomplete] API quota exceeded, falling back to manual entry');
            setHasError(true);
            setErrorMessage('Address lookup temporarily unavailable. Please type your full address.');
            setPredictions([]);
            setShowPredictions(false);
          } else {
            // Other API errors - log but don't crash
            console.warn('[Autocomplete] API returned status:', status);
            // Don't show error for temporary issues
            setPredictions([]);
            setShowPredictions(false);
          }
        }
      );
    }, DEBOUNCE_DELAY);
  }, [apiReady]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onPlaceSelectRef.current(newValue); // Propagate changes immediately to parent
    fetchPredictions(newValue);
  };

  // Handle prediction selection
  const handlePredictionClick = useCallback((prediction: Prediction) => {
    setValue(prediction.description);
    onPlaceSelectRef.current(prediction.description);
    setPredictions([]);
    setShowPredictions(false);

    // CRITICAL: Complete the session after place selection
    // This ensures Google bills this as ONE session, not multiple requests
    sessionTokenManager.completeSession();

    console.log('[Autocomplete] Place selected:', prediction.description);
  }, []);

  // Handle blur
  const handleBlur = useCallback(() => {
    // Delay hiding predictions to allow click to register
    setTimeout(() => {
      setShowPredictions(false);
    }, 200);
  }, []);

  // Handle focus
  const handleFocus = useCallback(() => {
    if (predictions.length > 0 && value.length >= 3) {
      setShowPredictions(true);
    }
  }, [predictions.length, value.length]);

  return {
    inputRef,
    value,
    isLoading: isLoading || isSearching,
    hasError,
    predictions,
    showPredictions,
    handleInputChange,
    handleBlur,
    handleFocus,
    handlePredictionClick,
    placeholder: hasError ? `${placeholder} (manual entry)` : placeholder,
    errorMessage,
  };
}
