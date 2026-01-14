import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmRecordActionsComponent } from './ubm-record-actions.component';

describe('UbmRecordActionsComponent', () => {
  let component: UbmRecordActionsComponent;
  let fixture: ComponentFixture<UbmRecordActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmRecordActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmRecordActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
