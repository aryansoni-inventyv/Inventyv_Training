import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelComponent } from './hotel-component';

describe('HotelComponent', () => {
  let component: HotelComponent;
  let fixture: ComponentFixture<HotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
