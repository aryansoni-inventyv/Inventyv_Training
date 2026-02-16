export interface HotelSearchCriteria {
  destination: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  rooms: number;
  minRating?: number;
  maxPrice?: number;
  amenities?: string[];
}