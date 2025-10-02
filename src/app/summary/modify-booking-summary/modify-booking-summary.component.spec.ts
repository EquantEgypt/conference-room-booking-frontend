import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyBookingSummaryComponent } from './modify-booking-summary.component';

describe('ModifyBookingSummaryComponent', () => {
  let component: ModifyBookingSummaryComponent;
  let fixture: ComponentFixture<ModifyBookingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyBookingSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyBookingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
