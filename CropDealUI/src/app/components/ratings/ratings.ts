import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ratings.html',
  styleUrls: ['./ratings.css']
})
export class RatingsComponent implements OnInit {
  ratings: any[] = [];
  completedOrders: any[] = [];
  loading = true;
  orderId: number | null = null;
  rating = 5;
  review = '';
  averageRating = 0;
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['orderId']) {
        this.orderId = +params['orderId'];
        const navigationState = history.state?.order;
        console.log('Navigation state:', navigationState);
        if (navigationState) {
          this.loadFarmerNameForOrder(navigationState);
        } else {
          this.loadOrderForRating(this.orderId);
        }
      } else {
        this.loadData();
      }
    });
  }

  async loadFarmerNameForOrder(order: any): Promise<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const farmerName = await this.getFarmerName(order.farmerId, headers);
    this.completedOrders = [{ ...order, farmerName }];
    this.loading = false;
  }

  loadOrderForRating(orderId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>(`${environment.orderUrl}/api/orders/${orderId}`, { headers }).subscribe({
      next: async (order) => {
        console.log('Order data:', order);
        const farmerName = await this.getFarmerName(order.farmerId, headers);
        this.completedOrders = [{ ...order, farmerName }];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadData(): void {
    const userType = this.getUserType();
    if (userType === '1') {
      this.loadMyRatings();
    } else {
      this.loadCompletedOrders();
    }
  }

  loadMyRatings(): void {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.ratingUrl}/api/ratingreview/${userId}`, { headers }).subscribe({
      next: (data) => {
        this.ratings = data;
        if (data.length > 0) {
          const sum = data.reduce((acc, r) => acc + r.rating, 0);
          this.averageRating = sum / data.length;
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  loadCompletedOrders(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.orderUrl}/api/orders/my-orders`, { headers }).subscribe({
      next: async (data) => {
        const completed = data.filter(o => o.status === 'Completed');
        const ordersWithNames = await Promise.all(completed.map(async order => {
          const farmerName = await this.getFarmerName(order.farmerId, headers);
          return { ...order, farmerName };
        }));
        this.completedOrders = ordersWithNames;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  async getFarmerName(farmerId: string, headers: HttpHeaders): Promise<string> {
    if (!farmerId) {
      console.log('No farmerId provided');
      return 'Farmer';
    }
    try {
      const user = await this.http.get<any>(`${environment.apiUrl}/api/user/${farmerId}`, { headers }).toPromise();
      return `${user.firstName} ${user.lastName}`;
    } catch (error) {
      console.error('Error fetching farmer name:', error);
      return 'Farmer';
    }
  }

  submitRating(orderId: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    console.log('Submitting rating for order:', orderId, 'rating:', this.rating, 'review:', this.review);

    this.http.post(`${environment.ratingUrl}/api/ratingreview?orderId=${orderId}&rating=${this.rating}&review=${encodeURIComponent(this.review || '')}`, {}, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Rating submitted successfully!';
        setTimeout(() => {
          window.location.href = '/dealer/orders';
        }, 2000);
      },
      error: (error) => {
        console.error('Full error:', error);
        console.error('Error details:', error.error);
        this.errorMessage = 'Failed to submit rating. Please try again.';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  getUserType(): string | null {
    return localStorage.getItem('userType');
  }
}
