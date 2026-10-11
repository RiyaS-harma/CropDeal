import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './marketplace.html',
  styleUrls: ['./marketplace.css']
})
export class MarketplaceComponent implements OnInit {
  crops: any[] = [];
  allCrops: any[] = [];
  loading = true;
  searchText = '';
  selectedSort = '';
  selectedCategory = '';
  cropQuantities: { [key: number]: number } = {};
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void { this.loadCrops(); }

  loadCrops(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(`${environment.cropUrl}/api/crops`, { headers }).subscribe({
      next: (data) => {
        this.allCrops = data.filter(c => c.quantity > 0);
        this.crops = this.allCrops;
        this.allCrops.forEach(crop => this.cropQuantities[crop.id] = 1);
        this.loading = false;
      },
      error: (error) => { console.error('Error loading crops:', error); this.loading = false; }
    });
  }

  get filteredCrops() {
    let filtered = this.allCrops;
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(crop =>
        crop.cropName.toLowerCase().includes(search) ||
        crop.location.toLowerCase().includes(search) ||
        crop.cropType.toLowerCase().includes(search)
      );
    }
    if (this.selectedCategory) filtered = filtered.filter(crop => crop.cropType === this.selectedCategory);
    if (this.selectedSort === 'low') filtered = [...filtered].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    else if (this.selectedSort === 'high') filtered = [...filtered].sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    return filtered;
  }

  incrementQuantity(cropId: number, maxQuantity: number): void {
    if (this.cropQuantities[cropId] < maxQuantity) this.cropQuantities[cropId]++;
  }
  decrementQuantity(cropId: number): void {
    if (this.cropQuantities[cropId] > 1) this.cropQuantities[cropId]--;
  }

  placeOrder(crop: any): void {
    const quantity = this.cropQuantities[crop.id];
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(`${environment.orderUrl}/api/orders`, { cropId: crop.id, quantity }, { headers }).subscribe({
      next: () => {
        this.successMessage = `Order placed successfully for ${quantity} ${crop.unit} of ${crop.cropName}!`;
        setTimeout(() => this.successMessage = '', 3000);
        this.router.navigate(['/dealer/orders']);
      },
      error: (error) => { this.errorMessage = 'Failed to place order.'; setTimeout(() => this.errorMessage = '', 3000); console.error(error); }
    });
  }

  addToCart(crop: any): void {
    const quantity = this.cropQuantities[crop.id];
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.post(`${environment.cartUrl}/api/cartitem?cropId=${crop.id}&quantity=${quantity}`, {}, { headers }).subscribe({
      next: () => {
        this.successMessage = `${quantity} ${crop.unit} of ${crop.cropName} added to cart!`;
        setTimeout(() => this.successMessage = '', 3000);
        this.cropQuantities[crop.id] = 1;
      },
      error: (error) => { this.errorMessage = 'Failed to add to cart.'; setTimeout(() => this.errorMessage = '', 3000); console.error(error); }
    });
  }

  get hasFilters(): boolean { return !!(this.searchText || this.selectedCategory || this.selectedSort); }
  clearFilters(): void { this.searchText = ''; this.selectedCategory = ''; this.selectedSort = ''; }
}
