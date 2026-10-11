import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-dealers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-dealers.html',
  styleUrls: ['./manage-dealers.css']
})
export class ManageDealersComponent implements OnInit {
  dealers: any[] = [];
  loading = true;
  editingDealer: any = null;
  showEditModal = false;
  viewingRatings: any = null;
  showRatingsModal = false;
  ratings: any[] = [];
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadDealers();
  }

  loadDealers(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.adminUrl}/api/admin/dealers`, { headers }).subscribe({
      next: (users) => {
        this.dealers = users;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => this.loading = false
    });
  }

  editDealer(dealer: any): void {
    this.editingDealer = { ...dealer };
    this.showEditModal = true;
  }

  saveEdit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put(`${environment.adminUrl}/api/admin/dealers/${this.editingDealer.id}/profile`, this.editingDealer, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Dealer updated successfully!';
        setTimeout(() => this.successMessage = '', 3000);
        this.showEditModal = false;
        this.loadDealers();
      },
      error: () => {
        this.errorMessage = 'Failed to update dealer';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  toggleStatus(dealer: any): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const previousState = dealer.isActive;
    const action = previousState ? 'deactivated' : 'activated';

    this.http.put(`${environment.adminUrl}/api/admin/dealers/${dealer.id}/toggle-status`, {}, { headers }).subscribe({
      next: () => {
        dealer.isActive = !previousState;
        this.successMessage = `Dealer ${dealer.firstName} ${dealer.lastName} has been ${action} successfully!`;
        setTimeout(() => this.successMessage = '', 3000);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error toggling status:', error);
        dealer.isActive = previousState;
        this.errorMessage = 'Failed to update status: ' + (error.error?.message || error.message);
        setTimeout(() => this.errorMessage = '', 3000);
        this.cdr.detectChanges();
      }
    });
  }

  viewRatings(dealer: any): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.adminUrl}/api/admin/dealers/${dealer.id}/ratings`, { headers }).subscribe({
      next: (data) => {
        this.ratings = data;
        this.viewingRatings = dealer;
        this.showRatingsModal = true;
      },
      error: () => {
        this.errorMessage = 'Failed to load ratings';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  exportReport(): void {
    const csvData = this.dealers.map(d => ({
      ID: d.id,
      Name: `${d.firstName} ${d.lastName}`,
      Email: d.email,
      Phone: d.phoneNumber,
      Location: d.location || 'N/A',
      Status: d.isActive ? 'Active' : 'Inactive'
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dealers_report.csv';
    a.click();
  }

  closeModal(): void {
    this.showEditModal = false;
    this.showRatingsModal = false;
    this.editingDealer = null;
    this.viewingRatings = null;
  }
}
