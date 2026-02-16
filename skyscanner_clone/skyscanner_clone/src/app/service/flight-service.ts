import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of, tap } from 'rxjs';
import { Flight } from '../models/flight';
import { FlightSearchCriteria } from '../models/flight-search-criteria';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private apiUrl = 'assets/data/flights.json';
  
  private flightsSubject = new BehaviorSubject<Flight[]>([]);
  public flights$ = this.flightsSubject.asObservable();
  
  private allFlights: Flight[] = [];

  constructor(private http: HttpClient) {
    console.log('🔵 FlightService: Constructor called');
    this.loadFlights();
  }

  private loadFlights(): void {
    console.log('🔵 FlightService: Loading flights from', this.apiUrl);
    
    this.http.get<Flight[]>(this.apiUrl).pipe(
      tap(flights => {
        console.log('✅ FlightService: Flights loaded successfully!', flights.length, 'flights');
        console.log('📊 FlightService: Sample flight:', flights[0]);
      }),
      catchError(error => {
        console.error('❌ FlightService: Error loading flights!', error);
        return of([]);
      })
    ).subscribe(flights => {
      this.allFlights = flights;
      this.flightsSubject.next(flights);
      console.log('🔵 FlightService: BehaviorSubject updated with', flights.length, 'flights');
    });
  }

  getAllFlights(): Observable<Flight[]> {
    console.log('🔵 FlightService: getAllFlights() called');
    return this.flights$;
  }

  searchFlights(criteria: FlightSearchCriteria): Observable<Flight[]> {
    console.log('🔍 FlightService: searchFlights() called with criteria:', criteria);
    
    return this.flights$.pipe(
      map(flights => {
        console.log('🔵 FlightService: Starting filter with', flights.length, 'flights');
        
        const filtered = flights.filter(flight => {
          // More lenient filtering - empty criteria = match all
          
          // From city - case insensitive partial match
          const matchesFrom = !criteria.from || criteria.from.trim() === '' ||
            flight.from.toLowerCase().includes(criteria.from.toLowerCase().trim());
          
          // To city - case insensitive partial match
          const matchesTo = !criteria.to || criteria.to.trim() === '' ||
            flight.to.toLowerCase().includes(criteria.to.toLowerCase().trim());
          
          // Date - exact match OR no date specified
          const matchesDate = !criteria.departureDate || criteria.departureDate.trim() === '' ||
            flight.date === criteria.departureDate;
          
          // Class - match OR "all" OR not specified
          const matchesClass = !criteria.class || 
            criteria.class === 'all' || 
            criteria.class === '' ||
            flight.class === criteria.class;
          
          // Seats - enough seats OR not specified
          const hasSeats = !criteria.passengers || 
            flight.availableSeats >= (criteria.passengers || 1);
          
          const matches = matchesFrom && matchesTo && matchesDate && matchesClass && hasSeats;
          
          // Log each flight that gets filtered out
          if (!matches) {
            console.log('❌ Flight filtered out:', flight.flightNumber, 
              'From:', flight.from, '→', flight.to, 
              'Date:', flight.date,
              'Reasons:', {
                matchesFrom: matchesFrom ? '✅' : `❌ (looking for "${criteria.from}", have "${flight.from}")`,
                matchesTo: matchesTo ? '✅' : `❌ (looking for "${criteria.to}", have "${flight.to}")`,
                matchesDate: matchesDate ? '✅' : `❌ (looking for "${criteria.departureDate}", have "${flight.date}")`,
                matchesClass: matchesClass ? '✅' : `❌ (looking for "${criteria.class}", have "${flight.class}")`,
                hasSeats: hasSeats ? '✅' : '❌'
              }
            );
          } else {
            console.log('✅ Flight MATCHED:', flight.flightNumber, flight.from, '→', flight.to);
          }
          
          return matches;
        });
        
        console.log('✅ FlightService: Filtered results:', filtered.length, 'flights');
        
        if (filtered.length === 0) {
          console.warn('⚠️ NO FLIGHTS MATCHED!');
          console.warn('⚠️ Search criteria:', criteria);
          console.warn('⚠️ Available flights:', flights.map(f => ({
            id: f.id,
            from: f.from,
            to: f.to,
            date: f.date,
            class: f.class
          })));
        }
        
        return filtered;
      })
    );
  }

  filterByPrice(minPrice: number, maxPrice: number): Observable<Flight[]> {
    return this.flights$.pipe(
      map(flights => flights.filter(f => f.price >= minPrice && f.price <= maxPrice))
    );
  }

  filterByStops(maxStops: number): Observable<Flight[]> {
    return this.flights$.pipe(
      map(flights => flights.filter(f => f.stops <= maxStops))
    );
  }

  sortByPrice(order: 'asc' | 'desc' = 'asc'): Observable<Flight[]> {
    return this.flights$.pipe(
      map(flights => {
        return [...flights].sort((a, b) => 
          order === 'asc' ? a.price - b.price : b.price - a.price
        );
      })
    );
  }

  sortByDuration(order: 'asc' | 'desc' = 'asc'): Observable<Flight[]> {
    return this.flights$.pipe(
      map(flights => {
        return [...flights].sort((a, b) => {
          const durationA = this.parseDuration(a.duration);
          const durationB = this.parseDuration(b.duration);
          return order === 'asc' ? durationA - durationB : durationB - durationA;
        });
      })
    );
  }

  private parseDuration(duration: string): number {
    const hours = duration.match(/(\d+)h/);
    const minutes = duration.match(/(\d+)m/);
    return (hours ? parseInt(hours[1]) * 60 : 0) + (minutes ? parseInt(minutes[1]) : 0);
  }

  getFlightById(id: string): Observable<Flight | undefined> {
    return this.flights$.pipe(
      map(flights => flights.find(f => f.id === id))
    );
  }

  getCities(): Observable<string[]> {
    return this.flights$.pipe(
      map(flights => {
        const cities = new Set<string>();
        flights.forEach(f => {
          cities.add(f.from);
          cities.add(f.to);
        });
        return Array.from(cities).sort();
      })
    );
  }
}