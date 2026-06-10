import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmCollectioDiscoveryItemHookComponent } from './ubm-collectio-discovery-item-hook.component';

describe('UbmCollectioDiscoveryItemHookComponent', () => {
  let component: UbmCollectioDiscoveryItemHookComponent;
  let fixture: ComponentFixture<UbmCollectioDiscoveryItemHookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmCollectioDiscoveryItemHookComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmCollectioDiscoveryItemHookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
