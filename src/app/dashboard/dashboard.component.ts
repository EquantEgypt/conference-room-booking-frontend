import { Component } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { MeetingRoom } from '../core/models/meeting-room';
import { NgClass, NgIf } from '@angular/common';
import { ModalComponent } from '../ui/modal/modal.component';
import { Filter } from '../core/models/filter';
import { FilterService } from '../core/services/shared/filters/filter.service';
import { convertToFilterRequest, FilterRequest } from '../core/models/filter-request';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, ModalComponent, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent {

  rooms: MeetingRoom[] = [];
  isModalOpen = false;
  maxRoomCapacity = 1;
  isLoading = false;

  filteredData: Filter | null = null;

  constructor(private api: ApiService, private filterService: FilterService) { }

  ngOnInit() {
    this.filteredData = this.filterService.filteredData;

    if (this.filteredData.date) {
      console.log('Filter date:', this.filteredData.date);
    } else {
      console.log('No filter applied yet');
    }
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
          this.maxRoomCapacity = this.getMaxRoomCapacity();
          this.isLoading = false;
          console.log('max capacity from dashboard ' + this.maxRoomCapacity);
        },
        error: (err) => {
          console.error('Error loading rooms', err);
        }
      },

    )
  }

  openModal() {
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.filteredData = this.filterService.filteredData;

    if (this.filteredData.date) {
      console.log('Filter date:', this.filteredData.date);
    } else {
      console.log('No filter applied yet');
    }
    this.fetchRooms();
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

  formatTime(hour: number | null | undefined): string {
    if (hour == null || hour == undefined) return '';
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${suffix}`;
  }

}
