import { Component } from '@angular/core';
import { SweetAlertService } from '../core/services/alert/sweet-alert.service';
import { TOKEN } from '../core/services/authentication/authentication.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isMenuOpen = false;

  constructor(private alert:SweetAlertService,private route: Router){}

  logout(){
    sessionStorage.removeItem(TOKEN);
    this.alert.Toast.fire({
            icon: "success",
            title: "You logged out"
          });
    this.route.navigate(['login'])
  }
}
