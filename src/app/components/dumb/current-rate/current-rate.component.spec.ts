import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentRateComponent } from './current-rate.component';

describe('CurrentRateComponent', () => {
  let component: CurrentRateComponent;
  let fixture: ComponentFixture<CurrentRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
