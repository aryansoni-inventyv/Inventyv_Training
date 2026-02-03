import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Childcomponent } from './childcomponent';

describe('Childcomponent', () => {
  let component: Childcomponent;
  let fixture: ComponentFixture<Childcomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Childcomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Childcomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
