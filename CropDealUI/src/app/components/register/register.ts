import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  phone = '';
  userType = 2;
  errorMessage = '';
  successMessage = '';
  passwordStrength = '';

  constructor(private authService: AuthService, private router: Router) {}

  checkStrength() {
    const value = this.password;
    if (value.length < 6) {
      this.passwordStrength = 'Weak';
    } else if (value.match(/[A-Z]/) && value.match(/[0-9]/)) {
      this.passwordStrength = 'Strong';
    } else {
      this.passwordStrength = 'Medium';
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const nameParts = this.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || nameParts[0];

    const data = {
      email: this.email,
      password: this.password,
      firstName,
      lastName,
      phoneNumber: this.phone,
      userType: Number(this.userType)
    };

    this.authService.register(data).subscribe({
      next: (response) => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        console.error('Registration failed');
        if (Array.isArray(error.error)) {
          const duplicateError = error.error.find((e: any) => e.code === 'DuplicateUserName');
          if (duplicateError) {
            this.errorMessage = 'Username already taken';
          } else {
            this.errorMessage = error.error.map((e: any) => e.description).join(', ');
          }
        } else if (error.error?.errors) {
          this.errorMessage = Object.values(error.error.errors).flat().join(', ');
        } else {
          this.errorMessage = error.error?.message || 'Registration failed';
        }
      }
    });
  }
}
