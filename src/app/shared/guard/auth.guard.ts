//Version 16
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const srvAuth = inject(AuthService);
  const router = inject(Router);
  if (srvAuth.isLogged()){
    console.log(route.data);
    if (Object.keys(route.data).length !==0 &&
     route.data['roles'].indexOf(srvAuth.valorUsrActual.rol) === -1){
      router.navigate(['/error403']);
      return false;
     }
    return true;
  }
  srvAuth.logout();
  router.navigate(['/login']);
  return false;
};



// import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return false;
//   }
  
// }
