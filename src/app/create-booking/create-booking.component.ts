import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookingService } from '../core/services/booking.service';
import { Subject, takeUntil } from 'rxjs';

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
export class CreateBookingComponent implements OnInit, OnDestroy {
  bookingForm!: FormGroup;
  rooms: Room[] = [];
  startTimes: string[] = [];
  endTimes: string[] = [];
  recurrenceOptions = ['ONE TIME', 'DAILY', 'WEEKLY'];
  selectedRoomName: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private bookingService: BookingService) {}

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      room: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      recurrencePattern: ['ONE TIME', Validators.required]
    });

    this.loadRooms();
    this.generateHours();

    this.bookingForm.get('room')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(roomId => {
        const room = this.rooms.find(r => r.id === roomId);
        this.selectedRoomName = room ? room.name : null;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRooms() {
    this.bookingService.getAvailableRooms().subscribe(res => {
      this.rooms = res;
    });
  }

  generateHours() {
    // Start times: 9 AM → 5 PM
    for (let hour = 9; hour <= 17; hour++) {
      this.startTimes.push(this.formatHour(hour));
    }

    // End times: 10 AM → 6 PM
    for (let hour = 10; hour <= 18; hour++) {
      this.endTimes.push(this.formatHour(hour));
    }
  }

  private formatHour(hour: number): string {
    let displayHour = hour;
    let suffix = 'AM';
    if (hour >= 12) {
      suffix = 'PM';
      if (hour > 12) {
        displayHour = hour - 12;
      }
    }
    return `${displayHour}:00 ${suffix}`;
  }

  submitBooking() {
    if (this.bookingForm.valid) {
      this.bookingService.createBooking(this.bookingForm.value).subscribe({
        next: () => alert('Booking created successfully!'),
        error: (err) => console.error(err)
      });
    }
  }
}
