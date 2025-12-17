import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAlexComponent } from './test-alex.component';

describe('TestAlexComponent', () => {
  let component: TestAlexComponent;
  let fixture: ComponentFixture<TestAlexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAlexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestAlexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
