import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmRebondFullDisplayComponent } from './ubm-rebond-full-display.component';

describe('UbmRebondFullDisplayComponent', () => {
  let component: UbmRebondFullDisplayComponent;
  let fixture: ComponentFixture<UbmRebondFullDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmRebondFullDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmRebondFullDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
