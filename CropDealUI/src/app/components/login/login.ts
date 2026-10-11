import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        const userType = response.userType;
        if (userType === 0 || userType === 1 || userType === 'Farmer') {
          this.router.navigate(['/farmer/dashboard']);
        } else if (userType === 2 || userType === 'Dealer') {
          this.router.navigate(['/dealer/marketplace']);
        } else if (userType === 3 || userType === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => {
        console.error('Login failed');
        if (error.error && typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else if (error.error?.title) {
          this.errorMessage = error.error.title;
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Invalid credentials';
        }
      }
    });
  }
}
