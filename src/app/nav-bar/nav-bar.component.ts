import { Component } from '@angular/core';
import { SweetAlertService } from '../core/services/alert/sweet-alert.service';
import { TOKEN } from '../core/services/authentication/authentication.service';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { FilterService } from '../core/services/shared/filters/filter.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isMenuOpen = false;

  constructor(private alert:SweetAlertService,private route: Router,private filterService: FilterService){}

  onClickHome(){
    this.route.navigate(['dashboard']);
  }

  onClickMyBooking(){
    this.route.navigate(['my-booking']);
  }

  logout(){
    sessionStorage.removeItem(TOKEN);
    this.alert.Toast.fire({
            icon: "success",
            title: "You logged out"
          });
    this.filterService.resetFilter();
    this.route.navigate(['login'])
  }
}
