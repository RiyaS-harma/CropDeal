import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PublishCropComponent } from './publish-crop';

describe('PublishCropComponent', () => {
  let component: PublishCropComponent;
  let fixture: ComponentFixture<PublishCropComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [PublishCropComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PublishCropComponent);
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
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode by default', () => {
    expect(component.isEditMode).toBeFalse();
    expect(component.cropId).toBeNull();
  });

  it('should have empty crop fields initially', () => {
    expect(component.crop.cropName).toBe('');
    expect(component.crop.cropType).toBe('');
    expect(component.crop.quantity).toBe(0);
  });

  it('should populate vegetable names on cropType Vegetable', () => {
    component.crop.cropType = 'Vegetable';
    component.onCropTypeChange();
    expect(component.cropNames).toEqual(component.vegetables);
  });

  it('should populate fruit names on cropType Fruit', () => {
    component.crop.cropType = 'Fruit';
    component.onCropTypeChange();
    expect(component.cropNames).toEqual(component.fruits);
  });

  it('should reset cropName on cropType change', () => {
    component.crop.cropName = 'Tomato';
    component.crop.cropType = 'Fruit';
    component.onCropTypeChange();
    expect(component.crop.cropName).toBe('');
  });

  it('should set imageUrl on known crop name selection', () => {
    component.crop.cropName = 'Tomato';
    component.onCropNameChange();
    expect(component.crop.imageUrl).toBeTruthy();
  });

  it('should clear imageUrl for other crop name', () => {
    component.crop.cropName = '__other__';
    component.onCropNameChange();
    expect(component.crop.imageUrl).toBe('');
  });

  it('should POST on submit in create mode', () => {
    component.crop = { cropName: 'Wheat', cropType: 'Grain', quantity: 100, unit: 'kg', pricePerUnit: 25, location: 'Punjab', description: '', imageUrl: '' };
    component.onSubmit();
    const req = httpMock.expectOne('http://localhost:5178/api/crops');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should PUT on submit in edit mode', () => {
    component.isEditMode = true;
    component.cropId = 1;
    component.crop = { cropName: 'Wheat', cropType: 'Grain', quantity: 100, unit: 'kg', pricePerUnit: 25, location: 'Punjab', description: '', imageUrl: '' };
    component.onSubmit();
    const req = httpMock.expectOne('http://localhost:5178/api/crops/1');
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should set successMessage on successful create', () => {
    component.crop = { cropName: 'Wheat', cropType: 'Grain', quantity: 100, unit: 'kg', pricePerUnit: 25, location: 'Punjab', description: '', imageUrl: '' };
    component.onSubmit();
    httpMock.expectOne('http://localhost:5178/api/crops').flush({});
    expect(component.successMessage).toBe('Crop published successfully!');
  });

  it('should set successMessage on successful update', () => {
    component.isEditMode = true;
    component.cropId = 1;
    component.crop = { cropName: 'Wheat', cropType: 'Grain', quantity: 100, unit: 'kg', pricePerUnit: 25, location: 'Punjab', description: '', imageUrl: '' };
    component.onSubmit();
    httpMock.expectOne('http://localhost:5178/api/crops/1').flush({});
    expect(component.successMessage).toBe('Crop updated successfully!');
  });
});
