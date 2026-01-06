// Melbourne-focused city detection
// Always defaults to Melbourne as we only service Melbourne

export const detectCityFromLocations = (
  pickup: string, 
  destinations: string[]
): 'melbourne' => {
  // Always return Melbourne as we only service Melbourne
  return 'melbourne';
};

export const getCityTimezone = (city: 'melbourne'): string => {
  return 'Australia/Melbourne';
};

export const getCityName = (city: 'melbourne'): string => {
  return 'Melbourne';
};

