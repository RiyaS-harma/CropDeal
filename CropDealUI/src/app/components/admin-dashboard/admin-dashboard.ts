import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  stats = { totalFarmers: 0, totalDealers: 0, totalOrders: 0, totalRevenue: 0, activeFarmers: 0, activeDealers: 0 };
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) { window.location.href = '/login'; return; }
    this.loadStats();
  }

  loadStats(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.adminUrl}/api/admin/users`, { headers }).subscribe({
      next: (users) => {
        this.stats.totalFarmers = users.filter(u => u.userType === 'Farmer').length;
        this.stats.totalDealers = users.filter(u => u.userType === 'Dealer').length;
        this.stats.activeFarmers = users.filter(u => u.userType === 'Farmer' && u.isActive).length;
        this.stats.activeDealers = users.filter(u => u.userType === 'Dealer' && u.isActive).length;
        this.loading = false;
      },
      error: (error) => { console.error('Error loading users:', error); this.loading = false; }
    });

    this.http.get<any[]>(`${environment.adminUrl}/api/admin/orders`, { headers }).subscribe({
      next: (orders) => {
        this.stats.totalOrders = orders.length;
        this.stats.totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }
}
