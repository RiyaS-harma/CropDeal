import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent, HttpClientTestingModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
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
    httpMock.expectOne('http://localhost:5024/api/user/profile').flush({ firstName: 'Rahul', userType: 1 });
    httpMock.expectOne('http://localhost:5005/api/bankaccount').flush({ id: 1, bankAccountNumber: '123', bankName: 'SBI' });
    httpMock.expectOne('http://localhost:5024/api/user/dashboard').flush({});
    expect(component).toBeTruthy();
  });

  function flushInitRequests() {
    httpMock.expectOne('http://localhost:5024/api/user/profile').flush({});
    httpMock.expectOne('http://localhost:5005/api/bankaccount').flush({});
    httpMock.expectOne('http://localhost:5024/api/user/dashboard').flush({});
  }

  it('should return Farmer for userType 1', () => {
    flushInitRequests();
    component.user = { userType: 1 };
    expect(component.getUserTypeName()).toBe('Farmer');
  });

  it('should return Dealer for userType 2', () => {
    flushInitRequests();
    component.user = { userType: 2 };
    expect(component.getUserTypeName()).toBe('Dealer');
  });

  it('should return Admin for userType 3', () => {
    flushInitRequests();
    component.user = { userType: 3 };
    expect(component.getUserTypeName()).toBe('Admin');
  });

  it('should return Unknown for unknown userType', () => {
    flushInitRequests();
    component.user = { userType: 99 };
    expect(component.getUserTypeName()).toBe('Unknown');
  });

  it('should have editMode false initially', () => {
    flushInitRequests();
    expect(component.editMode).toBeFalse();
  });

  it('should have bankEditMode false initially', () => {
    flushInitRequests();
    expect(component.bankEditMode).toBeFalse();
  });

  it('should set profileSuccessMessage on successful update', () => {
    flushInitRequests();
    component.updateProfile();
    httpMock.expectOne('http://localhost:5024/api/user/profile').flush('ok');
    expect(component.profileSuccessMessage).toBe('Profile updated successfully!');
    expect(component.editMode).toBeFalse();
  });

  it('should set profileErrorMessage on failed update', () => {
    flushInitRequests();
    component.updateProfile();
    httpMock.expectOne('http://localhost:5024/api/user/profile').error(new ErrorEvent('error'));
    expect(component.profileErrorMessage).toBe('Failed to update profile');
  });
});
