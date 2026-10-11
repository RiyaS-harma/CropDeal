import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminDashboardComponent } from './admin-dashboard';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let httpMock: HttpTestingController;

  const mockUsers = [
    { id: 'u1', userType: 1, isActive: true },
    { id: 'u2', userType: 1, isActive: false },
    { id: 'u3', userType: 2, isActive: true },
    { id: 'u4', userType: 2, isActive: true }
  ];

  const mockOrders = [
    { id: 1, totalAmount: 5000 },
    { id: 2, totalAmount: 3000 }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('token', 'test-token');
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    httpMock.expectOne('http://localhost:5024/api/user/all').flush(mockUsers);
    httpMock.expectOne('http://localhost:5105/api/orders/all').flush(mockOrders);
    expect(component).toBeTruthy();
  });

  it('should count farmers correctly', () => {
    httpMock.expectOne('http://localhost:5024/api/user/all').flush(mockUsers);
    httpMock.expectOne('http://localhost:5105/api/orders/all').flush(mockOrders);
    expect(component.stats.totalFarmers).toBe(2);
  });

  it('should count dealers correctly', () => {
    httpMock.expectOne('http://localhost:5024/api/user/all').flush(mockUsers);
    httpMock.expectOne('http://localhost:5105/api/orders/all').flush(mockOrders);
    expect(component.stats.totalDealers).toBe(2);
  });

  it('should count active farmers correctly', () => {
    httpMock.expectOne('http://localhost:5024/api/user/all').flush(mockUsers);
    httpMock.expectOne('http://localhost:5105/api/orders/all').flush(mockOrders);
    expect(component.stats.activeFarmers).toBe(1);
  });

  it('should count active dealers correctly', () => {
    httpMock.expectOne('http://localhost:5024/api/user/all').flush(mockUsers);
    httpMock.expectOne('http://localhost:5105/api/orders/all').flush(mockOrders);
    expect(component.stats.activeDealers).toBe(2);
  });

  it('should calculate total orders', () => {
    httpMock.expectOne('http://localhost:5024/api/user/all').flush(mockUsers);
    httpMock.expectOne('http://localhost:5105/api/orders/all').flush(mockOrders);
    expect(component.stats.totalOrders).toBe(2);
  });

  it('should calculate total revenue', () => {
    httpMock.expectOne('http://localhost:5024/api/user/all').flush(mockUsers);
    httpMock.expectOne('http://localhost:5105/api/orders/all').flush(mockOrders);
    expect(component.stats.totalRevenue).toBe(8000);
  });

  it('should set loading to false after data loads', () => {
    httpMock.expectOne('http://localhost:5024/api/user/all').flush(mockUsers);
    httpMock.expectOne('http://localhost:5105/api/orders/all').flush(mockOrders);
    expect(component.loading).toBeFalse();
  });
});
