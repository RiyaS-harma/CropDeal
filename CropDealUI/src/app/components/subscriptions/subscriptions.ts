import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subscriptions.html',
  styleUrls: ['./subscriptions.css']
})
export class SubscriptionsComponent implements OnInit {
  subscriptions: any[] = [];
  loading = true;
  
  newSubscription = {
    cropType: '',
    cropName: '',
    location: ''
  };

  cropTypes = ['Vegetable', 'Fruit'];
  vegetables = ['Tomato', 'Potato', 'Onion', 'Carrot', 'Cabbage', 'Cauliflower'];
  fruits = ['Apple', 'Banana', 'Mango', 'Orange', 'Grapes', 'Watermelon'];
  cropNames: string[] = [];

  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  onCropTypeChange(): void {
    this.cropNames = this.newSubscription.cropType === 'Vegetable' ? this.vegetables : this.fruits;
    this.newSubscription.cropName = '';
  }

  loadSubscriptions(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.cropUrl}/api/cropsubscription`, { headers }).subscribe({
      next: (data) => {
        this.subscriptions = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading subscriptions:', error);
        this.loading = false;
      }
    });
  }

  subscribe(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${environment.cropUrl}/api/cropsubscription`, this.newSubscription, { headers }).subscribe({
      next: () => {
        this.successMessage = 'Subscription added successfully!';
        this.newSubscription = { cropType: '', cropName: '', location: '' };
        this.loadSubscriptions();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to add subscription';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  unsubscribe(id: number): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`${environment.cropUrl}/api/cropsubscription/${id}`, { headers }).subscribe({
      next: () => {
        this.subscriptions = this.subscriptions.filter(s => s.id !== id);
      },
      error: (error) => console.error('Error deleting subscription:', error)
    });
  }
}
