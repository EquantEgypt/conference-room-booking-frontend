import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { CalendarEvent, CalendarView, CalendarModule } from 'angular-calendar';
import { ApiService } from '../core/services/api/api.service';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    CalendarModule,
  ],
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css'],
})
export class CalendarViewComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();

  readonly CalendarView = CalendarView;

  events: CalendarEvent[] = [];

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  setView(view: CalendarView) {
    this.view = view;
    this.loadEvents();
  }

  closeOpenMonthViewDay() {
    this.loadEvents();
  }

  loadEvents() {
    let startDate: string;
    let endDate: string;

    if (this.view === CalendarView.Day) {
      startDate = this.formatDate(this.viewDate);
      endDate = this.formatDate(this.viewDate);
    } else if (this.view === CalendarView.Week) {
      const start = this.getStartOfWeek(this.viewDate);
      const end = this.getEndOfWeek(this.viewDate);


      end.setHours(12);


      startDate = this.formatDate(start);
      endDate = this.formatDate(end);
    } else { // Month
      const start = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
      const end = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);

      end.setHours(12);

      startDate = this.formatDate(start);
      endDate = this.formatDate(end);
    }

    this.api.getReservationsByDate(startDate, endDate).subscribe(response => {
      const reservations = response.body || [];

      this.events = reservations.flatMap((room: any) =>
        room.reservations.map((r: any) => {
          const start = new Date(r.date + 'T' + r.startTime);
          const end = new Date(r.date + 'T' + r.endTime);

          end.setHours(end.getHours() + 1);

          return {
            start,
            end,
            title: r.myReservation
              ? `${room.roomName}\n${r.title}\n${r.type}`
              : `BUSY`,
            color: {
              primary: r.myReservation ? '#f42c58ff' : '#888888',
              secondary: '#D1E8FF'
            }
          };
        })
      );

      this.events = [...this.events];
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;

    return new Date(d.setDate(diff));
  }

  getEndOfWeek(date: Date): Date {
    const start = this.getStartOfWeek(date);
    return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  }

}
