import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterComponent } from '../../filter/filter.component';
import { Filter } from '../../core/models/filter';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf,FilterComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  @Input() show = false;
  @Output() close = new EventEmitter<void>();
  @Input() maxRoomCapacity!: number;

  ngOnInit(){
    console.log('maxRoomCapacity from model' + this.maxRoomCapacity )  
  }

  onClose(){
    this.close.emit();
  }
}
