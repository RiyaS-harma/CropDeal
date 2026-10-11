import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          const userTypeMap: { [key: string]: string } = { 'Farmer': '1', 'Dealer': '2', 'Admin': '3' };
          const userType = typeof response.userType === 'string' && isNaN(+response.userType)
            ? (userTypeMap[response.userType] || response.userType)
            : String(response.userType);
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userType', userType);
          localStorage.setItem('user', JSON.stringify({
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email
          }));
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      tap((response: any) => {
        if (response.token) {
          const userTypeMap: { [key: string]: string } = { 'Farmer': '1', 'Dealer': '2', 'Admin': '3' };
          const userType = typeof response.userType === 'string' && isNaN(+response.userType)
            ? (userTypeMap[response.userType] || response.userType)
            : String(response.userType);
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userType', userType);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    localStorage.removeItem('profileImage');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserType(): string | null {
    return localStorage.getItem('userType');
  }
}
