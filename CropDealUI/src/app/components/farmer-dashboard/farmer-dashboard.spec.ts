import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FarmerDashboardComponent } from './farmer-dashboard';
import { UserService } from '../../services/user';

describe('FarmerDashboardComponent', () => {
  let component: FarmerDashboardComponent;
  let fixture: ComponentFixture<FarmerDashboardComponent>;
  let httpMock: HttpTestingController;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCrops = [
    { id: 1, cropName: 'Wheat', quantity: 100, pricePerUnit: 25 },
    { id: 2, cropName: 'Rice', quantity: 0, pricePerUnit: 30 },
    { id: 3, cropName: 'Corn', quantity: 50, pricePerUnit: 20 }
  ];

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getProfile', 'getDashboard']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    userServiceSpy.getProfile.and.returnValue(of({ firstName: 'Ramesh' }));
    userServiceSpy.getDashboard.and.returnValue(of({ totalEarnings: 5000, activeCrops: 3, pendingOrders: 2 }));

    await TestBed.configureTestingModule({
      imports: [FarmerDashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FarmerDashboardComponent);
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
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    expect(component).toBeTruthy();
  });

  it('should redirect to login if no token', () => {
    localStorage.clear();
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush([]);
    component.ngOnInit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load dashboard data on init', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    expect(component.dashboardData.totalEarnings).toBe(5000);
    expect(component.loading).toBeFalse();
  });

  it('should set userName from profile', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    expect(component.userName).toBe('Ramesh');
  });

  it('should filter out crops with quantity 0', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    expect(component.recentCrops.every(c => c.quantity > 0)).toBeTrue();
  });

  it('should show at most 5 recent crops', () => {
    const manyCrops = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, cropName: `Crop${i}`, quantity: 10 }));
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(manyCrops);
    expect(component.recentCrops.length).toBeLessThanOrEqual(5);
  });

  it('should set showDeleteModal to true on deleteCrop', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    component.deleteCrop(1);
    expect(component.showDeleteModal).toBeTrue();
    expect(component.cropToDelete).toBe(1);
  });

  it('should reset modal state on cancelDelete', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    component.deleteCrop(1);
    component.cancelDelete();
    expect(component.showDeleteModal).toBeFalse();
    expect(component.cropToDelete).toBeNull();
  });

  it('should navigate to publish-crop with id on editCrop', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    component.editCrop(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/farmer/publish-crop'], { queryParams: { id: 1 } });
  });

  it('should set loading to false on dashboard error', () => {
    userServiceSpy.getDashboard.and.returnValue(throwError(() => new Error('error')));
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    expect(component.loading).toBeFalse();
  });
});
