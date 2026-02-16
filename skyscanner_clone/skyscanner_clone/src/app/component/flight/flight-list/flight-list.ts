import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightService } from '../../../service/flight-service';
import { StorageService } from '../../../service/storage-service';
import { Flight } from '../../../models/flight';
import { FlightSearchCriteria } from '../../../models/flight-search-criteria';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-list.html',  
  styleUrl: './flight-list.css'
})
export class FlightList implements OnInit {
  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  loading: boolean = true;
  searchCriteria!: FlightSearchCriteria;
  
  maxPrice: number = 10000;
  selectedClass: string = 'all';
  selectedStops: string = 'all';
  sortBy: string = 'price-asc';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flightService: FlightService,
    private storageService: StorageService
  ) {
    console.log('🟢 FlightListComponent: Constructor called');
  }

  ngOnInit(): void {
    console.log('🟢 FlightListComponent: ngOnInit called');
    
    this.route.queryParams.subscribe(params => {
      console.log('📥 FlightListComponent: Query params received:', params);
      
      this.searchCriteria = {
        from: params['from'] || '',
        to: params['to'] || '',
        departureDate: params['departureDate'] || '',
        returnDate: params['returnDate'],
        passengers: parseInt(params['passengers']) || 1,
        class: params['class'] || 'economy',
        tripType: params['tripType'] || 'one-way'
      };
      
      console.log('🔍 FlightListComponent: Search criteria created:', this.searchCriteria);
      this.loadFlights();
    });
  }

  private loadFlights(): void {
    console.log('🔄 FlightListComponent: loadFlights() called');
    this.loading = true;
    
    console.log('📞 FlightListComponent: Calling flightService.searchFlights()');
    
    this.flightService.searchFlights(this.searchCriteria).subscribe({
      next: (flights) => {
        console.log('✅ FlightListComponent: Received flights from service:', flights.length);
        console.log('📊 FlightListComponent: Flight data:', flights);
        
        this.flights = flights;
        this.filteredFlights = flights;
        
        console.log('🔍 FlightListComponent: Before applyFilters - filteredFlights.length:', this.filteredFlights.length);
        this.applyFilters();
        console.log('🔍 FlightListComponent: After applyFilters - filteredFlights.length:', this.filteredFlights.length);
        
        this.loading = false;
        console.log('✅ FlightListComponent: Loading complete. Final count:', this.filteredFlights.length);
      },
      error: (error) => {
        console.error('❌ FlightListComponent: Error loading flights!', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    console.log('🔧 FlightListComponent: applyFilters() called');
    console.log('🔧 Current filters:', {
      maxPrice: this.maxPrice,
      selectedClass: this.selectedClass,
      selectedStops: this.selectedStops,
      sortBy: this.sortBy
    });
    
    let filtered = [...this.flights];
    console.log('🔧 Starting with', filtered.length, 'flights');

    // Filter by price
    const beforePrice = filtered.length;
    filtered = filtered.filter(f => f.price <= this.maxPrice);
    console.log(`🔧 After price filter (max: ${this.maxPrice}): ${beforePrice} → ${filtered.length}`);

    // Filter by class
    if (this.selectedClass !== 'all') {
      const beforeClass = filtered.length;
      filtered = filtered.filter(f => f.class === this.selectedClass);
      console.log(`🔧 After class filter (${this.selectedClass}): ${beforeClass} → ${filtered.length}`);
    }

    // Filter by stops
    if (this.selectedStops === 'non-stop') {
      const beforeStops = filtered.length;
      filtered = filtered.filter(f => f.stops === 0);
      console.log(`🔧 After stops filter (non-stop): ${beforeStops} → ${filtered.length}`);
    } else if (this.selectedStops === 'one-stop') {
      const beforeStops = filtered.length;
      filtered = filtered.filter(f => f.stops === 1);
      console.log(`🔧 After stops filter (one-stop): ${beforeStops} → ${filtered.length}`);
    }

    // Apply sorting
    console.log(`🔧 Applying sort: ${this.sortBy}`);
    switch (this.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'duration':
        filtered.sort((a, b) => 
          this.parseDuration(a.duration) - this.parseDuration(b.duration)
        );
        break;
      case 'departure':
        filtered.sort((a, b) => 
          a.departureTime.localeCompare(b.departureTime)
        );
        break;
    }

    this.filteredFlights = filtered;
    console.log('✅ applyFilters complete. Final filtered count:', this.filteredFlights.length);
    
    if (this.filteredFlights.length === 0) {
      console.warn('⚠️ WARNING: No flights after filtering!');
      console.warn('⚠️ Check your search criteria and filters');
    }
  }

  private parseDuration(duration: string): number {
    const hours = duration.match(/(\d+)h/);
    const minutes = duration.match(/(\d+)m/);
    return (hours ? parseInt(hours[1]) * 60 : 0) + (minutes ? parseInt(minutes[1]) : 0);
  }

  onFilterChange(): void {
    console.log('🔄 Filter changed, reapplying filters...');
    this.applyFilters();
  }

  selectFlight(flight: Flight): void {
    console.log('✈️ Flight selected:', flight);
    this.storageService.saveSelectedFlight(flight);
    alert(`Flight ${flight.flightNumber} selected!\nPrice: ₹${flight.price}\nFrom: ${flight.from} to ${flight.to}`);
  }

  toggleFavorite(flight: Flight, event: Event): void {
    event.stopPropagation();
    
    if (this.isFavorite(flight)) {
      this.storageService.removeFavorite('flight', flight.id);
      console.log('❤️ Removed from favorites:', flight.flightNumber);
      alert('Removed from favorites');
    } else {
      this.storageService.saveFavorite('flight', flight);
      console.log('💖 Added to favorites:', flight.flightNumber);
      alert('Added to favorites');
    }
  }

  isFavorite(flight: Flight): boolean {
    return this.storageService.isFavorite('flight', flight.id);
  }

  backToSearch(): void {
    console.log('🔙 Navigating back to search');
    this.router.navigate(['/flights']);
  }

  formatPrice(price: number): string {
    return `₹${price.toLocaleString('en-IN')}`;
  }
}