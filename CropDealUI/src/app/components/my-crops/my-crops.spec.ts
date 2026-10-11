import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { MyCropsComponent } from './my-crops';

describe('MyCropsComponent', () => {
  let component: MyCropsComponent;
  let fixture: ComponentFixture<MyCropsComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockCrops = [
    { id: 1, cropName: 'Wheat', cropType: 'Grain', location: 'Punjab', quantity: 100 },
    { id: 2, cropName: 'Rice', cropType: 'Grain', location: 'UP', quantity: 0 },
    { id: 3, cropName: 'Tomato', cropType: 'Vegetable', location: 'Maharashtra', quantity: 50 }
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MyCropsComponent, HttpClientTestingModule, FormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { queryParams: of({}), snapshot: { queryParams: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyCropsComponent);
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

  it('should filter out crops with quantity 0 on load', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    expect(component.allCrops.length).toBe(2);
    expect(component.allCrops.every(c => c.quantity > 0)).toBeTrue();
  });

  it('should set loading to false after load', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    expect(component.loading).toBeFalse();
  });

  it('should filter crops by search text', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    component.searchText = 'wheat';
    expect(component.filteredListings.length).toBe(1);
    expect(component.filteredListings[0].cropName).toBe('Wheat');
  });

  it('should return all crops when searchText is empty', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    component.searchText = '';
    expect(component.filteredListings.length).toBe(2);
  });

  it('should set showDeleteModal on deleteCrop', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    component.deleteCrop(1);
    expect(component.showDeleteModal).toBeTrue();
    expect(component.cropToDelete).toBe(1);
  });

  it('should reset modal on cancelDelete', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    component.deleteCrop(1);
    component.cancelDelete();
    expect(component.showDeleteModal).toBeFalse();
    expect(component.cropToDelete).toBeNull();
  });

  it('should navigate to publish-crop on editCrop', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    component.editCrop(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/farmer/publish-crop'], { queryParams: { id: 1 } });
  });

  it('should navigate to publish-crop on addNewListing', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    component.addNewListing();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/farmer/publish-crop']);
  });

  it('should remove crop from list on confirmDelete', () => {
    httpMock.expectOne('http://localhost:5178/api/crops/my-crops').flush(mockCrops);
    component.deleteCrop(1);
    component.confirmDelete();
    httpMock.expectOne('http://localhost:5178/api/crops/1').flush({});
    expect(component.crops.find(c => c.id === 1)).toBeUndefined();
  });
});
