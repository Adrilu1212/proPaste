import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './components/cliente/cliente.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './shared/guard/auth.guard';
import { Roles } from './shared/models/roles';
import { Error403Component } from './components/error403/error403.component';
import { LoginGuard } from './shared/guard/login.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo:'/login' },
  {path: 'login', component:LoginComponent, canActivate:[LoginGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'cliente', component: ClienteComponent, 
      canActivate: [authGuard],
    data: {roles: [Roles.Admin, Roles.Oficinista, Roles.Cliente]}// se utiliza para que el cliente pueda ver la tabla cuando accede 
   },
   {path : 'error403', component: Error403Component},
   {path : '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
