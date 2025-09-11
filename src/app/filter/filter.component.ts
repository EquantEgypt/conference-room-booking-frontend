import { Component, EventEmitter, Output } from '@angular/core';
import { Equip } from '../core/models/equip';
import { NgClass, NgIf } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ModalComponent } from '../ui/modal/modal.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgClass],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})


export class FilterComponent {

  filterForm: FormGroup;
  BEGIN_STARTTIME = 9;
  FINISH_STARTTIME = 17;
  BEGIN_ENDTIME = 10;
  FINISH_ENDTIME = 18;

  todayDefault = new Date();
  formattedToday = this.todayDefault.toISOString().split('T')[0]; // "2025-09-09"

  constructor(private modal: ModalComponent, private fb: FormBuilder) {

    this.filterForm = this.fb.group({
      date: [this.formattedToday, [
        Validators.required, this.presentOrFutureDateValidator()
      ]],
      startTime: ['', [
        Validators.required,
      ]],
      endTime: ['', [
        Validators.required,
      ]],
      capacity: ['', [

      ]]
    }, {
      validators: [this.endTimeAfterStartTimeValidator()]
    })

  }

  startTimes: number[] = [];
  endTimes: number[] = [];

  ngOnInit() {
    // fill start times list
    for (let i = this.BEGIN_STARTTIME; i <= this.FINISH_STARTTIME; i++) this.startTimes.push(i);

    // fill end times list
    for (let i = this.BEGIN_ENDTIME; i <= this.FINISH_ENDTIME; i++) this.endTimes.push(i);
  }

  formatTime(hour: number): string {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${suffix}`;
  }

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


  capacities: number[] = [10, 15, 25, 35];

  toggleEquip(index: number) {
    this.equipments[index].isExist = !this.equipments[index].isExist;
    console.log(this.equipments[index]);
  }


  onClose() {
    this.modal.onClose();
  }

  onApply() {
    if (this.filterForm.valid) {
      this.modal.onClose();
      console.log('valid')
    }
    else {
      this.filterForm.markAllAsTouched();
      // console.log('not valid')
      // console.log(this.startTime?.value + ' ' + this.endTime?.value);
      // console.log(this.startTime?.value > this.endTime?.value);
      // // console.log(this.endTime?.touched + ' ' +  this.endTime?.invalid + ' ' + (this.startTime?.value > this.endTime?.value))
    }
  }

  // custom validator
  presentOrFutureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const inputDate = new Date(control.value);
      inputDate.setHours(0, 0, 0, 0);

      // Reject past dates
      if (inputDate < today) return { pastDate: true };

      // Reject "too far in future dates" future dates (e.g. more than 1 year ahead)
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() + 1);
      if(inputDate > maxDate) return { tooFarInFuture: true };

      return null;
    }
  }

  endTimeAfterStartTimeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const startStr:number = control.get('startTime')?.value;
      const endStr:number = control.get('endTime')?.value;

      if(startStr == null || endStr == null)return null;

      const start = Number(startStr);
      const end = Number(endStr);

      return end <= start ? { endBeforeStart: true } : null;
    };
  }


  get date(): AbstractControl | null {
    return this.filterForm.get('date');
  }

  get startTime(): AbstractControl | null {
    return this.filterForm.get('startTime');
  }

  get endTime(): AbstractControl | null {
    return this.filterForm.get('endTime');
  }

  get capacity(): AbstractControl | null {
    return this.filterForm.get('capacity');
  }

}
