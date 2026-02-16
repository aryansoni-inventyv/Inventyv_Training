// src/app/component/hotel/hotel-component/hotel-component.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelService } from '../../../service/hotel-service';
import { StorageService } from '../../../service/storage-service';
import { Hotel } from '../../../models/hotel';
import { HotelSearchCriteria } from '../../../models/hotel-search-criteria';

@Component({
  selector: 'app-hotel-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './hotel-component.html',
  styleUrl: './hotel-component.css'
})
export class HotelComponent implements OnInit {
  searchForm!: FormGroup;
  
  // Hotels data
  allHotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  loading: boolean = true;
  
  // Search input
  searchQuery: string = '';
  
  cities: string[] = [];
  amenities: string[] = [];
  recentSearches: any[] = [];
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private hotelService: HotelService,
    private storageService: StorageService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCities();
    this.loadAmenities();
    this.loadRecentSearches();
    this.loadAllHotels();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      destination: ['', [Validators.required, Validators.minLength(2)]],
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guests: [2, [Validators.required, Validators.min(1), Validators.max(10)]],
      rooms: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      minRating: [0],
      maxPrice: [50000]
    });

    this.searchForm.get('checkInDate')?.valueChanges.subscribe(() => {
      this.validateDates();
    });

    this.searchForm.get('checkOutDate')?.valueChanges.subscribe(() => {
      this.validateDates();
    });
  }

  private validateDates(): void {
    const checkIn = this.searchForm.get('checkInDate')?.value;
    const checkOut = this.searchForm.get('checkOutDate')?.value;

    if (checkIn && checkOut && checkOut <= checkIn) {
      this.searchForm.get('checkOutDate')?.setErrors({ 'invalidDate': true });
    }
  }

  private loadAllHotels(): void {
    this.loading = true;
    this.hotelService.getAllHotels().subscribe({
      next: (hotels) => {
        this.allHotels = hotels;
        this.filteredHotels = hotels;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading hotels:', err);
        this.loading = false;
      }
    });
  }

  private loadCities(): void {
    this.hotelService.getCities().subscribe(cities => {
      this.cities = cities;
    });
  }

  private loadAmenities(): void {
    this.hotelService.getAvailableAmenities().subscribe(amenities => {
      this.amenities = amenities;
    });
  }

  private loadRecentSearches(): void {
    this.recentSearches = this.storageService.getHotelSearchHistory();
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      const formValue = this.searchForm.value;
      
      const criteria: HotelSearchCriteria = {
        destination: formValue.destination.trim(),
        checkInDate: formValue.checkInDate,
        checkOutDate: formValue.checkOutDate,
        guests: formValue.guests,
        rooms: formValue.rooms,
        minRating: formValue.minRating || undefined,
        maxPrice: formValue.maxPrice || undefined
      };

      this.storageService.saveHotelSearch(criteria);

      this.hotelService.searchHotels(criteria).subscribe({
        next: (hotels) => {
          this.filteredHotels = hotels;
          this.searchQuery = ''; // Clear text search when form search
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
      this.filteredHotels = this.allHotels.filter(h =>
        h.name.toLowerCase().includes(query) ||
        h.city.toLowerCase().includes(query) ||
        h.location.toLowerCase().includes(query)
      );
    } else {
      this.filteredHotels = this.allHotels;
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applySearchFilter();
  }

  onReset(): void {
    this.searchForm.reset({
      guests: 2,
      rooms: 1,
      minRating: 0,
      maxPrice: 50000
    });
    this.searchQuery = '';
    this.filteredHotels = this.allHotels;
  }

  selectHotel(hotel: Hotel): void {
    this.storageService.saveSelectedHotel(hotel);
    const nights = this.calculateNights();
    const totalPrice = hotel.pricePerNight * nights * this.searchForm.get('rooms')?.value;
    
    alert(
      `Hotel Selected: ${hotel.name}\n` +
      `Price per night: ₹${hotel.pricePerNight.toLocaleString('en-IN')}\n` +
      `${nights} night(s) × ${this.searchForm.get('rooms')?.value} room(s)\n` +
      `Total: ₹${totalPrice.toLocaleString('en-IN')}`
    );
  }

  toggleFavorite(hotel: Hotel, event: Event): void {
    event.stopPropagation();
    
    if (this.isFavorite(hotel)) {
      this.storageService.removeFavorite('hotel', hotel.id);
      alert('Removed from favorites');
    } else {
      this.storageService.saveFavorite('hotel', hotel);
      alert('Added to favorites');
    }
  }

  isFavorite(hotel: Hotel): boolean {
    return this.storageService.isFavorite('hotel', hotel.id);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  useRecentSearch(search: any): void {
    this.searchForm.patchValue({
      destination: search.destination,
      checkInDate: search.checkInDate,
      checkOutDate: search.checkOutDate,
      guests: search.guests,
      rooms: search.rooms,
      minRating: search.minRating,
      maxPrice: search.maxPrice
    });
    this.onSearch();
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.searchForm.get(fieldName);
    return !!(field && field.hasError(errorType) && field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.searchForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field.hasError('min')) {
      return `Minimum value is ${field.errors?.['min'].min}`;
    }
    if (field.hasError('max')) {
      return `Maximum value is ${field.errors?.['max'].max}`;
    }
    if (field.hasError('minlength')) {
      return `Minimum length is ${field.errors?.['minlength'].requiredLength}`;
    }
    if (field.hasError('invalidDate')) {
      return 'Check-out date must be after check-in date';
    }
    return '';
  }

  calculateNights(): number {
    const checkIn = this.searchForm.get('checkInDate')?.value;
    const checkOut = this.searchForm.get('checkOutDate')?.value;

    if (checkIn && checkOut) {
      const date1 = new Date(checkIn);
      const date2 = new Date(checkOut);
      const diffTime = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  getEmptyStarArray(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }
}