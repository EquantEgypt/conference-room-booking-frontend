import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterComponent } from '../../filter/filter.component';

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

  onClose(){
    this.close.emit();
  }
}
