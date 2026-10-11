import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farmer-dashboard.html',
  styleUrls: ['./farmer-dashboard.css']
})
export class FarmerDashboardComponent implements OnInit {
  dashboardData: any = { totalEarnings: 0, activeCrops: 0, pendingOrders: 0 };
  recentCrops: any[] = [];
  loading: boolean = true;
  userName: string = 'Farmer';
  successMessage: string = '';
  errorMessage: string = '';
  showDeleteModal: boolean = false;
  cropToDelete: number | null = null;

  constructor(private userService: UserService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) { this.router.navigate(['/login']); return; }
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state || history.state;
    if (state?.successMessage) {
      this.successMessage = state.successMessage;
      setTimeout(() => this.successMessage = '', 3000);
    }
    this.loadUserName();
    this.loadDashboard();
    this.loadRecentCrops();
  }

  loadUserName(): void {
    this.userService.getProfile().subscribe({ next: (user: any) => { this.userName = user.firstName || 'Farmer'; }, error: () => {} });
  }

  loadDashboard(): void {
    this.userService.getDashboard().subscribe({
      next: (data) => { this.dashboardData = data; this.loading = false; },
      error: (error) => { console.error('Error loading dashboard:', error); this.loading = false; }
    });
  }

  loadRecentCrops(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(`${environment.cropUrl}/api/crops/my-crops`, { headers }).subscribe({
      next: (crops) => { this.recentCrops = crops.filter(c => c.quantity > 0).slice(0, 5); },
      error: (error) => { this.errorMessage = 'Failed to load crops: ' + (error.error?.message || error.message); }
    });
  }

  deleteCrop(id: number): void { this.cropToDelete = id; this.showDeleteModal = true; }

  confirmDelete(): void {
    if (!this.cropToDelete) return;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(`${environment.cropUrl}/api/crops/${this.cropToDelete}`, { headers }).subscribe({
      next: () => {
        this.recentCrops = this.recentCrops.filter(c => c.id !== this.cropToDelete);
        this.successMessage = 'Crop deleted successfully!';
        setTimeout(() => this.successMessage = '', 3000);
        this.showDeleteModal = false; this.cropToDelete = null;
      },
      error: (error) => {
        console.error('Error deleting crop:', error);
        this.errorMessage = 'Failed to delete crop';
        setTimeout(() => this.errorMessage = '', 3000);
        this.showDeleteModal = false; this.cropToDelete = null;
      }
    });
  }

  cancelDelete(): void { this.showDeleteModal = false; this.cropToDelete = null; }
  editCrop(id: number): void { this.router.navigate(['/farmer/publish-crop'], { queryParams: { id } }); }
}
