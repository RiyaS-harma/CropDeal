import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment';

import { ChatbotComponent } from '../chatbot/chatbot';

@Component({
  selector: 'app-dealer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatbotComponent],
  templateUrl: './dealer-layout.html',
  styleUrls: ['./dealer-layout.css']
})
export class DealerLayoutComponent implements OnInit {
  profileImage: string | null = null;
  firstName: string = '';
  lastName: string = '';
  dropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
    this.fetchUserProfile();
  }

  loadUserData(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.firstName = userData.firstName || 'Dealer';
      this.lastName = userData.lastName || '';
    }
    this.profileImage = localStorage.getItem('profileImage');
  }

  fetchUserProfile(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = { 'Authorization': `Bearer ${token}` };
    fetch(`${environment.apiUrl}/api/user/profile`, { headers })
      .then(res => res.json())
      .then(data => {
        this.firstName = data.firstName || 'Dealer';
        this.lastName = data.lastName || '';
        localStorage.setItem('user', JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        }));
      })
      .catch(() => {});
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim() || 'Dealer';
  }

  getInitials(): string {
    const first = this.firstName.charAt(0).toUpperCase();
    const last = this.lastName.charAt(0).toUpperCase();
    return first + last || 'D';
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
