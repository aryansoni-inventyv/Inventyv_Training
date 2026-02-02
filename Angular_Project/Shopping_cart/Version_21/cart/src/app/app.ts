import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { ProductList } from './product-list/product-list';
import { ProductCart } from './product-cart/product-cart';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [ ProductList , ProductCart],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('cart');
}
