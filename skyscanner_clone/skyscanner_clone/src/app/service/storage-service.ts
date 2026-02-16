import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setItem(key : string , value : any) : void {
    try {
      const jsonString = JSON.stringify(value);
      localStorage.setItem(key , jsonString);
    } catch (error) {
      console.error('Error saving to localStorage:', error);      
    }
  }

  getItem<T>(key : string) : T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) as T : null ;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  removeItem(key: string) : void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  clear(): void{
    
    try {
      localStorage.clear();  
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }


  hasItem(key : string) : boolean {
    return localStorage.getItem(key) != null ;
  }

  saveFlightSearch(searchData: any): void {
    const history = this.getFlightSearchHistory();
    history.unshift({ ...searchData, timestamp: new Date().toISOString() });
    // Keep only last 10 searches
    if (history.length > 10) {
      history.pop();
    }
    this.setItem('flightSearchHistory', history);
  }

  getFlightSearchHistory(): any[] {
    return this.getItem<any[]>('flightSearchHistory') || [];
  }


  saveSelectedFlight(flight: any): void {
    this.setItem('selectedFlight', flight);
  }

  getSelectedFlight(): any {
    return this.getItem('selectedFlight');
  }

  saveHotelSearch(searchData: any): void {
    const history = this.getHotelSearchHistory();
    history.unshift({ ...searchData, timestamp: new Date().toISOString() });
    if (history.length > 10) {
      history.pop();
    }
    this.setItem('hotelSearchHistory', history);
  }

  getHotelSearchHistory(): any[] {
    return this.getItem<any[]>('hotelSearchHistory') || [];
  }

  saveSelectedHotel(hotel: any): void {
    this.setItem('selectedHotel', hotel);
  }

  getSelectedHotel(): any {
    return this.getItem('selectedHotel');
  }

  saveCarSearch(searchData: any): void {
    const history = this.getCarSearchHistory();
    history.unshift({ ...searchData, timestamp: new Date().toISOString() });
    if (history.length > 10) {
      history.pop();
    }
    this.setItem('carSearchHistory', history);
  }

  getCarSearchHistory(): any[] {
    return this.getItem<any[]>('carSearchHistory') || [];
  }

  saveSelectedCar(car: any): void {
    this.setItem('selectedCar', car);
  }

  getSelectedCar(): any {
    return this.getItem('selectedCar');
  }

  saveUserPreferences(preferences: any): void {
    this.setItem('userPreferences', preferences);
  }

  getUserPreferences(): any {
    return this.getItem('userPreferences') || {
      currency: 'INR',
      language: 'en',
      theme: 'light'
    };
  }

  saveFavorite(type: 'flight' | 'hotel' | 'car', item: any): void {
    const favorites = this.getFavorites(type);
    // Avoid duplicates
    if (!favorites.some((fav: any) => fav.id === item.id)) {
      favorites.push(item);
      this.setItem(`${type}Favorites`, favorites);
    }
  }

  getFavorites(type: 'flight' | 'hotel' | 'car'): any[] {
    return this.getItem<any[]>(`${type}Favorites`) || [];
  }

  removeFavorite(type: 'flight' | 'hotel' | 'car', itemId: string): void {
    const favorites = this.getFavorites(type);
    const filtered = favorites.filter((fav: any) => fav.id !== itemId);
    this.setItem(`${type}Favorites`, filtered);
  }

  isFavorite(type: 'flight' | 'hotel' | 'car', itemId: string): boolean {
    const favorites = this.getFavorites(type);
    return favorites.some((fav: any) => fav.id === itemId);
  }
}
