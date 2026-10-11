import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment';

import { ChatbotComponent } from '../chatbot/chatbot';
import { PublishCropComponent } from '../publish-crop/publish-crop';

@Component({
  selector: 'app-farmer-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ChatbotComponent, PublishCropComponent],
  templateUrl: './farmer-layout.html',
  styleUrls: ['./farmer-layout.css']
})
export class FarmerLayoutComponent implements OnInit {
  sidebarOpen = window.innerWidth >= 1024;
  profileImage = '';
  searchQuery = '';
  firstName = '';
  lastName = '';
  showNewListing = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loadUserData();
    // If no user data in localStorage, fetch from API
    const user = localStorage.getItem('user');
    if (!user || !JSON.parse(user).firstName) {
      this.fetchUserProfile();
    }
  }

  loadUserData(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.firstName = userData.firstName || 'Farmer';
      this.lastName = userData.lastName || '';
    }
    this.profileImage = localStorage.getItem('profileImage') || '';
  }

  fetchUserProfile(): void {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const headers = { 'Authorization': `Bearer ${token}` };
    fetch(`${environment.apiUrl}/api/user/profile`, { headers })
      .then(res => res.json())
      .then(data => {
        this.firstName = data.firstName || 'Farmer';
        this.lastName = data.lastName || '';
        localStorage.setItem('user', JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        }));
      })
      .catch(() => {});
  }

  openNewListing(): void { this.showNewListing = true; }
  closeNewListing(): void { this.showNewListing = false; }
  onListingDone(): void {
    this.showNewListing = false;
    this.router.navigate(['/farmer/crops']);
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // Navigate to my crops page with search query
      this.router.navigate(['/farmer/crops'], { queryParams: { search: this.searchQuery } });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get isMobile(): boolean {
    return window.innerWidth < 1024;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim() || 'Farmer';
  }

  getInitials(): string {
    const first = this.firstName.charAt(0).toUpperCase();
    const last = this.lastName.charAt(0).toUpperCase();
    return first + last || 'F';
  }
}
