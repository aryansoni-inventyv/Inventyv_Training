import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlightService } from '../../../service/flight-service';
import { StorageService } from '../../../service/storage-service';
import { Flight } from '../../../models/flight';
import { FlightSearchCriteria } from '../../../models/flight-search-criteria';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-flight-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './flight-component.html',
  styleUrl: './flight-component.css'
})
export class FlightComponent implements OnInit {
  searchForm!: FormGroup;
  
  // All flights and filtered flights
  allFlights: Flight[] = [];
  filteredFlights: Flight[] = [];
  loading: boolean = true;
  quickSearchText: string = '';
  
  cities: string[] = [];
  recentSearches: any[] = [];
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private flightService: FlightService,
    private storageService: StorageService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadCities();
    this.loadRecentSearches();
    this.loadAllFlights(); // Load all flights on page load
  }


  onQuickSearch(): void {
  const text = this.quickSearchText.toLowerCase();

  if (!text) {
    this.filteredFlights = this.allFlights;
    return;
  }

  this.filteredFlights = this.allFlights.filter(flight =>
    flight.airline.toLowerCase().includes(text) ||
    flight.from.toLowerCase().includes(text) ||
    flight.to.toLowerCase().includes(text) ||
    flight.flightNumber.toLowerCase().includes(text)
  );
}

clearQuickSearch(): void {
  this.quickSearchText = '';
  this.filteredFlights = this.allFlights;
}

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      tripType: ['one-way'],
      from: ['', [Validators.required, Validators.minLength(2)]],
      to: ['', [Validators.required, Validators.minLength(2)]],
      departureDate: ['', Validators.required],
      returnDate: [''],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
      class: ['economy', Validators.required]
    });

    this.searchForm.get('tripType')?.valueChanges.subscribe(tripType => {
      const returnDateControl = this.searchForm.get('returnDate');
      if (tripType === 'round-trip') {
        returnDateControl?.setValidators([Validators.required]);
      } else {
        returnDateControl?.clearValidators();
      }
      returnDateControl?.updateValueAndValidity();
    });
  }

  /**
   * Load ALL flights when page loads
   */
  private loadAllFlights(): void {
    console.log('📥 Loading all flights...');
    this.loading = true;
    
    this.flightService.getAllFlights().subscribe({
      next: (flights) => {
        console.log('✅ All flights loaded:', flights.length);
        this.allFlights = flights;
        this.filteredFlights = flights; // Show all initially
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error loading flights:', err);
        this.loading = false;
      }
    });
  }

  private loadCities(): void {
    this.flightService.getCities().subscribe(cities => {
      this.cities = cities;
    });
  }

  private loadRecentSearches(): void {
    this.recentSearches = this.storageService.getFlightSearchHistory();
  }

  /**
   * Search/Filter flights based on form criteria
   */
  onSearch(): void {
    if (this.searchForm.valid) {
      const formValue = this.searchForm.value;
      
      const criteria: FlightSearchCriteria = {
        from: formValue.from,
        to: formValue.to,
        departureDate: formValue.departureDate,
        returnDate: formValue.tripType === 'round-trip' ? formValue.returnDate : undefined,
        passengers: formValue.passengers,
        class: formValue.class,
        tripType: formValue.tripType
      };

      console.log('🔍 Searching with criteria:', criteria);

      // Save to search history
      this.storageService.saveFlightSearch(criteria);

      // Filter flights
      this.flightService.searchFlights(criteria).subscribe({
        next: (flights) => {
          console.log('✅ Search results:', flights.length, 'flights');
          this.filteredFlights = flights;
        },
        error: (err) => {
          console.error('❌ Search error:', err);
        }
      });
    } else {
      this.markFormGroupTouched(this.searchForm);
    }
  }

  /**
   * Reset to show all flights
   */
  onReset(): void {
    this.searchForm.reset({
      tripType: 'one-way',
      passengers: 1,
      class: 'economy'
    });
    this.filteredFlights = this.allFlights; // Show all flights
    console.log('🔄 Reset - showing all flights');
  }

  /**
   * Select a flight
   */
  selectFlight(flight: Flight): void {
    console.log('✈️ Flight selected:', flight);
    this.storageService.saveSelectedFlight(flight);
    alert(`Flight ${flight.flightNumber} selected!\n${flight.from} → ${flight.to}\nPrice: ₹${flight.price.toLocaleString('en-IN')}`);
  }

  /**
   * Toggle favorite
   */
  toggleFavorite(flight: Flight, event: Event): void {
    event.stopPropagation();
    
    if (this.isFavorite(flight)) {
      this.storageService.removeFavorite('flight', flight.id);
      alert('Removed from favorites');
    } else {
      this.storageService.saveFavorite('flight', flight);
      alert('Added to favorites');
    }
  }

  isFavorite(flight: Flight): boolean {
    return this.storageService.isFavorite('flight', flight.id);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  swapCities(): void {
    const from = this.searchForm.get('from')?.value;
    const to = this.searchForm.get('to')?.value;
    this.searchForm.patchValue({
      from: to,
      to: from
    });
  }

  useRecentSearch(search: any): void {
    this.searchForm.patchValue({
      tripType: search.tripType,
      from: search.from,
      to: search.to,
      departureDate: search.departureDate,
      returnDate: search.returnDate,
      passengers: search.passengers,
      class: search.class
    });
    // Auto-search when using recent search
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
    return '';
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }
}