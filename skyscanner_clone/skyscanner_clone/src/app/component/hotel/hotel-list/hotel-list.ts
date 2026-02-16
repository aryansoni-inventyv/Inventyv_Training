// src/app/component/hotel/hotel-list/hotel-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../../../service/hotel-service';
import { StorageService } from '../../../service/storage-service';
import { Hotel } from '../../../models/hotel';
import { HotelSearchCriteria } from '../../../models/hotel-search-criteria';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel-list.html',
  styleUrl: './hotel-list.css'
})
export class HotelList implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  loading: boolean = true;
  searchCriteria!: HotelSearchCriteria;
  
  // Filter states
  maxPrice: number = 50000;
  selectedRating: number = 0;
  selectedAmenities: string[] = [];
  availableAmenities: string[] = [];
  sortBy: string = 'price-asc';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    // Get search criteria from query params
    this.route.queryParams.subscribe(params => {
      this.searchCriteria = {
        destination: params['destination'] || '',
        checkInDate: params['checkInDate'] || '',
        checkOutDate: params['checkOutDate'] || '',
        guests: parseInt(params['guests']) || 2,
        rooms: parseInt(params['rooms']) || 1,
        minRating: parseInt(params['minRating']) || undefined,
        maxPrice: parseInt(params['maxPrice']) || undefined
      };
      
      this.loadHotels();
    });

    // Load available amenities
    this.hotelService.getAvailableAmenities().subscribe(amenities => {
      this.availableAmenities = amenities;
    });
  }

  /**
   * Load hotels based on search criteria
   */
  private loadHotels(): void {
    this.loading = true;
    
    this.hotelService.searchHotels(this.searchCriteria).subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.filteredHotels = hotels;
        
        // Set initial max price from criteria or highest hotel price
        if (this.searchCriteria.maxPrice) {
          this.maxPrice = this.searchCriteria.maxPrice;
        }
        
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Apply all filters and sorting
   */
  applyFilters(): void {
    let filtered = [...this.hotels];

    // Filter by price
    filtered = filtered.filter(h => h.pricePerNight <= this.maxPrice);

    // Filter by rating
    if (this.selectedRating > 0) {
      filtered = filtered.filter(h => h.rating >= this.selectedRating);
    }

    // Filter by amenities
    if (this.selectedAmenities.length > 0) {
      filtered = filtered.filter(hotel =>
        this.selectedAmenities.every(amenity => 
          hotel.amenities.some(ha => ha.toLowerCase().includes(amenity.toLowerCase()))
        )
      );
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.pricePerNight - b.pricePerNight);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.pricePerNight - a.pricePerNight);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    this.filteredHotels = filtered;
  }

  /**
   * Handle filter changes
   */
  onFilterChange(): void {
    this.applyFilters();
  }

  /**
   * Toggle amenity selection
   */
  toggleAmenity(amenity: string): void {
    const index = this.selectedAmenities.indexOf(amenity);
    if (index > -1) {
      this.selectedAmenities.splice(index, 1);
    } else {
      this.selectedAmenities.push(amenity);
    }
    this.applyFilters();
  }

  /**
   * Check if amenity is selected
   */
  isAmenitySelected(amenity: string): boolean {
    return this.selectedAmenities.includes(amenity);
  }

  /**
   * Select a hotel
   */
  selectHotel(hotel: Hotel): void {
    this.storageService.saveSelectedHotel(hotel);
    const nights = this.calculateNights();
    const totalPrice = hotel.pricePerNight * nights * this.searchCriteria.rooms;
    
    alert(
      `Hotel Selected: ${hotel.name}\n` +
      `Price per night: ₹${hotel.pricePerNight.toLocaleString('en-IN')}\n` +
      `${nights} night(s) × ${this.searchCriteria.rooms} room(s)\n` +
      `Total: ₹${totalPrice.toLocaleString('en-IN')}`
    );
  }

  /**
   * Add hotel to favorites
   */
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

  /**
   * Check if hotel is in favorites
   */
  isFavorite(hotel: Hotel): boolean {
    return this.storageService.isFavorite('hotel', hotel.id);
  }

  /**
   * Go back to search
   */
  backToSearch(): void {
    this.router.navigate(['/hotels']);
  }

  /**
   * Calculate number of nights
   */
  calculateNights(): number {
    if (this.searchCriteria.checkInDate && this.searchCriteria.checkOutDate) {
      const date1 = new Date(this.searchCriteria.checkInDate);
      const date2 = new Date(this.searchCriteria.checkOutDate);
      const diffTime = Math.abs(date2.getTime() - date1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
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
   * Get star rating array for display
   */
  getStarArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  /**
   * Get empty star array for display
   */
  getEmptyStarArray(rating: number): number[] {
    return Array(5 - rating).fill(0);
  }
}

/*
 * HOTEL LIST COMPONENT EXPLANATION:
 * 
 * Key Differences from Flight List:
 * 1. Amenities filter (checkboxes for WiFi, Pool, Spa, etc.)
 * 2. Star rating filter (1-5 stars)
 * 3. Review count sorting option
 * 4. Total price calculation (nights × rooms × price)
 * 5. Visual star rating display
 * 
 * Filtering Logic:
 * - Price: Max price per night slider
 * - Rating: Minimum star rating dropdown
 * - Amenities: Multi-select checkboxes
 * - All filters work together (AND operation)
 * 
 * Sorting Options:
 * - Price (low to high, high to low)
 * - Rating (highest first)
 * - Reviews (most reviewed first)
 */