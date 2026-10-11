import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-farmers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-farmers.html',
  styleUrls: ['./manage-farmers.css']
})
export class ManageFarmersComponent implements OnInit {
  farmers: any[] = [];
  loading = true;
  editingFarmer: any = null;
  showEditModal = false;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.loadFarmers(); }

  loadFarmers(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(`${environment.adminUrl}/api/admin/farmers`, { headers }).subscribe({
      next: (users) => { this.farmers = users; this.loading = false; this.cdr.detectChanges(); },
      error: () => this.loading = false
    });
  }

  editFarmer(farmer: any): void { this.editingFarmer = { ...farmer }; this.showEditModal = true; }

  saveEdit(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.put(`${environment.adminUrl}/api/admin/farmers/${this.editingFarmer.id}/profile`, this.editingFarmer, { headers }).subscribe({
      next: () => { this.successMessage = 'Farmer updated successfully!'; setTimeout(() => this.successMessage = '', 3000); this.showEditModal = false; this.loadFarmers(); },
      error: () => { this.errorMessage = 'Failed to update farmer'; setTimeout(() => this.errorMessage = '', 3000); }
    });
  }

  toggleStatus(farmer: any): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const previousState = farmer.isActive;
    const action = previousState ? 'deactivated' : 'activated';
    this.http.put(`${environment.adminUrl}/api/admin/farmers/${farmer.id}/toggle-status`, {}, { headers }).subscribe({
      next: () => {
        farmer.isActive = !previousState;
        this.successMessage = `Farmer ${farmer.firstName} ${farmer.lastName} has been ${action} successfully!`;
        setTimeout(() => this.successMessage = '', 3000);
        this.cdr.detectChanges();
      },
      error: (error) => {
        farmer.isActive = previousState;
        this.errorMessage = 'Failed to update status: ' + (error.error?.message || error.message);
        setTimeout(() => this.errorMessage = '', 3000);
        this.cdr.detectChanges();
      }
    });
  }

  closeModal(): void { this.showEditModal = false; this.editingFarmer = null; }
}
