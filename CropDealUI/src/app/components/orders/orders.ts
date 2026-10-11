import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  totalOrders = 0;
  pendingOrders = 0;
  completedOrders = 0;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadOrders();
    this.route.params.subscribe(() => { if (this.orders.length > 0) this.loadOrders(); });
  }

  loadOrders(): void {
    this.loading = true;
    this.orders = [];
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(`${environment.orderUrl}/api/orders/my-orders`, { headers }).subscribe({
      next: async (data) => {
        this.totalOrders = data.length;
        this.pendingOrders = data.filter(o => this.normalizeStatus(o.status) === 'Pending').length;
        this.completedOrders = data.filter(o => this.normalizeStatus(o.status) === 'Completed').length;
        const ordersWithNames = await Promise.all(data.map(async order => {
          const userType = localStorage.getItem('userType');
          const cropName = order.cropName || order.crop?.cropName || 'N/A';
          const orderDate = order.orderDate || order.createdAt;
          const status = this.normalizeStatus(order.status);
          const farmerName = order.farmer ? `${order.farmer.firstName} ${order.farmer.lastName}` : 'N/A';
          const dealerName = order.dealer ? `${order.dealer.firstName} ${order.dealer.lastName}` : 'N/A';
          const counterpartName = userType === '1' ? dealerName : farmerName;
          const hasRating = await this.checkIfRated(order.id, headers);
          return { ...order, cropName, orderDate, status, counterpartName, hasRating };
        }));
        this.orders = ordersWithNames;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => { console.error('Error loading orders:', error); this.loading = false; }
    });
  }

  async checkIfRated(orderId: number, headers: HttpHeaders): Promise<boolean> {
    try {
      const userId = localStorage.getItem('userId');
      const ratings = await this.http.get<any[]>(`${environment.ratingUrl}/api/ratingreview/by-reviewer/${userId}`, { headers }).toPromise();
      return ratings?.some(r => Number(r.orderId) === Number(orderId)) || false;
    } catch { return false; }
  }

  async getUserName(userId: string, headers: HttpHeaders): Promise<string> {
    try {
      const user = await this.http.get<any>(`${environment.apiUrl}/api/user/${userId}`, { headers }).toPromise();
      return `${user.firstName} ${user.lastName}`;
    } catch { return 'N/A'; }
  }

  async getDealerName(dealerId: string, headers: HttpHeaders): Promise<string> {
    try {
      const user = await this.http.get<any>(`${environment.apiUrl}/api/user/${dealerId}`, { headers }).toPromise();
      return `${user.firstName} ${user.lastName}`;
    } catch { return 'N/A'; }
  }

  normalizeStatus(status: any): string {
    if (typeof status === 'string') return status;
    const map: { [key: number]: string } = { 1: 'Pending', 2: 'Confirmed', 3: 'Completed', 4: 'Cancelled' };
    return map[status] || 'Unknown';
  }

  getStatusClass(status: string) {
    return { 'pending': status === 'Pending', 'shipped': status === 'Confirmed', 'completed': status === 'Completed' };
  }

  confirmOrder(orderId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.put(`${environment.orderUrl}/api/orders/${orderId}/confirm`, {}, { headers }).subscribe({
      next: () => { this.successMessage = 'Order confirmed successfully!'; setTimeout(() => this.successMessage = '', 3000); this.loadOrders(); },
      error: (error) => { console.error('Error confirming order:', error); this.errorMessage = 'Failed to confirm order'; setTimeout(() => this.errorMessage = '', 3000); }
    });
  }

  getUserType(): string | null { return localStorage.getItem('userType'); }
  payNow(orderId: number): void { this.router.navigate(['/dealer/payment'], { queryParams: { orderId } }); }
  giveRating(order: any): void { this.router.navigate(['/dealer/ratings'], { queryParams: { orderId: order.id }, state: { order } }); }
}
