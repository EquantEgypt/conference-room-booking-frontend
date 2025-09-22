import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateValidator } from '../core/services/shared/validators/custom-validators';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ApiService } from '../core/services/api/api.service';
import { calendarViewResponse } from '../core/models/calendar-view-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgFor, NgStyle,NgIf],
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.css'
})
export class calendarViewComponent {

  todayDefault = new Date();
  formattedToday = this.todayDefault.toISOString().split('T')[0]; // "2025-09-09"
  dateForm!: FormGroup;
  START_HOUR = 9;
  END_HOUR = 17;
  SLOT_HEIGHT = 60;
  timeLabels: number[] = [];
  ROOMS_PAGE_SIZE: number = 5;
  leftPointer = 0;
  rightPointer = this.ROOMS_PAGE_SIZE;
  calendarViewData: calendarViewResponse[] | null = null;
  roomsInPage: calendarViewResponse[] | null = null;
  isLoading = false;



  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) { }

  ngOnInit() {

    // fill time label
    for (let h = this.START_HOUR; h <= this.END_HOUR; h++) {
      this.timeLabels.push(h);
    }



    this.dateForm = this.fb.group({
      date: [this.formattedToday, [
        Validators.required, dateValidator()
      ]],
    });

    this.fetchcalendarViewData();

  }

  convertTimeToHour(time: string): number {
    return Number(time.split(":")[0]); // "09:30:00" -> 9
  }

  fetchcalendarViewData() {
    this.isLoading = true;
    this.api.getcalendarViewDate(this.dateForm.get('date')?.value).subscribe({
      next: (response) => {
        console.log(response.body);

        this.calendarViewData = response.body.map((room: any) => ({
          ...room,
          reservations: room.reservations.map((reservation: any) => ({
            ...reservation,
            date: new Date(reservation.date),
            startTime: Number(reservation.startTime.split(":")[0]),
            endTime: Number(reservation.endTime.split(":")[0])
          }))
        }));

        this.roomsInPage = this.calendarViewData!.slice(
          this.leftPointer,
          Math.min(this.rightPointer, this.calendarViewData!.length)
        );

        this.isLoading = false;
      },
      error: (err) => {
        console.log(err.body);
        this.isLoading = false;
      }
    });
  }


  get date(): AbstractControl | null {
    return this.dateForm.get('date');
  }

  onClickPrev() {
    this.yesterdayOrTommorrow(-1)
    this.fetchcalendarViewData();
  }

  onClickNext() {
    this.yesterdayOrTommorrow(1);
    this.fetchcalendarViewData();
  }

  yesterdayOrTommorrow(num: number): string | null {
    const currentDate = this.dateForm.get('date')?.value;

    if (currentDate) {

      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + num);
      const formattedDate = newDate.toISOString().split('T')[0];
      this.dateForm.get('date')?.setValue(formattedDate);

      return formattedDate;
    } else {
      return null;
    }
  }


  onApplyDate() {
    console.log("date is applied");
  }

  OnClickRightRooms() {
    if (this.rightPointer < this.calendarViewData!.length) {
      this.leftPointer = this.rightPointer;
      this.rightPointer = Math.min(this.rightPointer + this.ROOMS_PAGE_SIZE, this.calendarViewData!.length);
      this.roomsInPage = this.calendarViewData!.slice(this.leftPointer, this.rightPointer);
    }
  }

  OnClickLeftRooms() {
    if (this.leftPointer > 0) {
      this.rightPointer = this.leftPointer;
      this.leftPointer = Math.max(this.leftPointer - this.ROOMS_PAGE_SIZE, 0);
      this.roomsInPage = this.calendarViewData!.slice(this.leftPointer, this.rightPointer);
    }
  }

  formatTime(time: number): string {
    if (time == null) return '';

    const suffix = time >= 12 ? 'PM' : 'AM';
    const displayHour = time === 0 ? 12 : (time > 12 ? time - 12 : time);

    return `${displayHour}:00 ${suffix}`;
  }

  onClickOnRoom(roomId: number) {
    console.log(this.dateForm.get('date')?.value);
    this.router.navigate(['create-booking', roomId],
      {state: { date :  this.dateForm.get('date')?.value}});
  }

  onDateSelected() {
    this.fetchcalendarViewData();
  }
}
