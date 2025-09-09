import { Component } from '@angular/core';
import { ApiService } from '../core/services/api/api.service';
import { MeetingRoom } from '../core/models/meeting-room';
import { NgIf } from '@angular/common';
import { ModalComponent } from '../ui/modal/modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf,ModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  rooms: MeetingRoom[] = [];
  isModalOpen = false;

  

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
  openModal() {
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.classList.remove('modal-open');
  }
}
