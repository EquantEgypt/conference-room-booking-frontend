import { Component } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { RoomResponse } from '../core/models/meeting-room';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  rooms: RoomResponse[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getRooms().subscribe(
      {
        next: (response) => {
          console.log(response.body);
          this.rooms = response.body;
        },
        error: (err) => {
          console.error('Error loading rooms', err);
        }
      },

    )
  }
}
