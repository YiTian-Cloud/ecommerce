// src/app/components/orders/orders.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  total: number;
  createdAt: string;
  items: OrderItem[];
  email?: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class OrdersComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  loading = false;
  error: string | null = null;
  orders: Order[] = [];
  userEmail: string | null = null;

  ngOnInit(): void {
    const user = this.auth.user();
    this.userEmail = user?.email ?? null;

    if (!this.userEmail) {
      this.error = 'Please log in to view your orders.';
      return;
    }

    this.loadOrders();
  }

  private loadOrders(): void {
    this.loading = true;

    this.http
      .get<Order[]>(
        'http://localhost:3000/api/orders?email=' +
          encodeURIComponent(this.userEmail!)
      )
      .subscribe({
        next: (orders) => {
          console.log('Orders from backend:', orders);
          this.orders = orders;
          this.loading = false;
        },
        error: (err) => {
          console.error('Order fetch error:', err);
          this.error = 'Failed to load orders';
          this.loading = false;
        },
      });
  }
}
