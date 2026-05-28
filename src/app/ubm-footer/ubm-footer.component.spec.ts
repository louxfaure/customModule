import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmFooterComponent } from './ubm-footer.component';

describe('UbmFooterComponent', () => {
  let component: UbmFooterComponent;
  let fixture: ComponentFixture<UbmFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
