import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbmHomepageActuComponent } from './ubm-homepage-actu.component';

describe('UbmHomepageActuComponent', () => {
  let component: UbmHomepageActuComponent;
  let fixture: ComponentFixture<UbmHomepageActuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UbmHomepageActuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UbmHomepageActuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
