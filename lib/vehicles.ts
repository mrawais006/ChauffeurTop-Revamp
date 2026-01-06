export interface Vehicle {
  category: string;
  name: string;
  models: string;
  description: string;
  passengers: number;
  luggage: number;
  image: string;
}

// Vehicle pricing - starting prices for each category
export const vehiclePricing: Record<string, number> = {
  'sedan': 99,
  'suv': 119,
  'van': 149,
  'minibus': 199,
};

export const vehicles: Vehicle[] = [
  {
    category: 'sedan',
    name: 'Premium Sedan',
    models: 'Mercedes-Benz S-Class, BMW 7 Series, Audi A8',
    description: 'Luxury sedan perfect for business travel and airport transfers',
    passengers: 3,
    luggage: 3,
    image: '/fleet/vehicle_sedan.png',
  },
  {
    category: 'suv',
    name: 'Luxury SUV',
    models: 'Mercedes-Benz GLS, BMW X7, Range Rover',
    description: 'Spacious and comfortable for families or groups',
    passengers: 6,
    luggage: 6,
    image: '/fleet/vehicle_suv.png',
  },
  {
    category: 'van',
    name: 'Executive Van',
    models: 'Mercedes-Benz V-Class, Toyota Granvia',
    description: 'Ideal for larger groups with ample luggage space',
    passengers: 7,
    luggage: 8,
    image: '/fleet/vehicle_van.png',
  },
  {
    category: 'minibus',
    name: 'Premium Minibus',
    models: 'Mercedes-Benz Sprinter, Toyota Coaster',
    description: 'Perfect for corporate events and group transfers',
    passengers: 13,
    luggage: 10,
    image: '/fleet/luxury_minibus_black.png',
  },
];

