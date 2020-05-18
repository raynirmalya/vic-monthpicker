import { TestBed } from '@angular/core/testing';

import { VicMonthpickerService } from './vic-monthpicker.service';

describe('VicMonthpickerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VicMonthpickerService = TestBed.get(VicMonthpickerService);
    expect(service).toBeTruthy();
  });
});
