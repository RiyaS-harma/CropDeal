import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MarketplaceComponent } from './marketplace';

describe('MarketplaceComponent', () => {
  let component: MarketplaceComponent;
  let fixture: ComponentFixture<MarketplaceComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCrops = [
    { id: 1, cropName: 'Wheat', cropType: 'Grain', location: 'Punjab', pricePerUnit: 25, quantity: 100, unit: 'kg' },
    { id: 2, cropName: 'Rice', cropType: 'Grain', location: 'UP', pricePerUnit: 30, quantity: 200, unit: 'kg' },
    { id: 3, cropName: 'Tomato', cropType: 'Vegetable', location: 'Maharashtra', pricePerUnit: 15, quantity: 50, unit: 'kg' },
    { id: 4, cropName: 'Corn', cropType: 'Grain', location: 'Punjab', pricePerUnit: 20, quantity: 0, unit: 'kg' }
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MarketplaceComponent, HttpClientTestingModule, FormsModule],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketplaceComponent);
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
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    expect(component).toBeTruthy();
  });

  it('should filter out crops with quantity 0 on load', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    expect(component.allCrops.length).toBe(3);
    expect(component.allCrops.every(c => c.quantity > 0)).toBeTrue();
  });

  it('should initialize cropQuantities to 1 for each crop', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    expect(component.cropQuantities[1]).toBe(1);
    expect(component.cropQuantities[2]).toBe(1);
    expect(component.cropQuantities[3]).toBe(1);
  });

  it('should set loading to false after crops load', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    expect(component.loading).toBeFalse();
  });

  it('should filter crops by search text', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    component.searchText = 'wheat';
    expect(component.filteredCrops.length).toBe(1);
    expect(component.filteredCrops[0].cropName).toBe('Wheat');
  });

  it('should filter crops by category', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    component.selectedCategory = 'Vegetable';
    expect(component.filteredCrops.length).toBe(1);
    expect(component.filteredCrops[0].cropName).toBe('Tomato');
  });

  it('should sort crops by price low to high', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    component.selectedSort = 'low';
    const prices = component.filteredCrops.map(c => c.pricePerUnit);
    expect(prices[0]).toBeLessThanOrEqual(prices[1]);
  });

  it('should sort crops by price high to low', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    component.selectedSort = 'high';
    const prices = component.filteredCrops.map(c => c.pricePerUnit);
    expect(prices[0]).toBeGreaterThanOrEqual(prices[1]);
  });

  it('should increment quantity', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    component.incrementQuantity(1, 100);
    expect(component.cropQuantities[1]).toBe(2);
  });

  it('should not increment quantity beyond max', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    component.cropQuantities[1] = 100;
    component.incrementQuantity(1, 100);
    expect(component.cropQuantities[1]).toBe(100);
  });

  it('should decrement quantity', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    component.cropQuantities[1] = 5;
    component.decrementQuantity(1);
    expect(component.cropQuantities[1]).toBe(4);
  });

  it('should not decrement quantity below 1', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    component.cropQuantities[1] = 1;
    component.decrementQuantity(1);
    expect(component.cropQuantities[1]).toBe(1);
  });

  it('should return true for hasFilters when search is set', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    component.searchText = 'wheat';
    expect(component.hasFilters).toBeTrue();
  });

  it('should return false for hasFilters when no filters set', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    expect(component.hasFilters).toBeFalse();
  });

  it('should clear all filters', () => {
    httpMock.expectOne('http://localhost:5178/api/crops').flush(mockCrops);
    component.searchText = 'wheat';
    component.selectedCategory = 'Grain';
    component.selectedSort = 'low';
    component.clearFilters();
    expect(component.searchText).toBe('');
    expect(component.selectedCategory).toBe('');
    expect(component.selectedSort).toBe('');
  });
});
