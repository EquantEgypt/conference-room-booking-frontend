import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NoAuthGuard } from './no-auth.guard';

describe('NoAuthGuard', () => {
  let guard: NoAuthGuard;
  let routerMock = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NoAuthGuard,
        { provide: Router, useValue: routerMock }
      ]
    });
    guard = TestBed.inject(NoAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when not logged in', () => {
    sessionStorage.removeItem('TOKEN');
    expect(guard.canActivate()).toBeTrue();
  });

  it('should redirect to dashboard when logged in', () => {
    sessionStorage.setItem('TOKEN', 'dummy');
    expect(guard.canActivate()).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['dashboard']);
  });
});
