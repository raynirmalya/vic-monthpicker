import { Component, OnInit, ViewChild, ElementRef, Input, Self, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, Validator, AbstractControl, ValidationErrors, ValidatorFn, Validators, NgControl } from '@angular/forms';
import * as moment from 'moment-timezone';
import { VicMonthpickerService } from './vic-monthpicker.service';
import { ViewType, Position, MonthDetails } from './vic-monthpicker.model';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'vic-monthpicker',
  templateUrl: './vic-monthpicker.component.html',
  styleUrls: ['./vic-monthpicker.component.css'],
})
export class VicMonthPickerComponent implements OnInit, ControlValueAccessor, OnChanges {  // Validator
  @ViewChild('input', {static: true}) input: ElementRef;
  @Input() isDisabled = false;
  @Input() placeholder: string;
  @Input() isRequired = false;
  @Input() pattern: string = null;
  @Input() errorMsg: string;
  @Input() dateFormat: string;
  @Input() maxDate: string;
  @Output() monthYearChange: EventEmitter<MonthDetails> = new EventEmitter<MonthDetails>();
  viewTypes = ViewType;
  currentViewType: number;
  currentYear: number = null;
  currentMonth: number = null;
  year: number = null;
  month: number = null;
  public showPicker: boolean;
  public datePickerPosition: Position = {} as Position;
  constructor(@Self() public controlDir: NgControl, private vicMonthpickerService: VicMonthpickerService) {
    this.controlDir.valueAccessor = this;
  }


  ngOnInit() {
    this.setDefault();
    // this.setValidation();
  }

  private setDefault() {
    this.currentViewType = this.viewTypes.MONTH;
    const todayDate = new Date();
    this.year = todayDate.getFullYear();
    this.month = todayDate.getMonth();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && !changes.data.firstChange) {
        // if (this.settings.groupBy) {
        //     this.groupedData = this.transformData(this.data, this.settings.groupBy);
        //     if (this.data.length === 0) {
        //         this.selectedItems = [];
        //     }
        // }
        // this.writeValue(this.v);
    }
}
  // private setValidation() {
  //   const control = this.controlDir.control;
  //   const validators: ValidatorFn[] = control.validator ? [control.validator] : [];
  //   if (this.isRequired) {
  //     validators.push(Validators.required);
  //   }
  //   if (this.pattern) {
  //     validators.push(Validators.pattern(this.pattern));
  //   }

  //   control.setValidators(validators);
  //   control.updateValueAndValidity();
  // }

  // validate(c: AbstractControl): ValidationErrors {
  //   const validators: ValidatorFn[] = [];
  //   if (this.isRequired) {
  //     validators.push(Validators.required);
  //   }
  //   if (this.pattern) {
  //     validators.push(Validators.pattern(this.pattern));
  //   }

  //   return validators;
  // }

  formatDate(obj: any): string {
    return moment(obj).format(this.dateFormat ? this.dateFormat : 'MM/YYYY');
  }
  writeValue(obj: any): void {
    if (obj !== undefined && obj !== null) {
      this.input.nativeElement.value = this.formatDate(obj);
      const dateArr: string = this.input.nativeElement.value.split('/');
      this.currentYear = +dateArr[1];
      this.currentMonth = +dateArr[0];
      this.vicMonthpickerService.setMonths(this.currentYear);
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  onChange(event) { }

  onTouched() {
  }
  onFocus() {
    setTimeout(() => {
      this.setDefault();
      this.setPosition();
      this.showPicker = true;
    }, 200);

  }

  public setPosition(): void {
    console.log(this.input.nativeElement, this.input.nativeElement.offsetTop, this.input.nativeElement.offsetLeft,
      this.input.nativeElement.offsetHeight);
    this.datePickerPosition.top = this.input.nativeElement.offsetTop + this.input.nativeElement.offsetHeight;
    this.datePickerPosition.left =  this.input.nativeElement.offsetLeft;
  }

  prev() {
    this.currentYear--;
    this.vicMonthpickerService.setMonths(this.currentYear);
  }
  next() {
    this.currentYear++;
    this.vicMonthpickerService.setMonths(this.currentYear);
  }
  prevYearRange() {
    this.vicMonthpickerService.rangeYear[0] = this.vicMonthpickerService.rangeYear[0] - 20;
    this.vicMonthpickerService.rangeYear[1] = this.vicMonthpickerService.rangeYear[1] - 20;
    this.vicMonthpickerService.setYears(null);
  }
  nextYearRange() {
    this.vicMonthpickerService.rangeYear[0] = this.vicMonthpickerService.rangeYear[0] + 20;
    this.vicMonthpickerService.rangeYear[1] = this.vicMonthpickerService.rangeYear[1] + 20;
    this.vicMonthpickerService.setYears(null);
  }
  public changeToYearView() {
    this.showPicker = true;
    this.currentViewType = this.viewTypes.YEAR;
    this.vicMonthpickerService.setYears(this.currentYear);
  }
  public selectMonth(i: number): void {
    if (this.isMonthDisabled(i)) {
      return;
    }
    // console.log(this.vicMonthpickerService.monthList[i], i,
    //   moment(this.vicMonthpickerService.monthList[i].monthEndDate).format('YYYY-MM-DD'));
    this.showPicker = false;
    this.input.nativeElement.value = this.formatDate(this.vicMonthpickerService.monthList[i].monthEndDate);
    this.monthYearChange.emit(this.vicMonthpickerService.monthList[i]);
  }
  public isMonthDisabled(i: number): boolean {
    const maxDate = new Date(this.maxDate);
    const maxMonth = maxDate.getMonth();
    const maxYear = maxDate.getFullYear();
  //  console.log(maxMonth, maxYear, this.vicMonthpickerService.monthList[i].monthIndex);
    if (this.currentYear < maxYear) {
       return false;
    } else if ( this.currentYear === maxYear && this.vicMonthpickerService.monthList[i].monthIndex <= maxMonth - 1 ) {
      return false;
    } else {
      return true;
    }
  }
  public isSelectedMonth(i: number): boolean {
    const dateArr: string = this.input.nativeElement.value.split('/');
    const currentYear = +dateArr[1];
    const currentMonth = +dateArr[0];
    return (currentMonth - 1) === this.vicMonthpickerService.monthList[i].monthIndex
     && currentYear === this.currentYear;
  }
  public selectYear(i: number): void {
    this.currentYear = this.vicMonthpickerService.yearList[i].yearLabel;
    this.currentViewType = this.viewTypes.MONTH;
    this.vicMonthpickerService.setMonths(this.currentYear);
  }
  public closeMonthPicker() {
    this.showPicker = false;
  }
}
