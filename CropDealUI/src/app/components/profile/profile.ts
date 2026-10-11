import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  bankAccount: any = {};
  dashboardData: any = {};
  profileSuccessMessage = '';
  profileErrorMessage = '';
  bankSuccessMessage = '';
  bankErrorMessage = '';
  editMode = false;
  bankEditMode = false;
  profileImage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadBankAccount();
    this.loadDashboard();
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) this.profileImage = savedImage;
  }

  onImageSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => { this.profileImage = e.target.result; localStorage.setItem('profileImage', this.profileImage); };
      reader.readAsDataURL(file);
    }
  }

  loadDashboard(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get(`${environment.apiUrl}/api/user/dashboard`, { headers }).subscribe({ next: (data: any) => this.dashboardData = data, error: () => {} });
  }

  getUserTypeName(): string {
    const type = this.user.userType;
    if (type === 1 || type === '1') return 'Farmer';
    if (type === 2 || type === '2') return 'Dealer';
    if (type === 3 || type === '3') return 'Admin';
    return 'Unknown';
  }

  loadProfile(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get(`${environment.apiUrl}/api/user/profile`, { headers }).subscribe({
      next: (data: any) => {
        this.user = data;
        localStorage.setItem('user', JSON.stringify({ firstName: data.firstName, lastName: data.lastName, email: data.email }));
      },
      error: (error) => console.error('Error loading profile:', error)
    });
  }

  loadBankAccount(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get(`${environment.bankUrl}/api/bankaccount`, { headers }).subscribe({
      next: (data: any) => {
        this.bankAccount = { id: data.id, accountNumber: data.bankAccountNumber, bankName: data.bankName, accountHolderName: data.accountHolderName || '', ifscCode: data.ifscCode || '', branch: data.branch || '' };
      },
      error: () => this.bankAccount = {}
    });
  }

  updateProfile(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.profileSuccessMessage = ''; this.profileErrorMessage = '';
    this.http.put(`${environment.apiUrl}/api/user/profile`, this.user, { headers, responseType: 'text' }).subscribe({
      next: () => { this.profileSuccessMessage = 'Profile updated successfully!'; this.editMode = false; },
      error: () => this.profileErrorMessage = 'Failed to update profile'
    });
  }

  saveBankAccount(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.bankSuccessMessage = ''; this.bankErrorMessage = '';
    const bankData = { BankAccountNumber: this.bankAccount.accountNumber, BankName: this.bankAccount.bankName };
    const request = this.bankAccount.id
      ? this.http.put(`${environment.bankUrl}/api/bankaccount`, bankData, { headers })
      : this.http.post(`${environment.bankUrl}/api/bankaccount`, bankData, { headers });
    request.subscribe({
      next: () => { this.bankSuccessMessage = 'Bank account saved successfully!'; this.bankEditMode = false; this.loadBankAccount(); },
      error: () => this.bankErrorMessage = 'Failed to save bank account'
    });
  }
}
