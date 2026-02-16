// src/app/component/car/car-component/car-component.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from '../../../service/car-service';
import { StorageService } from '../../../service/storage-service';
import { Car } from '../../../models/car';
import { CarSearchCriteria } from '../../../models/car-search-criteria';

@Component({
  selector: 'app-car-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './car-component.html',
  styleUrl: './car-component.css'
})
export class CarComponent implements OnInit {
  searchForm!: FormGroup;
  
  allCars: Car[] = [];
  filteredCars: Car[] = [];
  loading: boolean = true;
  
  searchQuery: string = '';
  
  locations: string[] = [];
  carTypes: string[] = [];
  recentSearches: any[] = [];
  minDate: string;
  sameDropoff: boolean = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private carService: CarService,
    private storageService: StorageService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadLocations();
    this.loadCarTypes();
    this.loadRecentSearches();
    this.loadAllCars();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      pickupLocation: ['', [Validators.required, Validators.minLength(2)]],
      dropoffLocation: [''],
      pickupDate: ['', Validators.required],
      pickupTime: ['10:00', Validators.required],
      dropoffDate: ['', Validators.required],
      dropoffTime: ['10:00', Validators.required],
      carType: ['all'],
      transmission: ['all'],
      minSeats: [2]
    });
  }

  private loadAllCars(): void {
    this.loading = true;
    this.carService.getAllCars().subscribe({
      next: (cars) => {
        this.allCars = cars;
        this.filteredCars = cars;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cars:', err);
        this.loading = false;
      }
    });
  }

  private loadLocations(): void {
    this.carService.getLocations().subscribe(locations => {
      this.locations = locations;
    });
  }

  private loadCarTypes(): void {
    this.carService.getCarTypes().subscribe(types => {
      this.carTypes = types;
    });
  }

  private loadRecentSearches(): void {
    this.recentSearches = this.storageService.getCarSearchHistory();
  }

  toggleSameDropoff(): void {
    this.sameDropoff = !this.sameDropoff;
    if (this.sameDropoff) {
      const pickupLoc = this.searchForm.get('pickupLocation')?.value;
      this.searchForm.patchValue({ dropoffLocation: pickupLoc });
    }
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      const formValue = this.searchForm.value;
      
      const criteria: CarSearchCriteria = {
        pickupLocation: formValue.pickupLocation.trim(),
        dropoffLocation: this.sameDropoff ? formValue.pickupLocation.trim() : formValue.dropoffLocation.trim(),
        pickupDate: formValue.pickupDate,
        pickupTime: formValue.pickupTime,
        dropoffDate: formValue.dropoffDate,
        dropoffTime: formValue.dropoffTime,
        carType: formValue.carType !== 'all' ? formValue.carType : undefined,
        transmission: formValue.transmission !== 'all' ? formValue.transmission : undefined,
        minSeats: formValue.minSeats || undefined
      };

      this.storageService.saveCarSearch(criteria);

      this.carService.searchCars(criteria).subscribe({
        next: (cars) => {
          this.filteredCars = cars;
          this.searchQuery = '';
        },
        error: (err) => {
          console.error('Search error:', err);
        }
      });
    } else {
      this.markFormGroupTouched(this.searchForm);
    }
  }

  onSearchQueryChange(): void {
    this.applySearchFilter();
  }

  applySearchFilter(): void {
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredCars = this.allCars.filter(c =>
        c.brand.toLowerCase().includes(query) ||
        c.model.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query)
      );
    } else {
      this.filteredCars = this.allCars;
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applySearchFilter();
  }

  onReset(): void {
    this.searchForm.reset({
      pickupTime: '10:00',
      dropoffTime: '10:00',
      carType: 'all',
      transmission: 'all',
      minSeats: 2
    });
    this.searchQuery = '';
    this.filteredCars = this.allCars;
    this.sameDropoff = true;
  }

  selectCar(car: Car): void {
    this.storageService.saveSelectedCar(car);
    const days = this.calculateDays();
    const totalPrice = car.pricePerDay * days;
    
    alert(
      `Car Selected: ${car.brand} ${car.model}\n` +
      `Price per day: ₹${car.pricePerDay.toLocaleString('en-IN')}\n` +
      `${days} day(s)\n` +
      `Total: ₹${totalPrice.toLocaleString('en-IN')}`
    );
  }

  toggleFavorite(car: Car, event: Event): void {
    event.stopPropagation();
    
    if (this.isFavorite(car)) {
      this.storageService.removeFavorite('car', car.id);
      alert('Removed from favorites');
    } else {
      this.storageService.saveFavorite('car', car);
      alert('Added to favorites');
    }
  }

  isFavorite(car: Car): boolean {
    return this.storageService.isFavorite('car', car.id);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  useRecentSearch(search: any): void {
    this.searchForm.patchValue(search);
    this.sameDropoff = search.pickupLocation === search.dropoffLocation;
    this.onSearch();
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.searchForm.get(fieldName);
    return !!(field && field.hasError(errorType) && field.touched);
  }

  calculateDays(): number {
    const pickupDate = this.searchForm.get('pickupDate')?.value;
    const dropoffDate = this.searchForm.get('dropoffDate')?.value;

    if (pickupDate && dropoffDate) {
      const date1 = new Date(pickupDate);
      const date2 = new Date(dropoffDate);
      const diffTime = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }
    return 1;
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  getTransmissionIcon(transmission: string): string {
    return transmission === 'automatic' ? '⚙️' : '🔧';
  }

  getFuelTypeIcon(fuelType: string): string {
    const icons: any = {
      'petrol': '⛽',
      'diesel': '🛢️',
      'electric': '🔌',
      'hybrid': '🔋'
    };
    return icons[fuelType] || '⛽';
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }
}