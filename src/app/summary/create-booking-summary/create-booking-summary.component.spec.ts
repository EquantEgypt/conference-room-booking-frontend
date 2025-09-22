import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookingSummaryComponent } from './create-booking-summary.component';

describe('CreateBookingSummaryComponent', () => {
  let component: CreateBookingSummaryComponent;
  let fixture: ComponentFixture<CreateBookingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBookingSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBookingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
