// import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../core/services/api/api.service';
import { ReservationResponse } from '../core/models/reservation-response';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from '../ui/pop-up/pop-up.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cancel-booking',
  standalone: true,
  imports: [
    CommonModule,        
    MatProgressSpinnerModule 
  ],
  templateUrl: './cancel-booking.component.html',
  styleUrls: ['./cancel-booking.component.css']
})
export class CancelBookingComponent implements OnInit {
  reservationId!: number;
  reservation: ReservationResponse | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('reservationId'));
    this.onCancelReservation();
  }

  onCancelReservation() {
    this.isLoading = true;
    this.api.getReservationById(this.reservationId).subscribe({
      next: (data) => {
        this.reservation = data.body;
        this.isLoading = false;
        const dialogRef = this.dialog.open(PopUpComponent, {
          width: '400px',
          data: {
            title: 'Confirm Deletion',
            message: `Are you sure you want to cancel the reservation?`
          }
        });
        dialogRef.afterClosed().subscribe((confirmed) => {
          if (confirmed) {
            this.api.deleteReservation(this.reservationId).subscribe({
              next: () => {
                alert('Cancellation confirmed');
                this.router.navigate(['/my-bookings']);
              },
              error: (err) => {
                console.error('Error deleting reservation:', err);
                alert('Failed to cancel reservation');
              }
            });
          } else {
            this.router.navigate(['/my-bookings']);
          }
        });
      },
      error: (err) => {
        console.error('Error fetching reservation details:', err);
        this.isLoading = false;
      }
    });
  }
}
