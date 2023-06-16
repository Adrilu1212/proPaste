import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const LoginGuard: CanActivateFn = ( route, state) =>{
  const authsrv= inject (AuthService);
  const router = inject (Router);
  if (authsrv.isLogged()){
    router.navigate(['/home']);
  }
    return !authsrv.isLogged();
  };
  

