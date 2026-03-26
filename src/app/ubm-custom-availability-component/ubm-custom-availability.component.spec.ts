import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmCustomAvailabilityComponent } from './ubm-custom-availability.component';

describe('UbmCustomAvailabilityComponentComponent', () => {
  let component: UbmCustomAvailabilityComponent;
  let fixture: ComponentFixture<UbmCustomAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmCustomAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmCustomAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
