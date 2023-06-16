import { Component, HostListener, inject } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Taller';
  authService = inject (AuthService);
  @HostListener("window:beforeunload", ["$event"])//caputra el evento, se puede poner los eventos que queramos 
  unloadHandler(){
    this.authService.logout();
  }
}
