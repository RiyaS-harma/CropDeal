import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { OrdersComponent } from './orders';
import { ChangeDetectorRef } from '@angular/core';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [OrdersComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        ChangeDetectorRef
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('userId', 'user1');
    localStorage.setItem('userType', '2');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading true initially', () => {
    expect(component.loading).toBeTrue();
  });

  it('should have empty orders initially', () => {
    expect(component.orders.length).toBe(0);
  });

  it('should return correct status class for Pending', () => {
    const cls = component.getStatusClass('Pending');
    expect(cls['pending']).toBeTrue();
    expect(cls['shipped']).toBeFalse();
    expect(cls['completed']).toBeFalse();
  });

  it('should return correct status class for Confirmed', () => {
    const cls = component.getStatusClass('Confirmed');
    expect(cls['shipped']).toBeTrue();
  });

  it('should return correct status class for Completed', () => {
    const cls = component.getStatusClass('Completed');
    expect(cls['completed']).toBeTrue();
  });

  it('should navigate to payment on payNow', () => {
    component.payNow(5);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dealer/payment'], { queryParams: { orderId: 5 } });
  });

  it('should navigate to ratings on giveRating', () => {
    const order = { id: 3, farmerId: 'f1' };
    component.giveRating(order);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dealer/ratings'], jasmine.objectContaining({ queryParams: { orderId: 3 } }));
  });

  it('should return userType from localStorage', () => {
    localStorage.setItem('userType', '1');
    expect(component.getUserType()).toBe('1');
  });
});
