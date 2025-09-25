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
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-modify-booking-summary',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule,QuillModule],
  templateUrl: './modify-booking-summary.component.html',
  styleUrl: './modify-booking-summary.component.css'
})
export class ModifyBookingSummaryComponent {
  reservationId!: number;
  reservation: ReservationRequest | null = null;
  isLoading = false;

  quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link'],
    ['clean']
  ]
};

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
    this.reservationId = Number(this.route.snapshot.paramMap.get('reservationId'));

    this.reservation = history.state.bookingRequest as ReservationRequest | null;
    console.log('History state:', history.state);
    console.log('Reservation from state:', this.reservation);
    
  }

  onBack() {
    this.router.navigate(['/modify-booking', this.reservationId]);
  }

  onUpdateReservation() {
    if (this.reservationId && this.reservation) {
        this.api.updateReservation(this.reservationId, this.reservation).subscribe({
          next: (response) => {
            console.log(response.body);
            this.alert.Toast.fire({
              icon: "success",
              title: "Reservation Updated successfully."
            });
            this.isLoading = false;
            this.router.navigate(['my-booking']);
          },
          error: (err: HttpErrorResponse) => {
            console.error("Full error:", err);

            const backendMsg = err.error.errorMessage;

            this.alert.Toast.fire({
              icon: "error",
              title: backendMsg || "Failed to Update reservation."
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
            title: 'Confirm Modification',
            message: 'Are you sure you want to modify this reservation?',
            confirmMessage:'Yes,update',
            cancelMessage: 'Cancel',
            autoFocus: true,
            restoreFocus: true
          }
        });
    
        dialogRef.afterClosed().subscribe((confirmed) => {
          if (confirmed) {
            this.onUpdateReservation();
          }
        });
      }
}
