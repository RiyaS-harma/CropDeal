import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './cart';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCartItems = [
    { id: 1, cropId: 1, cropName: 'Wheat', quantity: 5, pricePerUnit: 25, unit: 'kg' },
    { id: 2, cropId: 2, cropName: 'Rice', quantity: 10, pricePerUnit: 30, unit: 'kg' }
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CartComponent, HttpClientTestingModule, FormsModule],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(CartComponent);
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
    httpMock.expectOne('http://localhost:5006/api/cartitem').flush(mockCartItems);
    expect(component).toBeTruthy();
  });

  it('should load cart items on init', () => {
    httpMock.expectOne('http://localhost:5006/api/cartitem').flush(mockCartItems);
    expect(component.cartItems.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should calculate total amount correctly', () => {
    httpMock.expectOne('http://localhost:5006/api/cartitem').flush(mockCartItems);
    expect(component.getTotalAmount()).toBe(5 * 25 + 10 * 30);
  });

  it('should return 0 total for empty cart', () => {
    httpMock.expectOne('http://localhost:5006/api/cartitem').flush([]);
    expect(component.getTotalAmount()).toBe(0);
  });

  it('should set errorMessage when checking out empty cart', () => {
    httpMock.expectOne('http://localhost:5006/api/cartitem').flush([]);
    component.checkout();
    expect(component.errorMessage).toBe('Your cart is empty!');
  });

  it('should have empty successMessage initially', () => {
    httpMock.expectOne('http://localhost:5006/api/cartitem').flush(mockCartItems);
    expect(component.successMessage).toBe('');
  });

  it('should have empty errorMessage initially', () => {
    httpMock.expectOne('http://localhost:5006/api/cartitem').flush(mockCartItems);
    expect(component.errorMessage).toBe('');
  });
});
