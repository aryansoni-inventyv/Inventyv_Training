import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';
import { Hotel } from '../models/hotel';
import { HotelSearchCriteria } from '../models/hotel-search-criteria';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = 'assets/data/hotels.json';

  private hotelSubject = new BehaviorSubject<Hotel[]>([]);
  private hotels$ = this.hotelSubject.asObservable();

  private allHotels: Hotel[] = [];

  constructor(private http: HttpClient) {
    this.loadHotels();
  }

  private loadHotels(): void {
    this.http.get<Hotel[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error loading hotels:', error);
        return of([]);
      })
    ).subscribe(hotels => {
      this.allHotels = hotels;
      this.hotelSubject.next(hotels);
    }

    )
  }


  getAllHotels(): Observable<Hotel[]> {
    return this.hotels$;
  }


  searchHotels(criteria: HotelSearchCriteria): Observable<Hotel[]> {
    return this.hotels$.pipe(
      map(hotels => {
        return hotels.filter(hotel => {
          const matchesDestination = !criteria.destination ||
            hotel.city.toLowerCase().includes(criteria.destination.toLowerCase()) ||
            hotel.location.toLowerCase().includes(criteria.destination.toLowerCase());

          const matchesRating = !criteria.minRating ||
            hotel.rating >= criteria.minRating;

          const matchesPrice = !criteria.maxPrice ||
            hotel.pricePerNight <= criteria.maxPrice;

          const matchesAmenities = !criteria.amenities || criteria.amenities.length === 0 ||
            criteria.amenities.every(amenity =>
              hotel.amenities.some(ha => ha.toLowerCase().includes(amenity.toLowerCase()))
            );

          return matchesDestination && matchesRating && matchesPrice && matchesAmenities;
        });
      })
    );
  }

  filterByPrice(minPrice: number, maxPrice: number): Observable<Hotel[]> {
    return this.hotels$.pipe(
      map(hotels => hotels.filter(h =>
        h.pricePerNight >= minPrice && h.pricePerNight <= maxPrice
      ))
    );
  }

  filterByRating(minRating: number): Observable<Hotel[]> {
    return this.hotels$.pipe(
      map(hotels => hotels.filter(h => h.rating >= minRating))
    );
  }

  filterByAmenities(amenities: string[]): Observable<Hotel[]> {
    return this.hotels$.pipe(
      map(hotels => hotels.filter(hotel =>
        amenities.every(amenity =>
          hotel.amenities.some(ha => ha.toLowerCase().includes(amenity.toLowerCase()))
        )
      ))
    );
  }

  sortByPrice(order: 'asc' | 'desc' = 'asc'): Observable<Hotel[]> {
    return this.hotels$.pipe(
      map(hotels => {
        return [...hotels].sort((a, b) =>
          order === 'asc' ? a.pricePerNight - b.pricePerNight : b.pricePerNight - a.pricePerNight
        );
      })
    );
  }

  sortByRating(order: 'desc' | 'asc' = 'desc'): Observable<Hotel[]> {
    return this.hotels$.pipe(
      map(hotels => {
        return [...hotels].sort((a, b) =>
          order === 'desc' ? b.rating - a.rating : a.rating - b.rating
        );
      })
    );
  }

  getHotelById(id: string): Observable<Hotel | undefined> {
    return this.hotels$.pipe(
      map(hotels => hotels.find(h => h.id === id))
    );
  }

  getCities(): Observable<string[]> {
    return this.hotels$.pipe(
      map(hotels => {
        const cities = new Set<string>();
        hotels.forEach(h => cities.add(h.city));
        return Array.from(cities).sort();
      })
    );
  }

  getAvailableAmenities(): Observable<string[]> {
    return this.hotels$.pipe(
      map(hotels => {
        const amenities = new Set<string>();
        hotels.forEach(h => h.amenities.forEach(a => amenities.add(a)));
        return Array.from(amenities).sort();
      })
    );
  }
}
