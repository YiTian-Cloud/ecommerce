// src/app/components/checkout/checkout.ts
import { Component, inject } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';  
import { HttpClient } from '@angular/common/http';
import { CartService, type CartItem } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent {
  private readonly http = inject(HttpClient);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  name = '';
  email = '';
  processing = false;
  message = '';

  constructor() {
    const user = this.auth.user();
    if (user) {
      this.name = user.name;
      this.email = user.email;
    }
  }

  items(): CartItem[] {
    return this.cartService.items;
  }

  total(): number {
    return this.cartService.total;
  }

  onSubmit(): void {
    if (!this.name || !this.email || this.items().length === 0) {
      this.message = 'Please fill in your details and ensure your cart is not empty.';
      return;
    }

    this.processing = true;
    this.message = '';

    const payload = {
      name: this.name,
      email: this.email,
      items: this.items(),
      total: this.total(),
    };

    console.log('Sending checkout payload:', payload);

    this.http
      .post('http://localhost:3000/api/checkout', payload)
      .subscribe({
        next: (res: any) => {
          console.log('Checkout success:', res);
          this.processing = false;
          this.message = res?.message ?? 'Order placed successfully!';
          this.cartService.clearCart();
        },
        error: (err) => {
          console.error('Checkout failed:', err);
          this.processing = false;
          this.message = 'Checkout failed, please try again.';
        },
      });
  }
}
