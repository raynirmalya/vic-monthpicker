import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VicMonthPickerComponent } from './vic-monthpicker.component';
import { VicMonthpickerService } from './vic-monthpicker.service';
import { ClickOutsideDirective } from './clickOutside';
import { FormsModule, ReactiveFormsModule, NgControl, FormControl } from '@angular/forms';
import * as moment from 'moment-timezone';
fdescribe('VicMonthpickerComponent', () => {
  let component: VicMonthPickerComponent;
  let fixture: ComponentFixture<VicMonthPickerComponent>;

  beforeEach(async(() => {
    const NG_CONTROL_PROVIDER = {
      provide: NgControl,
      useClass: class extends NgControl {
        control = new FormControl();
        // tslint:disable-next-line: no-empty
        viewToModelUpdate() {}
      },
    };

    TestBed.configureTestingModule({
      declarations: [ VicMonthPickerComponent, ClickOutsideDirective ],
      imports: [FormsModule, ReactiveFormsModule],
      providers: [VicMonthpickerService]
    })
    .overrideComponent(VicMonthPickerComponent, {
      add: { providers: [NG_CONTROL_PROVIDER] },
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VicMonthPickerComponent);
    (fixture.componentInstance as any).ngControl = new FormControl();
    component = fixture.componentInstance;
    component.maxDate = '06/06/2021';
    component['setMaxMonthYear']();
    component['setDefault']();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('formatDate: should return date in MM/YYYY format', () => {
    const res = component.formatDate(new Date());
    expect(res).toBe(moment(new Date()).format('MM/YYYY'));
    component.dateFormat = 'MM/YYYY';
    const res1 = component.formatDate(new Date());
    expect(res1).toBe(moment(new Date()).format('MM/YYYY'));
  });

  it('writeValue: should set Date', () => {
    component.writeValue(new Date());
    expect(component.date).toBe(moment(new Date()).format('MM/YYYY'));
  });

  it('registerOnChange: should set onChange', () => {
    component.registerOnChange({});
    expect(component.onChange).toEqual({});
  });
  it('registerOnTouched: should set onTouched', () => {
    component.registerOnTouched({});
    expect(component.onTouched).toEqual({});
  });
  it('setDisabledState: should set isDisabled', () => {
    component.setDisabledState(true);
    expect(component.isDisabled).toBeTruthy();
    component.setDisabledState(false);
    expect(component.isDisabled).toBeFalsy();
  });
  it('onModelChange: should set isValid', () => {
    component.date = '05/2020';
    component.onModelChange();
    expect(component.isValid).toBeTruthy();
    component.date = '0A5/2020';
    component.onModelChange();
    expect(component.isValid).toBeFalsy();
  });
  it('checkAlphabetPresent: should check alphabet present', () => {
    component.date = '05/2020';
    component['checkAlphabetPresent']();
    expect(component.isValid).toBeTruthy();
  });
  it('validateDate: should validate properly', () => {
    component.date = '05/2020';
    component['validateDate']();
    expect(component.isValid).toBeTruthy();
  });
  it('onBlur: should set isValid', () => {
    component.date = '05/2020';
    component.onBlur();
    expect(component.isValid).toBeTruthy();
  });
  it('setToMaxDate: should set maxDate', () => {
    component.maxDate = '06/06/2021';
    component.date = '07/2022';
    component['maxMonth'] = 6;
    component['maxYear'] = 2021;
    component['setToMaxDate']();
    expect(component.date).toEqual('06/2021');
  });
  it('onFocus: should show picker', () => {
    component.showPicker = false;
    component.onFocus();
    expect(component.showPicker).toBeFalsy();
  });

  it('prev: should set previous month', () => {
    component.currentYear = 2020;
    component.prev();
    expect(component.currentYear).toEqual(2019);
  });
  it('next: should set next month', () => {
    component.currentYear = 2019;
    component.next();
    expect(component.currentYear).toEqual(2020);
  });
  it('prevYearRange: should set prev 20 years', () => {
    component['vicMonthpickerService'].rangeYear = [2000, 2020];
    component.prevYearRange();
    expect(component['vicMonthpickerService'].rangeYear).toEqual([1980, 2000]);
  });
  it('nextYearRange: should set next 20 years', () => {
    component['vicMonthpickerService'].rangeYear = [2000, 2020];
    component.nextYearRange();
    expect(component['vicMonthpickerService'].rangeYear).toEqual([2020, 2040]);
  });
  it('changeToYearView: should set currentViewType to year', () => {
    component.changeToYearView();
    expect(component.currentViewType).toEqual(1);
  });
  it('selectMonth: should set date', () => {
    component['vicMonthpickerService'].setMonths(2020);
    component.selectMonth(0);
    expect(component.isValid).toBeTruthy();
    component['vicMonthpickerService'].setMonths(2020);
    component.currentYear = 2020;
    component['maxMonth'] = 6;
    component['maxYear'] = 2019;
    const res = component.selectMonth(0);
    expect(res).toBeFalsy();
  });
  it('isMonthDisabled: should return month disabled or not', () => {
    component['vicMonthpickerService'].setMonths(2020);
    component.currentYear = 2020;
    component['maxMonth'] = 6;
    component['maxYear'] = 2019;
    const res = component.isMonthDisabled(0);
    expect(res).toBeTruthy();
    component.currentYear = 2020;
    component['maxMonth'] = 6;
    component['maxYear'] = 2020;
    const res1 = component.isMonthDisabled(0);
    expect(res1).toBeFalsy();
  });
  it('isYearDisabled: should return year disabled or not', () => {
    component['maxYear'] = 2019;
    component['vicMonthpickerService'].setYears(2020);
    const res = component.isYearDisabled(0);
    expect(res).toBeFalsy();
  });
  it('isSelectedMonth: should return selected month or not', () => {
    component['maxYear'] = 2020;
    component.currentYear = 2020;
    component['maxMonth'] = 0;
    component['vicMonthpickerService'].setMonths(2020);
    const res = component.isSelectedMonth(0);
    expect(res).toBeTruthy();
  });
  it('selectYear: should set currentViewType to month', () => {
    component['vicMonthpickerService'].setYears(2020);
    component.selectYear(0);
    expect(component.currentViewType).toEqual(0);
    component['maxYear'] = 1999;
    component['vicMonthpickerService'].setYears(2020);
    const res = component.selectYear(0);
    expect(res).toBeFalsy();
  });
  it('closeMonthPicker: should close picker', () => {
    component.closeMonthPicker();
    expect(component.showPicker).toBeFalsy();
  });

  it('onChange: should not return', () => {
    const ret = component.onChange(null);
    expect(ret).toBeUndefined();
  });
  it('onTouched: should not return', () => {
    const ret = component.onTouched();
    expect(ret).toBeUndefined();
  });
});
