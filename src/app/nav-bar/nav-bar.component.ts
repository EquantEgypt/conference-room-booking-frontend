import { Component, OnInit, HostListener } from '@angular/core';
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
  unreadNotifications = 0; 
  showNotifications = false;
  
  notifications = [
    { id: 1, message: 'Your booking for Room A has been confirmed', time: '5 min ago', read: false },
    { id: 2, message: 'Room B is now available for booking', time: '1 hour ago', read: false },
    { id: 3, message: 'Your booking request is pending approval', time: '2 hours ago', read: false },
    { id: 4, message: 'Reminder: Meeting in Room C starts in 30 minutes', time: '3 hours ago', read: false },
    { id: 5, message: 'Your booking has been updated', time: '5 hours ago', read: true }
  ];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const notificationContainer = document.querySelector('.notification-container');
    
    // Close notifications if click is outside the notification container
    if (notificationContainer && !notificationContainer.contains(target)) {
      this.showNotifications = false;
    }
  }

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

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => notification.read = true);
    this.unreadNotifications = 0;
  }

  viewAllNotifications(event: Event): void {
    event.preventDefault();
    this.showNotifications = false;
    // Navigate to notifications page or handle as needed
    console.log('View all notifications clicked');
  }
}
