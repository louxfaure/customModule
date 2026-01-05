import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmBriefDisplayComponent } from './ubm-brief-display.component';

describe('UbmBriefDisplayComponent', () => {
  let component: UbmBriefDisplayComponent;
  let fixture: ComponentFixture<UbmBriefDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmBriefDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmBriefDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
