import { Component, inject } from '@angular/core';
import { CartService } from '../cart-service';
// import { CartHeader } from '../cart-header/cart-header';

@Component({
  selector: 'app-product-cart',
  standalone :  true , 
  imports: [],
  templateUrl: './product-cart.html',
  styleUrls: ['./product-cart.css']
})
export class ProductCart {
  
  cartService =  inject(CartService);
  // Direct access to signals from service - no subscriptions needed!
  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;
  totalItemsCount = this.cartService.totalItemsCount;


  incrementQuantity(productId: number): void {
    this.cartService.incrementQuantity(productId);
  }

  decrementQuantity(productId: number): void {
    this.cartService.decrementQuantity(productId);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear the cart?')) {
      this.cartService.clearCart();
    }
  }
}