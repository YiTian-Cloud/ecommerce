// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import type { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  items: CartItem[] = [];
  total = 0;

  private recalcTotal(): void {
    this.total = this.items.reduce(
      (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
      0
    );
  }

  addToCart(product: Product): void {
    // If your Product has `id` instead of `_id`, change `_id` below to `id`
    const existing = this.items.find(i => i.product._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }

    this.recalcTotal();
  }

  removeFromCart(id: string): void {
    // Match what the template passes: item.product._id
    this.items = this.items.filter(i => i.product._id !== id);
    this.recalcTotal();
  }

  clearCart(): void {
    this.items = [];
    this.total = 0;
  }
}
