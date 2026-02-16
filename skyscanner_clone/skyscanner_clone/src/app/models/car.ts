export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: 'sedan' | 'suv' | 'van' | 'luxury' | 'compact' | 'economy';
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  seats: number;
  doors: number;
  luggage: number;
  pricePerDay: number;
  currency: string;
  location: string;
  rentalCompany: string;
  features: string[];
  image: string;
  rating: number;
  available: boolean;
}