import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register';
import { AuthService } from '../../services/auth';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, RouterTestingModule, FormsModule],
      providers: [{ provide: AuthService, useValue: authServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default userType as 2 (Dealer)', () => {
    expect(component.userType).toBe(2);
  });

  it('should set errorMessage when passwords do not match', () => {
    component.password = 'Pass@1';
    component.confirmPassword = 'Pass@2';
    component.onSubmit();
    expect(component.errorMessage).toBe('Passwords do not match');
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should set passwordStrength to Weak for short password', () => {
    component.password = 'abc';
    component.checkStrength();
    expect(component.passwordStrength).toBe('Weak');
  });

  it('should set passwordStrength to Strong for complex password', () => {
    component.password = 'Password1';
    component.checkStrength();
    expect(component.passwordStrength).toBe('Strong');
  });

  it('should set passwordStrength to Medium for moderate password', () => {
    component.password = 'password';
    component.checkStrength();
    expect(component.passwordStrength).toBe('Medium');
  });

  it('should split fullName into firstName and lastName', () => {
    authServiceSpy.register.and.returnValue(of({ token: 'token' }));
    component.fullName = 'Rahul Sharma';
    component.email = 'rahul@test.com';
    component.password = 'Pass@1';
    component.confirmPassword = 'Pass@1';
    component.onSubmit();
    expect(authServiceSpy.register).toHaveBeenCalledWith(jasmine.objectContaining({ firstName: 'Rahul', lastName: 'Sharma' }));
  });

  it('should use fullName as both names for single word', () => {
    authServiceSpy.register.and.returnValue(of({ token: 'token' }));
    component.fullName = 'Rahul';
    component.email = 'rahul@test.com';
    component.password = 'Pass@1';
    component.confirmPassword = 'Pass@1';
    component.onSubmit();
    expect(authServiceSpy.register).toHaveBeenCalledWith(jasmine.objectContaining({ firstName: 'Rahul', lastName: 'Rahul' }));
  });

  it('should set successMessage on successful registration', () => {
    authServiceSpy.register.and.returnValue(of({ token: 'token' }));
    component.fullName = 'Rahul Sharma';
    component.email = 'rahul@test.com';
    component.password = 'Pass@1';
    component.confirmPassword = 'Pass@1';
    component.onSubmit();
    expect(component.successMessage).toBe('Registration successful! Redirecting to login...');
  });

  it('should set errorMessage for duplicate username', () => {
    authServiceSpy.register.and.returnValue(throwError(() => ({ error: [{ code: 'DuplicateUserName' }] })));
    component.fullName = 'Rahul Sharma';
    component.password = 'Pass@1';
    component.confirmPassword = 'Pass@1';
    component.onSubmit();
    expect(component.errorMessage).toBe('Username already taken');
  });

  it('should set errorMessage on generic failure', () => {
    authServiceSpy.register.and.returnValue(throwError(() => ({ error: { message: 'Registration failed' } })));
    component.fullName = 'Rahul Sharma';
    component.password = 'Pass@1';
    component.confirmPassword = 'Pass@1';
    component.onSubmit();
    expect(component.errorMessage).toBe('Registration failed');
  });
});
