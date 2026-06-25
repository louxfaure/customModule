import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmRequestCardHookComponent } from './ubm-request-card-hook.component';

describe('UbmRequestCardHookComponent', () => {
  let component: UbmRequestCardHookComponent;
  let fixture: ComponentFixture<UbmRequestCardHookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmRequestCardHookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmRequestCardHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
