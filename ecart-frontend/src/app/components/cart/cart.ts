// src/app/components/cart/cart.ts
import { Component } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService, type CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {
  constructor(public cartService: CartService) {}

  items(): CartItem[] {
    return this.cartService.items;
  }

  total(): number {
    return this.cartService.total;
  }

  remove(id: string): void {
    this.cartService.removeFromCart(id);
  }
}
