import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void { this.loadCart(); }

  loadCart(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(`${environment.cartUrl}/api/cartitem`, { headers }).subscribe({
      next: (data) => { this.cartItems = data; this.loading = false; },
      error: (error) => { console.error('Error loading cart:', error); this.loading = false; }
    });
  }

  removeItem(id: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(`${environment.cartUrl}/api/cartitem/${id}`, { headers }).subscribe({
      next: () => { this.cartItems = this.cartItems.filter(item => item.id !== id); },
      error: (error) => console.error('Error removing item:', error)
    });
  }

  updateQuantity(id: number, quantity: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.put(`${environment.cartUrl}/api/cartitem/${id}?quantity=${quantity}`, {}, { headers }).subscribe({
      next: () => { this.loadCart(); },
      error: (error) => console.error('Error updating quantity:', error)
    });
  }

  increaseQuantity(item: any): void { this.updateQuantity(item.id, item.quantity + 1); }
  decreaseQuantity(item: any): void { if (item.quantity > 1) this.updateQuantity(item.id, item.quantity - 1); }
  getTotalAmount(): number { return this.cartItems.reduce((sum, item) => sum + (item.quantity * (item.crop?.pricePerUnit || item.pricePerUnit || 0)), 0); }

  checkout(): void {
    if (this.cartItems.length === 0) { this.errorMessage = 'Your cart is empty!'; setTimeout(() => this.errorMessage = '', 3000); return; }
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    let ordersCreated = 0, ordersFailed = 0;
    this.cartItems.forEach((item) => {
      this.http.post(`${environment.orderUrl}/api/orders`, { cropId: item.cropId, quantity: item.quantity }, { headers }).subscribe({
        next: () => {
          ordersCreated++;
          this.removeItem(item.id);
          if (ordersCreated + ordersFailed === this.cartItems.length && ordersCreated > 0) {
            this.successMessage = `${ordersCreated} order(s) placed successfully!`;
            setTimeout(() => { this.router.navigate(['/dealer/orders']); }, 2000);
          }
        },
        error: (error) => {
          ordersFailed++;
          console.error('Error creating order:', error);
          if (ordersCreated + ordersFailed === this.cartItems.length) {
            if (ordersCreated > 0) { this.successMessage = `${ordersCreated} order(s) placed. ${ordersFailed} failed.`; setTimeout(() => this.router.navigate(['/dealer/orders']), 2000); }
            else { this.errorMessage = 'Failed to place orders.'; setTimeout(() => this.errorMessage = '', 3000); }
          }
        }
      });
    });
  }
}
