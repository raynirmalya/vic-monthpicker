import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VicMonthpickerComponent } from './vic-monthpicker.component';

describe('VicMonthpickerComponent', () => {
  let component: VicMonthpickerComponent;
  let fixture: ComponentFixture<VicMonthpickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VicMonthpickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VicMonthpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
