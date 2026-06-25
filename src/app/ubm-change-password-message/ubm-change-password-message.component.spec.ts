import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmChangePasswordMessageComponent } from './ubm-change-password-message.component';

describe('UbmChangePasswordMessageComponent', () => {
  let component: UbmChangePasswordMessageComponent;
  let fixture: ComponentFixture<UbmChangePasswordMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmChangePasswordMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmChangePasswordMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
