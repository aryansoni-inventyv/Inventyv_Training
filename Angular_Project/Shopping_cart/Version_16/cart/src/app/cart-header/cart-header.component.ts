import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartServiceService } from '../cart-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-header',
  templateUrl: './cart-header.component.html',
  styleUrls: ['./cart-header.component.css']
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