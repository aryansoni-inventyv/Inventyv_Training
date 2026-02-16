import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';
import { Car } from '../models/car';
import { CarSearchCriteria } from '../models/car-search-criteria';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private apiUrl = 'assets/data/car.json';

  private carsSubject = new BehaviorSubject<Car[]>([]);
  private cars$ = this.carsSubject.asObservable();

  private allCars: Car[] =[];

  constructor(private http : HttpClient){
    this.loadCars();
  }

  private loadCars() : void {
    this.http.get<Car[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error loading cars:', error);
        return of([]);
      })
    ).subscribe(cars => {
      this.allCars = cars ;
      this.carsSubject.next(cars);
    }
    );
  } 

  getAllCars(): Observable<Car[]>{
    return this.cars$;
  }

  searchCars(criteria: CarSearchCriteria): Observable<Car[]> {
    return this.cars$.pipe(
      map(cars => {
        return cars.filter(car => {
          const matchesLocation = !criteria.pickupLocation || 
            car.location.toLowerCase().includes(criteria.pickupLocation.toLowerCase());
          
          const matchesType = !criteria.carType || 
            criteria.carType === 'all' ||
            car.type === criteria.carType;
          
          const matchesTransmission = !criteria.transmission || 
            criteria.transmission === 'all' ||
            car.transmission === criteria.transmission;
          
          const matchesSeats = !criteria.minSeats || 
            car.seats >= criteria.minSeats;
          
          const isAvailable = car.available;
          
          return matchesLocation && matchesType && matchesTransmission && 
                 matchesSeats && isAvailable;
        });
      })
    );
  }

  filterByPrice(minPrice : number , maxPrice : number) : Observable<Car[]> {
    return this.cars$.pipe(
      map(cars => cars.filter(c => 
        c.pricePerDay >= minPrice && c.pricePerDay <= maxPrice
      ))
    );
  }

  filterByType(type : string) : Observable<Car[]> {
    return this.cars$.pipe(
      map(cars=> cars.filter(c => 
        c.type === type
      ))
    );
  }

  filterByTransmission(transmission: string) : Observable<Car[]>{
    return this.cars$.pipe(
      map(cars => cars.filter(c => c.transmission === transmission))
    );
  }

  filterByFuelType(fuelType: string): Observable<Car[]> {
    return this.cars$.pipe(
      map(cars => cars.filter(c => c.fuelType === fuelType))
    );
  }
  
  
  sortByPrice(order: 'asc' | 'desc' = 'asc'): Observable<Car[]> {
    return this.cars$.pipe(
      map(cars => {
        return [...cars].sort((a, b) => 
          order === 'asc' ? a.pricePerDay - b.pricePerDay : b.pricePerDay - a.pricePerDay
        );
      })
    );
  }

  sortByRating(order: 'desc' | 'asc' = 'desc'): Observable<Car[]> {
    return this.cars$.pipe(
      map(cars => {
        return [...cars].sort((a, b) => 
          order === 'desc' ? b.rating - a.rating : a.rating - b.rating
        );
      })
    );
  }


  getCarById(id : string) : Observable<Car | undefined > {
    return this.cars$.pipe(
      map(cars => cars.find(c => c.id === id))
    );
  }

  getLocations(): Observable<string[]> {
    return this.cars$.pipe(
      map(cars => {
        const location = new Set<string>();
        cars.forEach(c => location.add(c.location));
        return Array.from(location).sort();
      })
    );
  }

  getCarTypes(): Observable<string[]> {
    return this.cars$.pipe(
      map(cars => {
        const types = new Set<string>();
        cars.forEach(c => types.add(c.type));
        return Array.from(types).sort();
      })
    );
  }

}
