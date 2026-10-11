import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dealer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dealer-dashboard.html',
  styleUrls: ['./dealer-dashboard.css']
})
export class DealerDashboardComponent implements OnInit {
  dashboardData: any = { totalOrders: 0, pendingOrders: 0, totalSpent: 0 };
  recentOrders: any[] = [];
  loading = true;
  userName: string = 'Dealer';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private userService: UserService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) { this.router.navigate(['/login']); return; }
    this.loadUserName();
    this.loadDashboard();
    this.loadRecentOrders();
  }

  loadUserName(): void {
    const user = localStorage.getItem('user');
    if (user) { const userData = JSON.parse(user); this.userName = userData.firstName || 'Dealer'; }
  }

  loadDashboard(): void {
    this.userService.getDashboard().subscribe({
      next: (data) => { this.dashboardData = data; this.loading = false; },
      error: (error) => { console.error('Error loading dashboard:', error); this.loading = false; }
    });
  }

  loadRecentOrders(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(`${environment.orderUrl}/api/orders/my-orders`, { headers }).subscribe({
      next: (data) => {
        const statusMap: { [key: number]: string } = { 1: 'Pending', 2: 'Confirmed', 3: 'Completed', 4: 'Cancelled' };
        this.recentOrders = data.slice(0, 5).map(order => ({
          ...order,
          cropName: order.cropName || order.crop?.cropName || 'N/A',
          status: typeof order.status === 'string' ? order.status : (statusMap[order.status] || 'Unknown'),
          farmerName: order.farmer ? `${order.farmer.firstName} ${order.farmer.lastName}` : 'N/A'
        }));
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }
}
