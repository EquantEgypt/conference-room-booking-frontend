import { Component, OnInit } from '@angular/core';
import { SweetAlertService } from '../core/services/alert/sweet-alert.service';
import { TOKEN } from '../core/services/authentication/authentication.service';
import { Router, NavigationEnd } from '@angular/router';
import { FilterService } from '../core/services/shared/filters/filter.service';
import { ApiService } from '../core/services/api/api.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isMenuOpen = false;
  username = '';
  logoColor = '#FFF';
  currentRoute = '';

  constructor(private alert:SweetAlertService,private route: Router,private filterService: FilterService, private api: ApiService){}
  
  ngOnInit(): void {
    // Track current route for active states
    this.route.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.urlAfterRedirects;
    });

    this.api.getUserInfo().subscribe({
      next: (response: { body: { username: string } }) => {
        this.username = response.body.username;
      },
      error: (err: any) => {
        console.error('Error fetching user info:', err);
      }
    });
  }

  isActiveRoute(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route);
  }

  onClickHome(){
    this.route.navigate(['dashboard']);
  }

  onClickMyBooking(){
    this.route.navigate(['my-booking']);
  }

  onClickcalendarView(){
    this.route.navigate(['calendar-view']);
  }

  logout(){
    localStorage.removeItem(TOKEN);
    this.alert.Toast.fire({
            icon: "success",
            title: "You logged out"
          });
    this.filterService.resetFilter();
    this.route.navigate(['login'])
  }
}
