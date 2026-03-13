import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmResourceTypeBarHookComponent } from './ubm-resource-type-bar-hook.component';

describe('UbmResourceTypeBarHookComponent', () => {
  let component: UbmResourceTypeBarHookComponent;
  let fixture: ComponentFixture<UbmResourceTypeBarHookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmResourceTypeBarHookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmResourceTypeBarHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
