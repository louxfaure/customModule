import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmHelpOverlayComponent } from './ubm-help-overlay.component';

describe('UbmHelpOverlayComponent', () => {
  let component: UbmHelpOverlayComponent;
  let fixture: ComponentFixture<UbmHelpOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmHelpOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmHelpOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
