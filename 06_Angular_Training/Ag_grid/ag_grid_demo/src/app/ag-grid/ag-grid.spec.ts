import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGrid } from './ag-grid';

describe('AgGrid', () => {
  let component: AgGrid;
  let fixture: ComponentFixture<AgGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
