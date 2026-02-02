import { Component, inject, signal } from '@angular/core';
import { Product } from '../product';
import { CartService } from '../cart-service';
import { CartHeader } from '../cart-header/cart-header';

@Component({
  selector: 'app-product-list',
  standalone : true,
  imports: [CartHeader],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  products =  signal<Product[]>([
    { id: 1, name: 'Laptop', price: 1000 },
    { id: 2, name: 'Smartphone', price: 500 },
    { id: 3, name: 'Tablet', price: 300 },
    { id: 4, name: 'Headphones', price: 150 }
  ]);


  cartService =  inject(CartService);
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    console.log(`${product.name} (ID: ${product.id}) added to cart.`);
  }
}
