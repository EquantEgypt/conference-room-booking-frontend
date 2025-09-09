import { Component, EventEmitter, Output } from '@angular/core';
import { Equip } from '../core/models/equip';
import { NgIf } from '@angular/common';
import { ModalComponent } from '../ui/modal/modal.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgIf],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})

export class FilterComponent {

  constructor(private modal:ModalComponent){}

  equipments: Equip[] = [
    { id: 1, name: "Projector or Large Display Screen / TV", isExist: false },
    { id: 2, name: "Whiteboard", isExist: false },
    { id: 3, name: "Flip Chart", isExist: false },
    { id: 4, name: "Conference Phone (Speakerphone)", isExist: false },
    { id: 5, name: "Video Conferencing System (Camera + Mic)", isExist: false },
    { id: 6, name: "Wireless Presentation System", isExist: false },
    { id: 7, name: "HDMI / VGA Cables & Adapters", isExist: false },
    { id: 8, name: "Laser Pointer / Presenter Remote", isExist: false },
    { id: 9, name: "Room Scheduling Display", isExist: false },
    { id: 10, name: "Power Outlets & Charging Stations", isExist: false },
    { id: 11, name: "Wi-Fi Access Point", isExist: false },
    { id: 12, name: "Microphones", isExist: false },
    { id: 13, name: "Speakers / Sound System", isExist: false },
    { id: 14, name: "Lighting Control System", isExist: false },
    { id: 15, name: "Air Conditioning / Climate Control", isExist: false },
  ];


  capacities:number[] = [10,15,25,35];

  toggleEquip(index: number) {
    this.equipments[index].isExist = !this.equipments[index].isExist;
    console.log(this.equipments[index]);
  }


  onClose() {
    this.modal.onClose();
  }

  onApply(){
    // add some logic to apply filters on rooms
    this.modal.onClose();
  }

}
