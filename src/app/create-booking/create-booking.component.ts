import { QuillModule } from 'ngx-quill';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
import { ReservationResponse } from '../core/models/reservation-response';


interface Room {
  id: number;
  name: string;
}

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, QuillModule, FormsModule],
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css']
})
export class CreateBookingComponent {
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  isLoading = false;
  isLoadingBtn = false;
  BEGIN_STARTTIME = 9;
  FINISH_STARTTIME = 17;
  BEGIN_ENDTIME = 10;
  FINISH_ENDTIME = 18;
  bookingForm!: FormGroup;
  reservation: Reservation | null = null;
  reservationResponse: ReservationResponse | null = null;
  reservationId: number | null = null;
  rooms: Room[] = [];
  roomsList: MeetingRoom[] = []; //newwwww
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
  modeTypeMsg = '';
  isUpdate: boolean = false;
  dateComingFromCalenderView: string | null = null;
  recurrenceSelected: string = this.options[0];  // default to 'One time' option
  showRecurrenceOptions: boolean = false;
  showNoRecurrenceOption: boolean = false;

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



  constructor(private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private filterService: FilterService,
    private alert: SweetAlertService
  ) { }

  // Normalize time coming from various sources ("HH:mm:ss", "HH:mm", 13, "13") to an hour number
  private extractHour(value: string | number | null | undefined): number | '' {
    if (value === null || value === undefined) return '';
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      if (value.includes(':')) {
        const hour = Number(value.split(':')[0]);
        return isNaN(hour) ? '' : hour;
      }
      const numeric = Number(value);
      return isNaN(numeric) ? '' : numeric;
    }
    return '';
  }

  ngOnInit(): void {
    const state = history.state as { date?: string | Date };

    this.dateComingFromCalenderView = state?.date
      ? this.formatDateForInput(new Date(state.date))
      : null;
    console.log(this.dateComingFromCalenderView);

    const savedFilter = this.filterService.filteredData;
    this.roomId = Number(this.route.snapshot.paramMap.get('roomId'));
    this.reservationId = Number(this.route.snapshot.paramMap.get('reservationId'));

    this.filteredData = this.filterService.filteredData;
    console.log(this.filteredData);

    this.generateHours();


    //fetch all rooms for dropdown
    this.api.getRooms(null).subscribe({
      next: (response) => {
        this.roomsList = response.body as MeetingRoom[]; // cast هنا //new
      },
      error: (err) => {
        console.error("Error loading rooms list", err);
      }
    });





    // fetch room details
    if (this.roomId && !this.reservationId) {
      this.loadRoom(this.roomId);
      this.modeTypeMsg = 'Reserve';
    }


    this.bookingForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      description: [''], // Set empty string instead of null
      startDate: [
        this.dateComingFromCalenderView
        ?? this.filteredData?.date
        ?? this.formattedToday,
        [Validators.required, presentOrFutureDateValidator()]
      ],
      startTime: [
        this.extractHour(this.filteredData?.startTime as any) ?? '',
        [Validators.required]
      ],
      endTime: [
        this.extractHour(this.filteredData?.endTime as any) ?? '',
        [Validators.required]
      ],
      type: [
        '', [Validators.required]
      ],
      numberOfRecurrence: [1] // Remove validation, will be handled conditionally
    }, {
      validators: [endTimeAfterStartTimeValidator()]
    });

    if (this.reservationId) {
      this.loadReservation(this.reservationId);
      this.modeTypeMsg = 'Update';
      this.isUpdate = true;
    }
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
  //method for changing the room when choosing new room
  onRoomChange(newRoomId: string | number) { 
    this.roomId = Number(newRoomId); 
    this.loadRoom(this.roomId); 
}



  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0]; // "2025-09-23"
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
  this.recurrenceSelected = option;
  this.selectedOption = option;  // keep for backwards compatibility if used elsewhere
  this.showRecurrenceOptions = true;
  this.showNoRecurrenceOption = option == this.options[0];

  // Update validation for numberOfRecurrence based on recurrence option
  const numberOfRecurrenceControl = this.bookingForm.get('numberOfRecurrence');
  if (option === this.options[0]) { // One-time
    numberOfRecurrenceControl?.clearValidators();
    numberOfRecurrenceControl?.setValue(1);
  } else { // Daily or Weekly
    numberOfRecurrenceControl?.setValidators([Validators.required, Validators.min(2)]);
    if (numberOfRecurrenceControl?.value === 1) {
      numberOfRecurrenceControl?.setValue(2);
    }
  }
  numberOfRecurrenceControl?.updateValueAndValidity();
}

  formatedRecOption(option: string): string {
    if (option ===RecurrenceOption.ONE_TIME) return 'One time';
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

  get numberOfRecurrence(): AbstractControl | null {
    return this.bookingForm.get('numberOfRecurrence');
  }

  get title(): AbstractControl | null {
    return this.bookingForm.get('title');
  }

  onReserve() {
    // Declare bookingRequest outside so it's accessible in both blocks
    let bookingRequest: any = null;

    if (this.bookingForm.valid) {
      this.isLoadingBtn = true;
      // Ensure time fields are 'HH:mm:ss' strings (backend expects seconds)
      const formatToHHMMSS = (val: any) => {
        if (typeof val === 'string' && val.includes(':')) {
          // If already has format like "HH:mm" or "HH:mm:ss"
          const parts = val.split(':');
          if (parts.length === 2) {
            return val + ':00'; // Convert "HH:mm" to "HH:mm:ss"
          }
          return val; // Already "HH:mm:ss"
        }
        if (typeof val === 'number') return val.toString().padStart(2, '0') + ':00:00';
        if (typeof val === 'string' && !isNaN(Number(val))) {
          // Convert string numbers like "10", "13" to "HH:mm:ss" format
          return Number(val).toString().padStart(2, '0') + ':00:00';
        }
        return null; // Return null instead of empty string for invalid values
      };
      // Get values directly from form controls
      const date = this.bookingForm.get('startDate')?.value || this.formattedToday;
      const startTimeValue = this.bookingForm.get('startTime')?.value;
      const endTimeValue = this.bookingForm.get('endTime')?.value;
      const startTime = formatToHHMMSS(startTimeValue);
      const endTime = formatToHHMMSS(endTimeValue);
      const roomId = this.roomId ?? (this.room?.roomId ?? null);

      console.log('Form values:', {
        date,
        startTimeValue,
        endTimeValue,
        startTime,
        endTime,
        roomId
      });

      // Defensive: If any required field is missing, abort and show error
      if (!date || !roomId || !startTime || !endTime) {
        this.alert.Toast.fire({
          icon: "error",
          title: "Please fill all required fields including date, time, and room."
        });
        this.isLoadingBtn = false;
        return;
      }
      const booking = {
        ...this.bookingForm.value,
        date: date, // Use 'date' not 'startDate' to match backend expectation
        startTime: startTime,
        endTime: endTime,
        recurrenceOption: this.selectedOption,
        roomId: roomId,
        roomName: this.room?.name ?? '' ,
        description: this.bookingForm.value.description || "", // Ensure description is never null
        // Only include numberOfRecurrence for recurring meetings
        ...(this.selectedOption !== this.options[0] ? { numberOfRecurrence: this.bookingForm.value.numberOfRecurrence } : {})
      };
      bookingRequest = convertToReservationRequest(booking);
      console.log('Final booking request:', bookingRequest);

      if (!this.isUpdate)
        this.router.navigate(['summary/create-booking'], { state: { bookingRequest } });
      else
        this.router.navigate(['summary/modify-booking', this.reservationId], { state: { bookingRequest } });


      // If not update, send reservation
    }
    else {
      this.bookingForm.markAllAsTouched();
    }
  }

  loadReservation(reservationId: number) {
    this.isLoading = true;
    this.api.getReservationById(reservationId).subscribe({
      next: (response) => {
        this.reservationResponse = response.body;
        if (this.reservationResponse) {
          this.bookingForm.patchValue({
            title: this.reservationResponse.title,
            description: this.reservationResponse.description || '',
            startDate: this.reservationResponse.date ? new Date(this.reservationResponse.date).toISOString().split('T')[0] : this.formattedToday,
            startTime: this.extractHour(this.reservationResponse.startTime ?? ''),
            endTime: this.extractHour(this.reservationResponse.endTime ?? ''),
            type: this.reservationResponse.type || '',
            numberOfRecurrence: this.reservationResponse.numberOfReccurrences || 1, // Default to 1 if null
          });
          this.roomId = this.reservationResponse.roomId || null;
          this.loadRoom(this.roomId!);
          this.selectedOption = this.reservationResponse.recurrenceOption || this.options[0];
          this.selectOption(this.selectedOption);
        }
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error loading reservation:", err);
        this.alert.Toast.fire({
          icon: "error",
          title: "Failed to load reservation."
        });
        this.isLoading = false;
      }
    });
  }
}
