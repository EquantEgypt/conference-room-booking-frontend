import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { dateValidator } from '../core/services/shared/validators/custom-validators';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ApiService } from '../core/services/api/api.service';
import { CalenderViewResponse } from '../core/models/calender-view-response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calender-view',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, NgFor, NgStyle,NgIf],
  templateUrl: './calender-view.component.html',
  styleUrl: './calender-view.component.css'
})
export class CalenderViewComponent {

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
  calenderViewData: CalenderViewResponse[] | null = null;
  roomsInPage: CalenderViewResponse[] | null = null;
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

    this.fetchCalenderViewData();

  }

  convertTimeToHour(time: string): number {
    return Number(time.split(":")[0]); // "09:30:00" -> 9
  }

  fetchCalenderViewData() {
    this.isLoading = true;
    this.api.getCalenderViewDate(this.dateForm.get('date')?.value).subscribe({
      next: (response) => {
        console.log(response.body);

        this.calenderViewData = response.body.map((room: any) => ({
          ...room,
          reservations: room.reservations.map((reservation: any) => ({
            ...reservation,
            date: new Date(reservation.date),
            startTime: Number(reservation.startTime.split(":")[0]),
            endTime: Number(reservation.endTime.split(":")[0])
          }))
        }));

        this.roomsInPage = this.calenderViewData!.slice(
          this.leftPointer,
          Math.min(this.rightPointer, this.calenderViewData!.length)
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
    this.fetchCalenderViewData();
  }

  onClickNext() {
    this.yesterdayOrTommorrow(1);
    this.fetchCalenderViewData();
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
    if (this.rightPointer < this.calenderViewData!.length) {
      this.leftPointer = this.rightPointer;
      this.rightPointer = Math.min(this.rightPointer + this.ROOMS_PAGE_SIZE, this.calenderViewData!.length);
      this.roomsInPage = this.calenderViewData!.slice(this.leftPointer, this.rightPointer);
    }
  }

  OnClickLeftRooms() {
    if (this.leftPointer > 0) {
      this.rightPointer = this.leftPointer;
      this.leftPointer = Math.max(this.leftPointer - this.ROOMS_PAGE_SIZE, 0);
      this.roomsInPage = this.calenderViewData!.slice(this.leftPointer, this.rightPointer);
    }
  }

  formatTime(time: number): string {
    if (time == null) return '';

    const suffix = time >= 12 ? 'PM' : 'AM';
    const displayHour = time === 0 ? 12 : (time > 12 ? time - 12 : time);

    return `${displayHour}:00 ${suffix}`;
  }

  onClickOnRoom(roomId: number) {
    this.router.navigate(['create-booking', roomId]);
  }

  onDateSelected() {
    this.fetchCalenderViewData();
  }
}
