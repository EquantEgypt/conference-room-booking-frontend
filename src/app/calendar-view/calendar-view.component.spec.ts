import { ComponentFixture, TestBed } from '@angular/core/testing';

import { calendarViewComponent } from './calendar-view.component';

describe('calendarViewComponent', () => {
  let component: calendarViewComponent;
  let fixture: ComponentFixture<calendarViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [calendarViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(calendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
