import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css']
})
export class ResetPasswordComponent implements OnInit {
  email = '';
  token = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  error = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.token = params['otp'] || '';
    });
  }

  onSubmit(): void {
    this.message = '';
    this.error = '';

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match!';
      return;
    }

    if (this.newPassword.length < 6) {
      this.error = 'Password must be at least 6 characters!';
      return;
    }

    this.http.post(`${environment.apiUrl}/api/auth/reset-password`, {
      email: this.email,
      otp: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.message = 'Password reset successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: () => {
        this.error = 'Failed to reset password. Token may be invalid or expired.';
      }
    });
  }
}
