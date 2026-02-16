import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarComponent } from './car-component';

describe('CarComponent', () => {
  let component: CarComponent;
  let fixture: ComponentFixture<CarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
