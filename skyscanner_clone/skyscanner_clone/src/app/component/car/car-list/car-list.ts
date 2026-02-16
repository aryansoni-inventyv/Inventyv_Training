// src/app/component/car/car-list/car-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CarService } from '../../../service/car-service';
import { StorageService } from '../../../service/storage-service';
import { Car } from '../../../models/car';
import { CarSearchCriteria } from '../../../models/car-search-criteria';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-list.html',
  styleUrl: './car-list.css'
})
export class CarList implements OnInit {
  cars: Car[] = [];
  filteredCars: Car[] = [];
  loading: boolean = true;
  searchCriteria!: CarSearchCriteria;
  
  // Filter states
  maxPrice: number = 10000;
  selectedType: string = 'all';
  selectedTransmission: string = 'all';
  selectedFuelType: string = 'all';
  sortBy: string = 'price-asc';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    // Get search criteria from query params
    this.route.queryParams.subscribe(params => {
      this.searchCriteria = {
        pickupLocation: params['pickupLocation'] || '',
        dropoffLocation: params['dropoffLocation'] || params['pickupLocation'] || '',
        pickupDate: params['pickupDate'] || '',
        pickupTime: params['pickupTime'] || '10:00',
        dropoffDate: params['dropoffDate'] || '',
        dropoffTime: params['dropoffTime'] || '10:00',
        carType: params['carType'],
        transmission: params['transmission'],
        minSeats: parseInt(params['minSeats']) || undefined
      };
      
      this.loadCars();
    });
  }

  /**
   * Load cars based on search criteria
   */
  private loadCars(): void {
    this.loading = true;
    
    this.carService.searchCars(this.searchCriteria).subscribe({
      next: (cars) => {
        this.cars = cars;
        this.filteredCars = cars;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cars:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Apply all filters and sorting
   */
  applyFilters(): void {
    let filtered = [...this.cars];

    // Filter by price
    filtered = filtered.filter(c => c.pricePerDay <= this.maxPrice);

    // Filter by type
    if (this.selectedType !== 'all') {
      filtered = filtered.filter(c => c.type === this.selectedType);
    }

    // Filter by transmission
    if (this.selectedTransmission !== 'all') {
      filtered = filtered.filter(c => c.transmission === this.selectedTransmission);
    }

    // Filter by fuel type
    if (this.selectedFuelType !== 'all') {
      filtered = filtered.filter(c => c.fuelType === this.selectedFuelType);
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'seats':
        filtered.sort((a, b) => b.seats - a.seats);
        break;
    }

    this.filteredCars = filtered;
  }

  /**
   * Handle filter changes
   */
  onFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Select a car
   */
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

  /**
   * Add car to favorites
   */
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

  /**
   * Check if car is in favorites
   */
  isFavorite(car: Car): boolean {
    return this.storageService.isFavorite('car', car.id);
  }

  /**
   * Go back to search
   */
  backToSearch(): void {
    this.router.navigate(['/cars']);
  }

  /**
   * Calculate rental duration in days
   */
  calculateDays(): number {
    if (this.searchCriteria.pickupDate && this.searchCriteria.dropoffDate) {
      const date1 = new Date(this.searchCriteria.pickupDate);
      const date2 = new Date(this.searchCriteria.dropoffDate);
      const diffTime = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1; // Minimum 1 day
    }
    return 1;
  }

  /**
   * Format currency
   */
  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }

  /**
   * Get rating stars array
   */
  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  /**
   * Check if rating has half star
   */
  hasHalfStar(rating: number): boolean {
    return rating % 1 >= 0.5;
  }

  /**
   * Get transmission icon
   */
  getTransmissionIcon(transmission: string): string {
    return transmission === 'automatic' ? '⚙️' : '🔧';
  }

  /**
   * Get fuel type icon
   */
  getFuelTypeIcon(fuelType: string): string {
    const icons: any = {
      'petrol': '⛽',
      'diesel': '🛢️',
      'electric': '🔌',
      'hybrid': '🔋'
    };
    return icons[fuelType] || '⛽';
  }
}

/*
 * CAR LIST COMPONENT EXPLANATION:
 * 
 * Key Features:
 * 1. Multiple filter options (type, transmission, fuel, price)
 * 2. Sort by price, rating, or seats
 * 3. Calculate total rental cost (days × daily rate)
 * 4. Visual icons for transmission and fuel type
 * 5. Feature badges (seats, doors, luggage)
 * 
 * Filtering Logic:
 * - Price: Max daily rate slider
 * - Type: Dropdown (sedan, suv, van, etc.)
 * - Transmission: Automatic vs Manual
 * - Fuel Type: Petrol, Diesel, Electric, Hybrid
 * 
 * Sorting Options:
 * - Price (low to high, high to low)
 * - Rating (highest first)
 * - Seats (most seats first)
 * 
 * Display Features:
 * - Car specifications (seats, doors, luggage)
 * - Features list (GPS, AC, etc.)
 * - Rental company name
 * - Daily price + total cost calculation
 */