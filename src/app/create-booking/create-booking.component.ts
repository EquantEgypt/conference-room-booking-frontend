import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../core/services/api/api.service';
import { MeetingRoom } from '../core/models/meeting-room';
import { options, RecurrenceOption } from '../core/enum/recurrence-option';
import { Reservation } from '../core/models/reservation';
import { ReservationType, resTypes } from '../core/enum/reservation-type';
import { FilterService } from '../core/services/shared/filters/filter.service';
import { Filter } from '../core/models/filter';
import { endTimeAfterStartTimeValidator, presentOrFutureDateValidator } from '../core/services/shared/validators/custom-validators';
import { convertToReservationRequest } from '../core/models/reservation-request';
import { SweetAlertService } from '../core/services/alert/sweet-alert.service';
import { HttpErrorResponse } from '@angular/common/http';

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
export class CreateBookingComponent {
  isLoading = false;
  isLoadingBtn = false;
  BEGIN_STARTTIME = 9;
  FINISH_STARTTIME = 17;
  BEGIN_ENDTIME = 10;
  FINISH_ENDTIME = 18;
  bookingForm!: FormGroup;
  reservation: Reservation | null = null;
  rooms: Room[] = [];
  room: MeetingRoom | null = null;
  options: string[] = options;
  resTypes: string[] = resTypes;
  selectedOption = this.options[0];
  selectedRoomName: string | null = null;
  roomId: number | null = null;
  filteredData: Filter | null = null;
  startTimes: number[] = [];
  endTimes: number[] = [];
  todayDefault = new Date();
  formattedToday = this.todayDefault.toISOString().split('T')[0]; // "2025-09-09"

  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private filterService: FilterService,
    private alert: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.roomId = Number(this.route.snapshot.paramMap.get('roomId'));

    this.filteredData = this.filterService.filteredData;
    console.log(this.filteredData);

    this.generateHours();

    // fetch room details
    this.loadRoom(this.roomId);

    this.bookingForm = this.fb.group({
      description: [null, [Validators.required, Validators.maxLength(50)]],
      startDate: [
        this.filteredData?.date ?? this.formattedToday,
        [Validators.required, presentOrFutureDateValidator()]
      ],
      startTime: [
        this.filteredData?.startTime ?? '',
        [Validators.required]
      ],
      endTime: [
        this.filteredData?.endTime ?? '',
        [Validators.required]
      ],
      type: [
        '', [Validators.required]
      ]

    }, {
      validators: [endTimeAfterStartTimeValidator()]
    });

  }

  loadRoom(roomId: number) {
    this.isLoading = true;
    this.api.getRoom(roomId).subscribe(
      {
        next: (response) => {
          this.room = response.body;
          this.isLoading = false;
          console.log(this.room);
        },
        error: (err) => {
          console.error('Error loading rooms', err);
          this.isLoading = false;
        }
      },
    )
  }

  generateHours() {
    // Start times: 9 AM → 5 PM
    for (let i = this.BEGIN_STARTTIME; i <= this.FINISH_STARTTIME; i++) this.startTimes.push(i);

    // End times: 10 AM → 6 PM
    for (let i = this.BEGIN_ENDTIME; i <= this.FINISH_ENDTIME; i++) this.endTimes.push(i);
  }

  formatTime(hour: number): string {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${suffix}`;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    console.log(this.selectedOption);
    console.log(this.formatedRecOption(this.selectedOption))
  }

  formatedRecOption(option: string): string {
    if (option === RecurrenceOption.ONE_TIME) return 'One time';
    else if (option === RecurrenceOption.DAILY) return 'Daily';
    else return 'Weekly'
  }

  formatedResType(type: string): string {
    if (type === ReservationType.INTERNAL) return 'Internal';
    else return 'External';
  }

  get description(): AbstractControl | null {
    return this.bookingForm.get('description');
  }

  get startDate(): AbstractControl | null {
    return this.bookingForm.get('startDate');
  }

  get endDate(): AbstractControl | null {
    return this.bookingForm.get('endDate');
  }

  get startTime(): AbstractControl | null {
    return this.bookingForm.get('startTime');
  }

  get endTime(): AbstractControl | null {
    return this.bookingForm.get('endTime');
  }

  get type(): AbstractControl | null {
    return this.bookingForm.get('type');
  }

  onReserve() {
    if (this.bookingForm.valid) {
      this.isLoadingBtn = true;
      const booking = {
        ...this.bookingForm.value,
        recurrenceOption: this.selectedOption,
        roomId: this.roomId
      }
      const bookingRequest = convertToReservationRequest(booking);
      console.log(bookingRequest);
      this.api.sendReservation(bookingRequest).subscribe({
        next: (response) => {
          console.log(response.body);
          this.alert.Toast.fire({
            icon: "success",
            title: "Reservation Created successfully."
          });
          this.isLoadingBtn = false;
          this.router.navigate(['dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          console.error("Full error:", err);

          const backendMsg = typeof err.error === 'string' ? err.error : err.error?.message;

          this.alert.Toast.fire({
            icon: "error",
            title: backendMsg || "Failed to create reservation."
          });
          this.isLoadingBtn = false;
        }
      })

    }
    else {
      this.bookingForm.markAllAsTouched();
    }
  }
}
