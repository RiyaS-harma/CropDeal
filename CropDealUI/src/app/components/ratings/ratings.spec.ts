import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { RatingsComponent } from './ratings';

describe('RatingsComponent', () => {
  let component: RatingsComponent;
  let fixture: ComponentFixture<RatingsComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RatingsComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RatingsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('userId', 'user1');
    localStorage.setItem('userType', '1');
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    httpMock.expectOne('http://localhost:5007/api/ratingreview/user1').flush([]);
    expect(component).toBeTruthy();
  });

  it('should have default rating of 5', () => {
    httpMock.expectOne('http://localhost:5007/api/ratingreview/user1').flush([]);
    expect(component.rating).toBe(5);
  });

  it('should have empty review initially', () => {
    httpMock.expectOne('http://localhost:5007/api/ratingreview/user1').flush([]);
    expect(component.review).toBe('');
  });

  it('should have empty successMessage initially', () => {
    httpMock.expectOne('http://localhost:5007/api/ratingreview/user1').flush([]);
    expect(component.successMessage).toBe('');
  });

  it('should have empty errorMessage initially', () => {
    httpMock.expectOne('http://localhost:5007/api/ratingreview/user1').flush([]);
    expect(component.errorMessage).toBe('');
  });

  it('should calculate averageRating correctly for farmer', () => {
    const mockRatings = [{ rating: 5 }, { rating: 3 }, { rating: 4 }];
    httpMock.expectOne('http://localhost:5007/api/ratingreview/user1').flush(mockRatings);
    expect(component.averageRating).toBeCloseTo(4.0);
  });

  it('should return userType from localStorage', () => {
    httpMock.expectOne('http://localhost:5007/api/ratingreview/user1').flush([]);
    expect(component.getUserType()).toBe('1');
  });

  it('should load completed orders for dealer', () => {
    localStorage.setItem('userType', '2');
    httpMock.expectOne('http://localhost:5007/api/ratingreview/user1').flush([]);
    component.loadCompletedOrders();
    const req = httpMock.expectOne('http://localhost:5105/api/orders/my-orders');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, status: 'Completed', farmerId: 'f1' }, { id: 2, status: 'Pending', farmerId: 'f2' }]);
    httpMock.expectOne('http://localhost:5024/api/user/f1').flush({ firstName: 'Ramesh', lastName: 'Kumar' });
  });
});
