import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api/api.service';
import { ReservationResponse } from '../../core/models/reservation-response';
import { MatDialog } from '@angular/material/dialog';
import { PopUpComponent } from '../../ui/pop-up/pop-up.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SweetAlertService } from '../../core/services/alert/sweet-alert.service';


@Component({
  selector: 'app-cancel-booking',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule ],
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
    private dialog: MatDialog,
    private alert: SweetAlertService
  ) { }
  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('reservationId'));
    this.fetchReservationDetails();
  }

  fetchReservationDetails() {
    this.isLoading = true;
    this.api.getReservationById(this.reservationId).subscribe({
      next: (response) => {
        this.reservation = response.body;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reservation details:', err);
        this.isLoading = false;
      }
    });
  }

  onBack() {
    this.router.navigate(['/create-booking']);
  }


  onCancelReservation() {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to cancel this reservation?',
        confirmMessage:'Yes,Cancel Reservation',
        cancelMessage:'No, keep it',
        autoFocus: true,
        restoreFocus: true
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.deleteReservation();
      }
    });
  }

  deleteReservation() {
  this.isLoading = true;
  this.api.deleteReservation(this.reservationId).subscribe({
    next: () => {
      this.alert.Toast.fire({
        icon: "success",
        title: "Reservation cancelled successfully."
      });
      this.router.navigate(['/my-booking']);
    },
    error: (err) => {
      console.error('Error deleting reservation:', err);
      this.alert.Toast.fire({
        icon: "error",
        title: "Failed to cancel reservation."
      });
      this.isLoading = false;
    }
  });
  }
  formatTime(time: string): string {
    if (!time) return '';
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minuteStr} ${suffix}`;
  }
}
