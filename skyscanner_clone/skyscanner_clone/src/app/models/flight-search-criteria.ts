export interface FlightSearchCriteria {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: string;
  tripType: 'one-way' | 'round-trip';
}