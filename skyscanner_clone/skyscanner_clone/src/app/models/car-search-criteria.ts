export interface CarSearchCriteria {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  carType?: string;
  transmission?: string;
  minSeats?: number;
}