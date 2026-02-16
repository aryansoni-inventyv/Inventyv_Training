import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ CORRECT: Only import modules, not classes
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // Active tab state
  activeTab: 'flights' | 'hotels' | 'cars' = 'flights';

  constructor(private router: Router) {} // ✅ Router is injected, not imported

  /**
   * Switch between tabs
   * @param tab - Tab name to activate
   */
  selectTab(tab: 'flights' | 'hotels' | 'cars'): void {
    this.activeTab = tab;
  }

  /**
   * Navigate to search page
   */
  navigateToSearch(): void {
    this.router.navigate([`/${this.activeTab}`]);
  }
}