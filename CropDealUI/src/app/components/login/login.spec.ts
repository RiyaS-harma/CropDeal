import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login';
import { AuthService } from '../../services/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule, FormsModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty email and password initially', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });

  it('should have empty errorMessage initially', () => {
    expect(component.errorMessage).toBe('');
  });

  it('should navigate to farmer dashboard on farmer login', () => {
    authServiceSpy.login.and.returnValue(of({ userType: 1 }));
    const navigateSpy = spyOn(router, 'navigate');
    component.email = 'farmer@test.com';
    component.password = 'Pass@1';
    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(['/farmer/dashboard']);
  });

  it('should navigate to dealer marketplace on dealer login', () => {
    authServiceSpy.login.and.returnValue(of({ userType: 2 }));
    const navigateSpy = spyOn(router, 'navigate');
    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(['/dealer/marketplace']);
  });

  it('should navigate to admin dashboard on admin login', () => {
    authServiceSpy.login.and.returnValue(of({ userType: 3 }));
    const navigateSpy = spyOn(router, 'navigate');
    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should set errorMessage when user does not exist', () => {
    authServiceSpy.login.and.returnValue(throwError(() => ({ error: { message: 'User does not exist' } })));
    component.onSubmit();
    expect(component.errorMessage).toBe('User does not exist');
  });

  it('should set default errorMessage on unknown failure', () => {
    authServiceSpy.login.and.returnValue(throwError(() => ({})));
    component.onSubmit();
    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should clear errorMessage before each submit', () => {
    component.errorMessage = 'Old error';
    authServiceSpy.login.and.returnValue(of({ userType: 2 }));
    component.onSubmit();
    expect(component.errorMessage).toBe('');
  });
});
