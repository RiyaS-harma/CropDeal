import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPasswordComponent {
  step = 1;
  email = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  error = '';
  passwordStrength = '';

  constructor(private http: HttpClient, private router: Router) {}

  sendOTP() {
    if (!this.email) {
      this.error = 'Please enter your email';
      setTimeout(() => this.error = '', 3000);
      return;
    }
    this.http.post<any>(`${environment.apiUrl}/api/auth/forgot-password`, { email: this.email }).subscribe({
      next: () => {
        this.message = 'OTP sent to your email';
        setTimeout(() => { this.message = ''; this.step = 2; }, 1500);
      },
      error: () => {
        this.error = 'Failed to send OTP. Please try again.';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }

  verifyOTP() {
    if (this.otp.length === 6 && /^\d+$/.test(this.otp)) {
      this.step = 3;
    } else {
      this.error = 'Invalid OTP. Please enter the 6-digit code.';
      setTimeout(() => this.error = '', 3000);
    }
  }

  checkStrength() {
    const v = this.newPassword;
    if (v.length < 6) this.passwordStrength = 'Weak';
    else if (v.match(/[A-Z]/) && v.match(/[0-9]/)) this.passwordStrength = 'Strong';
    else this.passwordStrength = 'Medium';
  }

  resetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      setTimeout(() => this.error = '', 3000);
      return;
    }
    this.http.post<any>(`${environment.apiUrl}/api/auth/reset-password`, {
      email: this.email,
      otp: this.otp,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.message = 'Password reset successfully!';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: () => {
        this.error = 'Invalid or expired OTP. Please try again.';
        setTimeout(() => this.error = '', 3000);
      }
    });
  }
}
