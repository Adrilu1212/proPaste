import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Token } from '../models/token';
import { Observable, retry, of, BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  SRV = environment.SRV;
  http = inject(HttpClient);
  srvToken = inject(TokenService);
  router = inject(Router);

  private usrActualSubject = new BehaviorSubject<User>(new User());
  public usrActual = this.usrActualSubject.asObservable();

  constructor() { }

  public get valorUsrActual() : User {
    return this.usrActualSubject.value;
  }
 
  public login(user : {idUsuario: '', passw: ''}): Observable<any>{
   return this.http.patch<Token>(`${this.SRV}/sesion/iniciar/${user.idUsuario}`, {passw : user.passw})
   .pipe(
    retry(1),
    tap(
      tokens => {
        this.doLogin(tokens);
        this.router.navigate(['/home']);
        console.log(tokens);
      }
    ),
    map(() => true),
    catchError(
      error => { return of (error.status) }
    )
   )
  }

  public logout(){ 
    if (this.isLogged ()){
    this.http.patch(`${this.SRV}/sesion/cerrar/${this.valorUsrActual.idUsuario}`, {})
    .subscribe();
    this.doLogout();
  }
}

  private doLogin(tokens: Token) : void{
    this.srvToken.setTokens(tokens);
    this.usrActualSubject.next(this.getUserActual());

  }

  private doLogout(){
    if (this.srvToken.token) {
      this.srvToken.eliminarTokens();
    }
    this.usrActualSubject.next(this.getUserActual());
    this.router.navigate(['/login']);
  }

  private getUserActual() : User {
    if (!this.srvToken.token) {
      return new User()
    }
    const tokenD = this.srvToken.decodeToken();
    console.log(tokenD);

    return {idUsuario: tokenD.sub, nombre: tokenD.nom, rol: tokenD.rol};
  }

  public isLogged() : boolean {
    return !!this.srvToken.token && !this.srvToken.jwtTokenExp();
  }

  public verificarRefrescar(): boolean {
    console.log(this.srvToken.tiempoExpToken());
    if (this.isLogged() && this.srvToken.tiempoExpToken() <= 20) {
      this.srvToken.refreshTokens();
      return true;
    }else{
      return false;
    }
  }

}
