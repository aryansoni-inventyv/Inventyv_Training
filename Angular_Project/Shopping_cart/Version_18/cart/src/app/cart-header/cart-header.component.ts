import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartServiceService } from '../cart-service.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-header.component.html',
  styleUrl: './cart-header.component.css'
})
export class CartHeaderComponent implements OnInit, OnDestroy {
  totalItemsCount: number = 0;
  private cartSubscription?: Subscription;

  constructor(private cartService: CartServiceService ) {}

  ngOnInit(): void {
    // Subscribe to cart changes to update the badge count
    this.cartSubscription = this.cartService.cart$.subscribe(() => {
      this.totalItemsCount = this.cartService.getTotalItemsCount();
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }
}
