import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { Equip, mapEquip } from '../core/models/equip';
import { NgClass, NgIf } from '@angular/common';
import { AbstractControl, EmailValidator, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ApiService } from '../core/services/api/api.service';
import { FilterService } from '../core/services/shared/filters/filter.service';
import { capacityValidator, endTimeAfterStartTimeValidator, presentOrFutureDateValidator } from '../core/services/shared/validators/custom-validators';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, NgClass],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})


export class FilterComponent {

  filterForm:any ;
  BEGIN_STARTTIME = 9;
  FINISH_STARTTIME = 17;
  BEGIN_ENDTIME = 10;
  FINISH_ENDTIME = 18;

  todayDefault = new Date();
  formattedToday = this.todayDefault.toISOString().split('T')[0]; // "2025-09-09"

  constructor(private fb: FormBuilder,private api: ApiService,private filterService: FilterService) { }

  startTimes: string[] = [];
  endTimes: string[] = [];

  ngOnInit() {
    const savedFilter = this.filterService.filteredData;

    // fill start times list as 'HH:mm'
    for (let i = this.BEGIN_STARTTIME; i <= this.FINISH_STARTTIME; i++) {
      this.startTimes.push(i.toString().padStart(2, '0') + ':00');
    }
    // fill end times list as 'HH:mm'
    for (let i = this.BEGIN_ENDTIME; i <= this.FINISH_ENDTIME; i++) {
      this.endTimes.push(i.toString().padStart(2, '0') + ':00');
    }

    // initialize form group
    this.filterForm = this.fb.group({
      date: [savedFilter.date ? savedFilter.date : this.formattedToday, [
        Validators.required, presentOrFutureDateValidator()
      ]],
      startTime: [savedFilter.startTime ? savedFilter.startTime : '', [Validators.required,]],
      endTime: [savedFilter.endTime ? savedFilter.endTime : '', [Validators.required]],
      capacity: [savedFilter.capacity ? savedFilter.capacity : 1, [capacityValidator(1,this.maxRoomCapacity)]]
    }, {
      validators: [endTimeAfterStartTimeValidator()]
    })

    if (savedFilter.equipmentTypes.length === 0) {
      this.fetchEquipments()
    }
    else {
      this.equipments = savedFilter.equipmentTypes;
    }
    console.log('max capacity is ' + this.maxRoomCapacity);
  }

  equipments: Equip[] = [];

  fetchEquipments() {
    this.api.getEquipments().subscribe({
      next: (response) => {
        this.equipments = mapEquip(response.body);
        console.log(this.equipments);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  toggleEquip(index: number) {
    this.equipments[index].isChecked = !this.equipments[index].isChecked;
    console.log(this.equipments[index]);
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minuteStr} ${suffix}`;
  }

  @Output() close = new EventEmitter<void>();
  @Input() maxRoomCapacity!: number;


  onCloseFilter() {
    this.close.emit();
    console.log('max capacity is ' + this.maxRoomCapacity);
  }

  onApplyFilter() {
    if (this.filterForm.valid) {
      const filter = {
        ...this.filterForm.value,
        equipmentTypes: this.equipments
      }
      this.filterService.filteredData = filter;
      console.log(filter);
      this.close.emit();
      console.log('valid');
    }
    else {
      this.filterForm.markAllAsTouched();
    }
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
