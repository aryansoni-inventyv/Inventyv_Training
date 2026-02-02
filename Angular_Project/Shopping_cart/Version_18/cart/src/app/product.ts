export interface Product {
    id: number;
    name: string;
    price: number ;
}


export interface CartItem {
    quantity : number ;
    product :  Product;
}