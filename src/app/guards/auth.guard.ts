import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { inject } from '@angular/core';

const LOGIN_ROUTE: string = '/login'
const DEFAULT_ROUTE: string = '/shopping'

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)

  return authService.isLoggedIn() || inject(Router).createUrlTree([LOGIN_ROUTE])
};

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  
  return !authService.isLoggedIn() || inject(Router).createUrlTree([DEFAULT_ROUTE])
};
