import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('token', 'test-token');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getDashboard with Authorization header', () => {
    const mockDashboard = { totalEarnings: 5000, activeCrops: 3, pendingOrders: 2 };

    service.getDashboard().subscribe(res => {
      expect(res.totalEarnings).toBe(5000);
    });

    const req = httpMock.expectOne('http://localhost:5024/api/user/dashboard');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockDashboard);
  });

  it('should call getProfile with Authorization header', () => {
    const mockProfile = { firstName: 'Rahul', lastName: 'Sharma', email: 'rahul@test.com' };

    service.getProfile().subscribe(res => {
      expect(res.firstName).toBe('Rahul');
    });

    const req = httpMock.expectOne('http://localhost:5024/api/user/profile');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockProfile);
  });

  it('should return dealer dashboard data', () => {
    const mockDashboard = { totalOrders: 10, pendingOrders: 3, totalSpent: 15000 };

    service.getDashboard().subscribe(res => {
      expect(res.totalOrders).toBe(10);
      expect(res.totalSpent).toBe(15000);
    });

    const req = httpMock.expectOne('http://localhost:5024/api/user/dashboard');
    req.flush(mockDashboard);
  });
});
