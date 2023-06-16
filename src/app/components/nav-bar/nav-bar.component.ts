import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {

usuario: string = '';
srvAuth = inject(AuthService);

constructor() {
  this.srvAuth.usrActual
  .subscribe(
    res => {this.usuario = res.nombre
    console.log(res)
  }
    )

  }
  onSalir(){
    this.srvAuth.logout();
  }

}
