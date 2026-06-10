import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmLoginFormHookComponent } from './ubm-login-form-hook.component';

describe('UbmLoginFormHookComponent', () => {
  let component: UbmLoginFormHookComponent;
  let fixture: ComponentFixture<UbmLoginFormHookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmLoginFormHookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmLoginFormHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
