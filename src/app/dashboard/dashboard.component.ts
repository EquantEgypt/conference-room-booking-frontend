import { Component } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { MeetingRoom } from '../core/models/meeting-room';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  loadingState: { [key: number]: boolean } = {}; // track per-room loading
  rooms: MeetingRoom[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getRooms().subscribe(
      {
        next: (response) => {
          console.log(response.body);
          this.rooms = response.body;
          // set all rooms to loading = true initially
          this.rooms.forEach(room => this.loadingState[room.id] = true);
        },
        error: (err) => {
          console.error('Error loading rooms', err);
        }
      },

    )
  }

  onImageLoad(roomId: number) {
    if (this.loadingState[roomId]) {
      this.loadingState[roomId] = false;
    }
  }

}
