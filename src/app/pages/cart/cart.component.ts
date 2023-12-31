import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart, CartItem } from 'src/app/models/cart.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {

  cart: Cart =  { items: [{
    product: 'https://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 1,
    id: 1
  },
  {
    product: 'https://via.placeholder.com/150',
    name: 'snickers',
    price: 150,
    quantity: 10,
    id: 2
  }]};

  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    'product',
    'name',
    'price',
    'quantity',
    'total',
    'action'
  ]

  constructor(private cartService: CartService, private http: HttpClient) { }

  ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  onReduceQuantity(item: CartItem): void {
    this.cartService.reduceQuantity(item);
  }

  onCheckout(): void {
    this.http.post('http://https://merch-store-api.onrender.com/checkout', {
      items: this.cart.items
    }).subscribe(async(res: any) => {
      let stripe = await loadStripe('pk_test_51OSoflCHoohSjYT3XexNtDCTk4vImHI2WgQFyGHes3VMkBWbdu24WSjm349fA2QI7vcISm7oaai1kfk41jiIJMTN0016rO0tGF');
      stripe?.redirectToCheckout({
        sessionId: res.id
      })
    })
  }

}
