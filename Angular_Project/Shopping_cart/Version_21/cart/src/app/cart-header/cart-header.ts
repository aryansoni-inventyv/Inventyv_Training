import { Component, signal, effect, inject } from '@angular/core';
import { CartService } from '../cart-service';

@Component({
  selector: 'app-cart-header',
  standalone: true,
  imports: [],
  templateUrl: './cart-header.html',
  styleUrls: ['./cart-header.css']
})
export class CartHeader {
  cartService = inject(CartService);
  // Direct reference to service signal
  totalItemsCount = this.cartService.totalItemsCount;
  
  // Signal to control pulse animation
  showPulse = signal(false);

  constructor() {
    // Effect runs whenever totalItemsCount changes
    // This is the Signals way of handling side effects!
    // No subscription needed, automatic cleanup!
    effect(() => {
      const count = this.totalItemsCount();
      
      // Trigger pulse animation when count increases
      if (count > 0) {
        this.triggerPulse();
      }
    });
  }

  private triggerPulse(): void {
    this.showPulse.set(true);
    setTimeout(() => {
      this.showPulse.set(false);
    }, 500);
  }
}