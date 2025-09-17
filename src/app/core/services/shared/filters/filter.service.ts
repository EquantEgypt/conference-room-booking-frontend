import { Injectable } from '@angular/core';
import { Filter } from '../../../models/filter';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private _filteredData: Filter = {
    date: null,
    startTime: null,
    endTime: null,
    capacity: null,
    equipmentTypes: []
  };

  set filteredData(filter: Filter) {
    this._filteredData = filter
    console.log(this._filteredData);
  }

  get filteredData(): Filter {
    return this._filteredData;
  }

  resetFilter() {
    this._filteredData = {
      date: null,
      startTime: null,
      endTime: null,
      capacity: null,
      equipmentTypes: []
    };
  }
}
