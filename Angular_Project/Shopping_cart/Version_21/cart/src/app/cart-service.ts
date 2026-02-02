import { Injectable, signal, computed } from '@angular/core';
import { Product } from './product'; 

export interface CartItem {
    quantity : number ;
    product :  Product;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Private writable signal - only this service can modify it
  private cartItemsSignal = signal<CartItem[]>([]);
  
  // Public readonly signal - components can read but not write
  cartItems = this.cartItemsSignal.asReadonly();
  
  // Computed signals - automatically recalculate when cartItems changes
  totalPrice = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  });
  
  totalItemsCount = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  });

  constructor() {}

  /**
   * Add product to cart or increment quantity if already exists
   */
  addToCart(product: Product): void {
    const currentItems = this.cartItemsSignal();
    const existingItem = currentItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      // Product exists, increment quantity using update()
      this.cartItemsSignal.update(items => 
        items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // New product, add with quantity 1
      this.cartItemsSignal.update(items => [
        ...items,
        { product, quantity: 1 }
      ]);
    }
  }

  /**
   * Remove product completely from cart
   */
  removeFromCart(productId: number): void {
    this.cartItemsSignal.update(items => 
      items.filter(item => item.product.id !== productId)
    );
  }

  /**
   * Update quantity of a specific product
   * If quantity is 0 or less, removes the item
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    
    this.cartItemsSignal.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  /**
   * Increment quantity by 1
   */
  incrementQuantity(productId: number): void {
    this.cartItemsSignal.update(items =>
      items.map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  /**
   * Decrement quantity by 1
   * Removes item if quantity becomes 0
   */
  decrementQuantity(productId: number): void {
    this.cartItemsSignal.update(items => {
      return items
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0);
    });
  }

  /**
   * Clear all items from cart
   */
  clearCart(): void {
    this.cartItemsSignal.set([]);
  }

  /**
   * Get current cart items as array (for debugging or external use)
   */
  getCartItems(): CartItem[] {
    return this.cartItemsSignal();
  }
}