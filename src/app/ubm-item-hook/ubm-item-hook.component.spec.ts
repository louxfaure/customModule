import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmItemHookComponent } from './ubm-item-hook.component';

describe('UbmItemHookComponent', () => {
  let component: UbmItemHookComponent;
  let fixture: ComponentFixture<UbmItemHookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmItemHookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmItemHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
