import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmCustomResultListAfterComponent } from './ubm-custom-result-list-after.component';

describe('UbmCustomResultListAfterComponent', () => {
  let component: UbmCustomResultListAfterComponent;
  let fixture: ComponentFixture<UbmCustomResultListAfterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmCustomResultListAfterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmCustomResultListAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
