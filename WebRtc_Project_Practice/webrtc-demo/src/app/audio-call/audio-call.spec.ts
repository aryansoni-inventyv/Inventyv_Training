import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioCall } from './audio-call';

describe('AudioCall', () => {
  let component: AudioCall;
  let fixture: ComponentFixture<AudioCall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioCall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioCall);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
