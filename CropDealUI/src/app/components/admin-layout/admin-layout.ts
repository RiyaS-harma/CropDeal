import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

import { ChatbotComponent } from '../chatbot/chatbot';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatbotComponent],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent implements OnInit {
  profileImage: string | null = null;
  firstName: string = 'Admin';
  lastName: string = '';
  sidebarOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.firstName = userData.firstName || 'Admin';
      this.lastName = userData.lastName || '';
    }
    this.profileImage = localStorage.getItem('profileImage');
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim() || 'Admin';
  }

  getInitials(): string {
    const first = this.firstName.charAt(0).toUpperCase();
    const last = this.lastName.charAt(0).toUpperCase();
    return first + last || 'A';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
