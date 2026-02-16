// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Home } from './component/home/home';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'Skyscanner Clone';
  
  // Track if mobile menu is open
  mobileMenuOpen = false;

  constructor(private router: Router) {}

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
   * Close mobile menu when navigating
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  /**
   * Check if we're on the home page
   */
  isHomePage(): boolean {
    return this.router.url === '/' || this.router.url === '/home';
  }

  /**
   * Navigate to home
   */
  goHome(): void {
    this.router.navigate(['/home']);
    this.closeMobileMenu();
  }
}

/*
 * APP COMPONENT EXPLANATION:
 * 
 * This is the ROOT component of your Angular application.
 * It wraps around all other components and provides:
 * 
 * 1. Navigation Bar:
 *    - Logo/brand
 *    - Navigation links (Home, Flights, Hotels, Cars)
 *    - Mobile menu toggle
 * 
 * 2. RouterOutlet:
 *    - Displays the current route's component
 *    - This is where your pages (Home, Flights, etc.) appear
 * 
 * 3. Footer:
 *    - Copyright information
 *    - Additional links (optional)
 * 
 * Key Features:
 * - Sticky navigation bar (stays at top when scrolling)
 * - Active route highlighting (shows which page you're on)
 * - Mobile-responsive menu (hamburger on small screens)
 * - RouterLink for navigation (no page reload)
 * - RouterLinkActive for active link styling
 * 
 * Component Structure:
 * +----------------------------------+
 * |          Navigation              |
 * +----------------------------------+
 * |                                  |
 * |         <router-outlet>          |
 * |     (Your pages render here)     |
 * |                                  |
 * +----------------------------------+
 * |            Footer                |
 * +----------------------------------+
 */