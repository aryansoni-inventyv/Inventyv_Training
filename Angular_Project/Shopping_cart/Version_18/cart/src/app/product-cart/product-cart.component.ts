import { Component, inject, Inject, OnDestroy, OnInit } from '@angular/core';
import { CartServiceService , CartItem } from '../cart-service.service';
import { Subscription } from 'rxjs';
import { Product } from '../product';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css'
})
export class ProductCartComponent implements OnInit , OnDestroy  { 

  cartservice : CartServiceService =  inject(CartServiceService);

  cartItems: CartItem[] = [];
  cartsubscrption? : Subscription ;
  totalamount :number = 0;
  totalitem :number = 0;
  ngOnInit(){
    
    this.cartsubscrption = this.cartservice.cart$.subscribe(items => {
        this.cartItems =  items;
        this.updateTotal();
    });
  }
  ngOnDestroy(){
    this.cartsubscrption?.unsubscribe();
  }

  updateTotal() : void{
    this.totalamount =  this.cartservice.getTotalAmount();
    this.totalitem =  this.cartservice.getTotalItemsCount();
  }

  removeProduct(product: Product): void{
    this.cartservice.removeFromCart(product);
  }

  addproductquantity(product: Product) : void{
    this.cartservice.increamentQuantity(product);
  }

  subproductquantity(product: Product) : void{
    this.cartservice.decreamentQuantity(product);
  }

  


} 
