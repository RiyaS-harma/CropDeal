import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token in localStorage', () => {
    const mockResponse = { token: 'test-token', userId: 'user1', userType: 2, firstName: 'John', lastName: 'Doe', email: 'john@test.com' };

    service.login('john@test.com', 'Password@1').subscribe(res => {
      expect(res.token).toBe('test-token');
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('userId')).toBe('user1');
    });

    const req = httpMock.expectOne('http://localhost:5024/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should register and store token in localStorage', () => {
    const mockResponse = { token: 'reg-token', userId: 'user2', userType: 1 };
    const data = { email: 'farmer@test.com', password: 'Pass@1', firstName: 'Raj', lastName: 'Kumar', userType: 1 };

    service.register(data).subscribe(res => {
      expect(res.token).toBe('reg-token');
      expect(localStorage.getItem('token')).toBe('reg-token');
    });

    const req = httpMock.expectOne('http://localhost:5024/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should return true for isLoggedIn when token exists', () => {
    localStorage.setItem('token', 'some-token');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false for isLoggedIn when token does not exist', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should return token from getToken', () => {
    localStorage.setItem('token', 'my-token');
    expect(service.getToken()).toBe('my-token');
  });

  it('should return null from getToken when not logged in', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should return userType from getUserType', () => {
    localStorage.setItem('userType', '2');
    expect(service.getUserType()).toBe('2');
  });

  it('should clear localStorage on logout', () => {
    localStorage.setItem('token', 'token');
    localStorage.setItem('userId', 'user1');
    localStorage.setItem('userType', '2');
    localStorage.setItem('user', '{}');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('userId')).toBeNull();
    expect(localStorage.getItem('userType')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
