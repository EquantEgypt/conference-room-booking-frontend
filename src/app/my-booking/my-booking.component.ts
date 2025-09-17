import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../core/services/api/api.service';



@Component({
  selector: 'app-my-booking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-booking.component.html',
  styleUrls: ['./my-booking.component.css']
})
export class MyBookingComponent implements OnInit {
  bookings: any[] = [];
  loading = false;
  errorMsg: string | null = null;

  constructor(private router: Router, private bookingService: ApiService) { }

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings() {
    this.loading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (res) => {
        this.bookings = res.body || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load bookings', err);
        this.errorMsg = 'Failed to load bookings';
        this.loading = false;
      }
    });
  }

  modifyBooking(reservationId: number) {
    
    this.router.navigate(['/modify-booking', reservationId]);
  }
}