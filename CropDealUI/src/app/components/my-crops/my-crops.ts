import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-my-crops',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-crops.html',
  styleUrls: ['./my-crops.css']
})
export class MyCropsComponent implements OnInit {
  searchText = '';
  crops: any[] = [];
  allCrops: any[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';
  showDeleteModal = false;
  cropToDelete: number | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const msg = localStorage.getItem('cropSuccessMessage');
    if (msg) {
      this.successMessage = msg;
      localStorage.removeItem('cropSuccessMessage');
      setTimeout(() => this.successMessage = '', 1500);
    }
    this.loadCrops();
    this.route.queryParams.subscribe(params => {
      if (params['search']) {
        this.searchText = params['search'];
        if (this.allCrops.length > 0) this.filterCrops(params['search']);
      } else {
        this.searchText = '';
        this.crops = this.allCrops;
      }
    });
  }

  filterCrops(query: string): void {
    const searchLower = query.toLowerCase();
    this.crops = this.allCrops.filter(crop =>
      crop.cropName.toLowerCase().includes(searchLower) ||
      crop.cropType.toLowerCase().includes(searchLower) ||
      crop.location.toLowerCase().includes(searchLower)
    );
  }

  get filteredListings() {
    if (!this.searchText) return this.crops;
    return this.crops.filter(item => item.cropName.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  loadCrops(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(`${environment.cropUrl}/api/crops/my-crops`, { headers }).subscribe({
      next: (data) => {
        this.allCrops = data.filter(crop => crop.quantity > 0);
        this.crops = this.allCrops;
        this.loading = false;
        const searchParam = this.route.snapshot.queryParams['search'];
        if (searchParam) { this.searchText = searchParam; this.filterCrops(searchParam); }
      },
      error: (error) => { console.error('Error loading crops:', error); this.loading = false; }
    });
  }

  deleteCrop(id: number): void { this.cropToDelete = id; this.showDeleteModal = true; }

  confirmDelete(): void {
    if (!this.cropToDelete) return;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(`${environment.cropUrl}/api/crops/${this.cropToDelete}`, { headers }).subscribe({
      next: () => {
        this.crops = this.crops.filter(c => c.id !== this.cropToDelete);
        this.allCrops = this.allCrops.filter(c => c.id !== this.cropToDelete);
        this.successMessage = 'Crop deleted successfully!';
        setTimeout(() => this.successMessage = '', 1500);
        this.showDeleteModal = false; this.cropToDelete = null;
      },
      error: (error) => {
        console.error('Error deleting crop:', error);
        this.errorMessage = 'Failed to delete crop';
        setTimeout(() => this.errorMessage = '', 1500);
        this.showDeleteModal = false; this.cropToDelete = null;
      }
    });
  }

  cancelDelete(): void { this.showDeleteModal = false; this.cropToDelete = null; }
  editCrop(id: number): void { this.router.navigate(['/farmer/publish-crop'], { queryParams: { id } }); }
  addNewListing(): void { this.router.navigate(['/farmer/publish-crop']); }
}
