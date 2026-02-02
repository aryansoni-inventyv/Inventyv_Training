import { Component, inject, Inject } from '@angular/core';
import { Product } from '../product';
import { CartServiceService } from '../cart-service.service';
import { CartHeaderComponent } from '../cart-header/cart-header.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CartHeaderComponent , CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})

export class ProductListComponent {
  productData : Product[] = [
    {id: 1, name: 'Laptop', price: 1000},
    {id: 2, name: 'Smartphone', price: 500},
    {id: 3, name: 'Tablet', price: 300},
    {id: 4, name: 'Headphones', price: 150}
  ];

  cartservice : CartServiceService =  inject(CartServiceService);

  addToCart(product: Product) {
    this.cartservice.addTocart(product);
    console.log(`${product.name} ${product.id } added to cart.`);
  }

}
