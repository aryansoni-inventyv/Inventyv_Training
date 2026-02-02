import { Injectable } from '@angular/core';
import { Product } from './product';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
   cartItems: CartItem[] = [];

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartItemsSubject.asObservable();

  constructor() { }


  addTocart(product: Product):  void  { 
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }


    this.cartItemsSubject.next([...this.cartItems])
  }



  removeFromCart(product: any) :  void {
    this.cartItems = this.cartItems.filter(item => item.product.id !== product.id);
    this.cartItemsSubject.next([...this.cartItems]);
  }

  // updateQuantity(product :  Product  , quantity: number):  void  {
  //   const item  = this.cartItems.find(item => item.product.id === product.id);
  //   if(item){
  //     if(item.quantity <= 0){
  //       this.removeFromCart(product);
  //     }else{
  //       item.quantity = quantity;
  //       this.cartItemsSubject.next([...this.cartItems]);
  //     }
  //   }
  // }

  increamentQuantity(product :  Product) :  void {
    const item = this.cartItems.find(item => item.product.id === product.id);
    if(item){
      item.quantity += 1;
      this.cartItemsSubject.next([...this.cartItems]);
    }
  }
  decreamentQuantity(product :  Product) :  void {
    const item = this.cartItems.find(item => item.product.id === product.id);
    if(item){
      item.quantity -= 1;
      this.cartItemsSubject.next([...this.cartItems]);
    }
  }


  getCartItems(): CartItem[] {  
    return [...this.cartItems];
  }

  getTotalAmount() : number {
    return this.cartItems.reduce((total , item) => {
      return total + (item.product.price * item.quantity)
    } , 0);
  }

  getTotalItemsCount() : number { 
    return this.cartItems.reduce((total , item) =>{
      return total + item.quantity ;
    }  , 0);
  }


  clearCart() : void {
    this.cartItems = [];
    this.cartItemsSubject.next([...this.cartItems]);
  }
}
