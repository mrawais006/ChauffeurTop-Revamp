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
  'executive_sedan': 99,
  'premium_sedan': 129,
  'premium_suv': 139,
  'people_mover': 159,
  'minibus_coach': 249,
};

export const vehicles: Vehicle[] = [
  {
    category: 'executive_sedan',
    name: 'Executive Sedans',
    models: 'Holden Caprice, Chrysler 300C, Genesis',
    description: 'Ideal for 1-3 passengers, combining elegance with comfort for business and leisure.',
    passengers: 3,
    luggage: 2,
    image: '/fleet/vehicle_sedan.png',
  },
  {
    category: 'premium_sedan',
    name: 'Premium Sedans',
    models: 'BMW 7 Series, Audi A8, Mercedes S-Class',
    description: 'Ultimate luxury for VIP travel. BMW 7 Series, Audi A8, Mercedes S-Class quality.',
    passengers: 3,
    luggage: 2,
    image: '/fleet/premium_sedan.png',
  },
  {
    category: 'premium_suv',
    name: 'Premium SUVs',
    models: 'Audi Q7, Mercedes-Benz GLE, BMW X5',
    description: 'Spacious and powerful, perfect for small groups or extra luggage requirements.',
    passengers: 3,
    luggage: 5,
    image: '/fleet/vehicle_suv.png',
  },
  {
    category: 'people_mover',
    name: 'People Movers',
    models: 'Mercedes-Benz V-Class, Volkswagen Multivan',
    description: 'Seamless comfort for larger groups and families.',
    passengers: 6,
    luggage: 6,
    image: '/fleet/vehicle_van.png',
  },
  {
    category: 'minibus_coach',
    name: 'Minibuses & Coaches',
    models: 'Mercedes-Benz Sprinter, Renault Master',
    description: 'Luxury transport for medium to large groups and events.',
    passengers: 14,
    luggage: 10,
    image: '/fleet/luxury_minibus_black.png',
  },
];

