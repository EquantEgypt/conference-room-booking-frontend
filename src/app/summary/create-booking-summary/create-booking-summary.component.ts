import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  reservationId!: number;
  reservation: ReservationRequest | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
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
    console.log('History state:', history.state);
    console.log('Reservation from state:', this.reservation);

  }

  onBack() {
    this.router.navigate(['/my-booking']);
  }

  onCreateReservation() {
    if(this.reservation)
    this.api.sendReservation(this.reservation).subscribe({
        next: (response) => {
          console.log(response.body);
          this.alert.Toast.fire({
            icon: "success",
            title: "Reservation Created successfully."
          });
          this.isLoading = false;
          this.router.navigate(['dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          console.error("Full error:", err);

          const backendMsg = err.error.errorMessage;

          this.alert.Toast.fire({
            icon: "error",
            title: backendMsg || "Failed to create reservation."
          });
          this.isLoading = false;
        }
      });
    }


      onConfirm() {
        const dialogRef = this.dialog.open(PopUpComponent, {
          width: '400px',
          data: {
            title: 'Confirm Reservation',
            message: 'Are you sure you want to confirm this reservation?',
            confirmMessage:'Yes,confirm',
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
  }

