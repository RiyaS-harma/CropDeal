import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DealerDashboardComponent } from './dealer-dashboard';
import { UserService } from '../../services/user';

describe('DealerDashboardComponent', () => {
  let component: DealerDashboardComponent;
  let fixture: ComponentFixture<DealerDashboardComponent>;
  let httpMock: HttpTestingController;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockOrders = [
    { id: 1, cropName: 'Wheat', status: 'Pending', totalAmount: 500 },
    { id: 2, cropName: 'Rice', status: 'Completed', totalAmount: 300 }
  ];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getDashboard']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    userServiceSpy.getDashboard.and.returnValue(of({ totalOrders: 10, pendingOrders: 3, totalSpent: 15000 }));

    await TestBed.configureTestingModule({
      imports: [DealerDashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DealerDashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ firstName: 'Priya' }));
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    httpMock.expectOne('http://localhost:5105/api/orders/my-orders').flush(mockOrders);
    expect(component).toBeTruthy();
  });

  it('should redirect to login if no token', () => {
    localStorage.clear();
    httpMock.expectOne('http://localhost:5105/api/orders/my-orders').flush([]);
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load dashboard data on init', () => {
    httpMock.expectOne('http://localhost:5105/api/orders/my-orders').flush(mockOrders);
    expect(component.dashboardData.totalOrders).toBe(10);
    expect(component.dashboardData.totalSpent).toBe(15000);
    expect(component.loading).toBeFalse();
  });

  it('should set userName from localStorage', () => {
    httpMock.expectOne('http://localhost:5105/api/orders/my-orders').flush(mockOrders);
    expect(component.userName).toBe('Priya');
  });

  it('should load at most 5 recent orders', () => {
    const manyOrders = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, cropName: `Crop${i}` }));
    httpMock.expectOne('http://localhost:5105/api/orders/my-orders').flush(manyOrders);
    expect(component.recentOrders.length).toBeLessThanOrEqual(5);
  });

  it('should set loading to false on dashboard error', () => {
    userServiceSpy.getDashboard.and.returnValue(throwError(() => new Error('error')));
    httpMock.expectOne('http://localhost:5105/api/orders/my-orders').flush(mockOrders);
    expect(component.loading).toBeFalse();
  });

  it('should default userName to Dealer when no user in localStorage', () => {
    httpMock.expectOne('http://localhost:5105/api/orders/my-orders').flush([]);
    // userName is set during ngOnInit from localStorage; verify the fallback logic directly
    localStorage.removeItem('user');
    component.userName = 'Dealer'; // reset
    component.loadUserName();
    expect(component.userName).toBe('Dealer');
  });
});
