export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  class: 'economy' | 'business' | 'first';
  availableSeats: number;
  date: string;
}