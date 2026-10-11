import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PaymentComponent } from './payment';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let fixture: ComponentFixture<PaymentComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PaymentComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({ orderId: '1' }) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ firstName: 'John', lastName: 'Doe', email: 'john@test.com' }));
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    httpMock.expectOne('http://localhost:5105/api/orders/1').flush({ id: 1, cropName: 'Wheat', quantity: 10, totalAmount: 250 });
    expect(component).toBeTruthy();
  });

  it('should load order on init', () => {
    const mockOrder = { id: 1, cropName: 'Wheat', quantity: 10, unit: 'kg', totalAmount: 250 };
    httpMock.expectOne('http://localhost:5105/api/orders/1').flush(mockOrder);
    expect(component.order).toEqual(mockOrder);
    expect(component.loading).toBeFalse();
  });

  it('should have default paymentMethod as Razorpay', () => {
    httpMock.expectOne('http://localhost:5105/api/orders/1').flush({});
    expect(component.paymentMethod).toBe('Razorpay');
  });

  it('should have empty successMessage initially', () => {
    httpMock.expectOne('http://localhost:5105/api/orders/1').flush({});
    expect(component.successMessage).toBe('');
  });

  it('should have empty errorMessage initially', () => {
    httpMock.expectOne('http://localhost:5105/api/orders/1').flush({});
    expect(component.errorMessage).toBe('');
  });

  it('should set orderId from queryParams', () => {
    httpMock.expectOne('http://localhost:5105/api/orders/1').flush({});
    expect(component.orderId).toBe(1);
  });
});
