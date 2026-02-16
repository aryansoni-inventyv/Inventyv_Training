export interface Hotel {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  rating: number; // 1-5
  reviewScore: number; // 1-10
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  roomTypes: string[];
  images: string[];
  description: string;
  checkInTime: string;
  checkOutTime: string;
  freeCancellation: boolean;
}