import { TestBed } from '@angular/core/testing';

import { VicMonthpickerService } from './vic-monthpicker.service';

describe('VicMonthpickerService', () => {
  let service: VicMonthpickerService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [VicMonthpickerService]
  }));
  beforeEach(() => {
    service = TestBed.get(VicMonthpickerService);
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('setMonths: should set 12 months', () => {
    service.setMonths(2020);
    expect(service.monthList.length).toEqual(12);
  });
  it('setDates: should set 12 months', () => {
    service.setYears(2020);
    expect(service.yearList.length).toEqual(20);
  });
});
