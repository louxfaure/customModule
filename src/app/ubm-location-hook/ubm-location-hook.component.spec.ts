import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmLocationHookComponent } from './ubm-location-hook.component';

describe('UbmCollectioDiscoveryItemHookComponent', () => {
  let component: UbmLocationHookComponent;
  let fixture: ComponentFixture<UbmLocationHookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmLocationHookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmLocationHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
