import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css']
})
export class ReportsComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  loading = true;

  filters = {
    orderNumber: '',
    status: '',
    startDate: '',
    endDate: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.adminUrl}/api/admin/orders`, { headers }).subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      let match = true;

      if (this.filters.orderNumber) {
        match = match && order.id.toString().includes(this.filters.orderNumber);
      }

      if (this.filters.status) {
        match = match && order.status === this.filters.status;
      }

      if (this.filters.startDate) {
        match = match && new Date(order.orderDate) >= new Date(this.filters.startDate);
      }

      if (this.filters.endDate) {
        match = match && new Date(order.orderDate) <= new Date(this.filters.endDate);
      }

      return match;
    });
  }

  clearFilters(): void {
    this.filters = {
      orderNumber: '',
      status: '',
      startDate: '',
      endDate: ''
    };
    this.filteredOrders = this.orders;
  }

  exportReport(): void {
    const csvData = this.filteredOrders.map(o => ({
      OrderID: o.id,
      Crop: o.cropName,
      Quantity: o.quantity,
      Amount: o.totalAmount,
      Status: o.status,
      Date: new Date(o.orderDate).toLocaleDateString()
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders_report.csv';
    a.click();
  }
}
