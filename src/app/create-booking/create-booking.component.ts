import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../core/services/api/api.service';
import { Reservation } from '../core/models/reservation';
import { ReservationRequest, convertToReservationRequest } from '../core/models/reservation-request';
import { SweetAlertService } from '../core/services/alert/sweet-alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FilterService } from '../core/services/shared/filters/filter.service';
import { Filter } from '../core/models/filter';
import { endTimeAfterStartTimeValidator, presentOrFutureDateValidator } from '../core/services/shared/validators/custom-validators';
import { options, RecurrenceOption } from '../core/enum/recurrence-option';
import { MeetingRoom } from '../core/models/meeting-room';
import { ReservationType, resTypes } from '../core/enum/reservation-type';

interface Room {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent implements OnInit {
  isLoading = false;
  isLoadingBtn = false;
  bookingForm!: FormGroup;
  reservation: Reservation | null = null;
  room: MeetingRoom | null = null;
  options: string[] = options;
  resTypes: string[] = resTypes;
  selectedOption = this.options[0];
  roomId: number | null = null;
  reservationId: number | null = null;
  filteredData: Filter | null = null;
  startTimes: number[] = [];
  endTimes: number[] = [];
  todayDefault = new Date();
  formattedToday = this.todayDefault.toISOString().split('T')[0]; // yyyy-mm-dd

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private filterService: FilterService,
    private alert: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.reservationId = Number(this.route.snapshot.paramMap.get('reservationId'));
    this.roomId = Number(this.route.snapshot.paramMap.get('roomId'));
    this.filteredData = this.filterService.filteredData;

    this.generateHours();
    if (this.roomId) this.loadRoom(this.roomId);

    this.bookingForm = this.fb.group({
      description: [null, [Validators.required, Validators.maxLength(50)]],
      startDate: [
        this.filteredData?.date ?? this.formattedToday,
        [Validators.required, presentOrFutureDateValidator()]
      ],
      startTime: [this.filteredData?.startTime ?? '', [Validators.required]],
      endTime: [this.filteredData?.endTime ?? '', [Validators.required]],
      type: ['', [Validators.required]]
    }, {
      validators: [endTimeAfterStartTimeValidator()]
    });

    // Modify case: patch form if reservationId existsssss(important)
    if (this.reservationId) {
      this.api.getReservationById(this.reservationId).subscribe({
        next: (res) => {
          this.reservation = res.body;
          if (this.reservation) {
            this.bookingForm.patchValue({
              description: this.reservation.description,
              startDate: this.reservation.startDate,
              startTime: this.reservation.startTime,
              endTime: this.reservation.endTime,
              type: this.reservation.type
            });
            this.selectedOption = this.reservation.recurrenceOption;
            this.roomId = this.reservation.roomId;
          }
        },
        error: (err) => {
          console.error("Error loading reservation:", err);
        }
      });
    }
  }

  loadRoom(roomId: number) {
    this.isLoading = true;
    this.api.getRoom(roomId).subscribe({
      next: (res) => {
        this.room = res.body;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading room', err);
        this.isLoading = false;
      }
    });
  }

  generateHours() {
    for (let i = 9; i <= 17; i++) this.startTimes.push(i);
    for (let i = 10; i <= 18; i++) this.endTimes.push(i);
  }

  formatTime(hour: number): string {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${suffix}`;
  }

  selectOption(option: string) {
    this.selectedOption = option;
  }

  get description(): AbstractControl | null { return this.bookingForm.get('description'); }
  get startDate(): AbstractControl | null { return this.bookingForm.get('startDate'); }
  get startTime(): AbstractControl | null { return this.bookingForm.get('startTime'); }
  get endTime(): AbstractControl | null { return this.bookingForm.get('endTime'); }
  get type(): AbstractControl | null { return this.bookingForm.get('type'); }

  onReserve() {
    if (!this.bookingForm.valid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.isLoadingBtn = true;

    const booking: ReservationRequest = {
      ...this.bookingForm.value,
      recurrenceOption: this.selectedOption,
      roomId: this.roomId!
    };

    if (this.reservationId) {
      // Update existing reservationnnnnnn
      this.api.updateReservation(this.reservationId, booking).subscribe({
        next: () => {
          this.alert.Toast.fire({ icon: 'success', title: 'Reservation updated successfully.' });
          this.isLoadingBtn = false;
          this.router.navigate(['dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Update error:', err);
          this.alert.Toast.fire({ icon: 'error', title: 'Failed to update reservation.' });
          this.isLoadingBtn = false;
        }
      });
    } else {
      // Create new reservationnnnnnnnnnnnn
      this.api.sendReservation(booking).subscribe({
        next: () => {
          this.alert.Toast.fire({ icon: 'success', title: 'Reservation created successfully.' });
          this.isLoadingBtn = false;
          this.router.navigate(['dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Create error:', err);
          const msg = typeof err.error === 'string' ? err.error : err.error?.message;
          this.alert.Toast.fire({ icon: 'error', title: msg || 'Failed to create reservation.' });
          this.isLoadingBtn = false;
        }
      });
    }
  }
}
