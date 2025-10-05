import { Component } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { MeetingRoom } from '../core/models/meeting-room';
import { NgIf, CommonModule } from '@angular/common';
import { ModalComponent } from '../ui/modal/modal.component';
import { Filter } from '../core/models/filter';
import { FilterService } from '../core/services/shared/filters/filter.service';
import { convertToFilterRequest, FilterRequest } from '../core/models/filter-request';
import { Router } from '@angular/router';
import { ReservationResponse } from '../core/models/reservation-response';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, CommonModule, ModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {
  trackRoomId(index: number, room: MeetingRoom): number {
    return room.roomId;
  }

  rooms: MeetingRoom[] = [];
  isModalOpen = false;
  maxRoomCapacity = 1;
  isLoading = false;
  reservations: ReservationResponse[] = [];
  notificationMessage: string | null = null;
  isUpcomingReservationFound = false;
  filteredData: Filter | null = null;

  constructor(private api: ApiService, private filterService: FilterService, private router: Router) { }

  ngOnInit() {
    this.filteredData = this.filterService.filteredData;

    if (this.filteredData.date) {
      console.log('Filter date:', this.filteredData.date);
    } else {
      console.log('No filter applied yet');
    }
    this.fetchUpcomingReservations();
    this.fetchRooms();
  }

  fetchRooms() {
    const params: FilterRequest = convertToFilterRequest(this.filteredData)
    this.isLoading = true;
    this.api.getRooms(params).subscribe(
      {
        next: (response) => {
          console.log(response.body);
          this.rooms = (response.body as MeetingRoom[]) || [];
          if (this.maxRoomCapacity === 1) { // max room capacity calculated only if it is not calculated yet
            this.maxRoomCapacity = this.getMaxRoomCapacity();
          }
          this.isLoading = false;
          console.log('max capacity from dashboard ' + this.maxRoomCapacity);
        },
        error: (err) => {
          console.error('Error loading rooms', err);
          this.isLoading = false;
        }
      },

    )
  }

  openModal() {
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
  }

  closeModal(event: string) {
    if (event === 'apply') {
      console.log('apply button is clicked');
      this.filteredData = this.filterService.filteredData;
      this.fetchRooms();
    }
    else {
      console.log('close button is clicked');
    }
    this.isModalOpen = false;
    document.body.classList.remove('modal-open');
  }

  getMaxRoomCapacity() {
    let max: number = 1;
    this.rooms.map(room => {
      max = Math.max(room.capacity, max);
    })
    return max;
  }

  onClickOnRoom(roomId: number) {
    this.router.navigate(['create-booking', roomId]);
  }

  formatTime(time: string | null | undefined): string {
    if (!time) return '';
    // Expecting time in 'HH:mm' format
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minuteStr} ${suffix}`;
  }
  clearFilter() {
    this.filterService.resetFilter();
    this.filteredData = this.filterService.filteredData;
    this.fetchRooms();
  }

  fetchUpcomingReservations() {
    this.api.getUpcomingReservations().subscribe(
      (response: any) => {
        console.log(response.body);
        this.reservations = (response.body as ReservationResponse[]) || [];
        this.isUpcomingReservationFound = this.reservations.length > 0;
      },
      (err) => {
        this.isUpcomingReservationFound = false;
        this.notificationMessage = err.error.errorMessage || 'Error loading upcoming reservation';
      }
    );
  }
}