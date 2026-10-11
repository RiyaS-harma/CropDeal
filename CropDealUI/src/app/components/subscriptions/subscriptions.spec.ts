import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { SubscriptionsComponent } from './subscriptions';

describe('SubscriptionsComponent', () => {
  let component: SubscriptionsComponent;
  let fixture: ComponentFixture<SubscriptionsComponent>;
  let httpMock: HttpTestingController;

  const mockSubscriptions = [
    { id: 1, cropType: 'Vegetable', cropName: 'Tomato', location: 'Punjab' },
    { id: 2, cropType: 'Fruit', cropName: 'Mango', location: '' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionsComponent, HttpClientTestingModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionsComponent);
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
    httpMock.expectOne('http://localhost:5178/api/cropsubscription').flush(mockSubscriptions);
    expect(component).toBeTruthy();
  });

  it('should load subscriptions on init', () => {
    httpMock.expectOne('http://localhost:5178/api/cropsubscription').flush(mockSubscriptions);
    expect(component.subscriptions.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should populate vegetable names on cropType Vegetable', () => {
    httpMock.expectOne('http://localhost:5178/api/cropsubscription').flush([]);
    component.newSubscription.cropType = 'Vegetable';
    component.onCropTypeChange();
    expect(component.cropNames).toEqual(component.vegetables);
  });

  it('should populate fruit names on cropType Fruit', () => {
    httpMock.expectOne('http://localhost:5178/api/cropsubscription').flush([]);
    component.newSubscription.cropType = 'Fruit';
    component.onCropTypeChange();
    expect(component.cropNames).toEqual(component.fruits);
  });

  it('should reset cropName on type change', () => {
    httpMock.expectOne('http://localhost:5178/api/cropsubscription').flush([]);
    component.newSubscription.cropName = 'Tomato';
    component.onCropTypeChange();
    expect(component.newSubscription.cropName).toBe('');
  });

  it('should remove subscription on unsubscribe', () => {
    httpMock.expectOne('http://localhost:5178/api/cropsubscription').flush(mockSubscriptions);
    component.unsubscribe(1);
    httpMock.expectOne('http://localhost:5178/api/cropsubscription/1').flush({});
    expect(component.subscriptions.find(s => s.id === 1)).toBeUndefined();
  });

  it('should POST on subscribe', () => {
    httpMock.expectOne('http://localhost:5178/api/cropsubscription').flush([]);
    component.newSubscription = { cropType: 'Vegetable', cropName: 'Tomato', location: 'Punjab' };
    component.subscribe();
    const req = httpMock.expectOne('http://localhost:5178/api/cropsubscription');
    expect(req.request.method).toBe('POST');
    req.flush({});
    httpMock.expectOne('http://localhost:5178/api/cropsubscription').flush([]);
  });

  it('should set successMessage on successful subscribe', () => {
    httpMock.expectOne('http://localhost:5178/api/cropsubscription').flush([]);
    component.subscribe();
    httpMock.expectOne('http://localhost:5178/api/cropsubscription').flush({});
    httpMock.expectOne('http://localhost:5178/api/cropsubscription').flush([]);
    expect(component.successMessage).toBe('Subscription added successfully!');
  });
});
