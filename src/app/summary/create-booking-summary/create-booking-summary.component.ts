import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SweetAlertService } from '../../core/services/alert/sweet-alert.service';
import { ApiService } from '../../core/services/api/api.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReservationRequest } from '../../core/models/reservation-request';
import { HttpErrorResponse } from '@angular/common/http';
import { PopUpComponent } from '../../ui/pop-up/pop-up.component';
import { QuillEditorComponent } from "ngx-quill";

@Component({
  selector: 'app-create-booking-summary',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, QuillEditorComponent],
  templateUrl: './create-booking-summary.component.html',
  styleUrl: './create-booking-summary.component.css'
})
export class CreateBookingSummaryComponent {
  reservation: ReservationRequest | null = null;
  isLoading = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private dialog: MatDialog,
    private alert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.fetchReservationDetails();
  }

  fetchReservationDetails() {
    this.isLoading = false;
    this.reservation = history.state.bookingRequest as ReservationRequest | null;
    if (!this.reservation) {
      // Handle case where state is empty (e.g., page refresh)
      this.router.navigate(['/dashboard']);
    }
  }

  onBack() {
    // Go back to the previous page (the booking form)
    history.back();
  }

  onCreateReservation() {
    if (this.reservation) {
      this.isLoading = true; // Start loading when action is confirmed
      this.api.sendReservation(this.reservation).subscribe({
        next: () => {
          this.alert.Toast.fire({
            icon: "success",
            title: "Reservation created successfully."
          });
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          const backendMsg = err.error?.errorMessage || "An unknown error occurred.";
          this.alert.Toast.fire({
            icon: "error",
            title: "Failed to create reservation",
            text: backendMsg
          });
          this.isLoading = false;
        }
      });
    }
  }

  onConfirm() {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '400px',
      data: {
        title: 'Confirm Reservation',
        message: 'Are you sure you want to confirm this reservation?',
        confirmMessage: 'Yes, Confirm',
        cancelMessage: 'Cancel',
        autoFocus: true,
        restoreFocus: true
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.onCreateReservation();
      }
    });
  }

  // Added missing formatTime function
  formatTime(time: string): string {
    if (!time) return '';
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    let displayHour = hour % 12;
    if (displayHour === 0) {
      displayHour = 12; // Handle midnight and noon
    }
    return `${displayHour}:${minuteStr} ${suffix}`;
  }
}