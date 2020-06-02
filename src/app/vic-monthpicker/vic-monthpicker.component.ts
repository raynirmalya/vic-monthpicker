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
export class VicMonthPickerComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', {static: true}) input: ElementRef;
  @Input() label: string;
  @Input() isDisabled = false;
  @Input() placeholder: string;
  @Input() isRequired = false;
  @Input() pattern: string = null;
  @Input() errorMsg: string;
  @Input() dateFormat: string;
  @Input() maxDate: string;
  @Output() monthYearChange: EventEmitter<MonthDetails> = new EventEmitter<MonthDetails>();
  @Output() validationCheck: EventEmitter<boolean> = new EventEmitter<boolean>();
  viewTypes = ViewType;
  currentViewType: number;
  currentYear: number = null;
  currentMonth: number = null;
  year: number = null;
  month: number = null;
  public showPicker: boolean;
  public datePickerPosition: Position = {} as Position;
  public date: string;
  public isValid = true;
  private maxMonth: number;
  private maxYear: number;
  constructor(@Self() public controlDir: NgControl, private vicMonthpickerService: VicMonthpickerService) {
    this.controlDir.valueAccessor = this;
  }


  ngOnInit() {
    this.setDefault();
  }

  private setDefault() {
    this.currentViewType = this.viewTypes.MONTH;
    const todayDate = new Date();
    this.year = todayDate.getFullYear();
    this.month = todayDate.getMonth();
  }

  formatDate(obj: any): string {
    return moment(obj).format(this.dateFormat ? this.dateFormat : 'MM/YYYY');
  }
  writeValue(obj: any): void {
    if (obj !== undefined && obj !== null) {
      this.input.nativeElement.value = this.formatDate(obj);
      this.setMaxMonthYear();
      this.date = this.input.nativeElement.value;
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
  private setMaxMonthYear() {
    const maxDate = new Date(this.maxDate);
    this.maxMonth = maxDate.getMonth();
    this.maxYear = maxDate.getFullYear();
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  onChange(event) { }

  onTouched() {
  }
  onModelChange() {
    this.isValid = this.validateDate();
    this.validationCheck.emit(this.isValid);
  }
  private checkAlphabetPresent(): boolean {
    const pattrn = new RegExp('^[0-9/]+$');
    return pattrn.test(this.date);
  }
  private validateDate(): boolean {
    let isValid = true;
    if (!this.checkAlphabetPresent() || this.date.length !== 7 ) {
      isValid = false;
    }
    return isValid;
  }
  public onBlur() {
    this.setToMaxDate();
    this.isValid = this.validateDate();
    this.validationCheck.emit(this.isValid);
  }
  private setToMaxDate() {
    const dateArr = this.date.split('/');
    if(+dateArr[0] >= this.maxMonth + 1 && +dateArr[1] >= this.maxYear) {
      this.date = this.formatDate(this.maxDate);
    }
  }
  onFocus() {
    setTimeout(() => {
      this.setDefault();
      this.setPosition();
      this.showPicker = true;
    }, 200);

  }

  public setPosition(): void {
    // console.log(this.input.nativeElement, this.input.nativeElement.offsetTop, this.input.nativeElement.offsetLeft,
    //   this.input.nativeElement.offsetHeight);
    this.datePickerPosition.top = -324; // this.input.nativeElement.offsetTop + this.input.nativeElement.offsetHeight;
    this.datePickerPosition.left = 0; // this.input.nativeElement.offsetLeft;
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
    this.showPicker = false;
    this.input.nativeElement.value = this.formatDate(this.vicMonthpickerService.monthList[i].monthEndDate);
    this.date = this.input.nativeElement.value;
    this.isValid = this.validateDate();
    this.validationCheck.emit(this.isValid);
    this.vicMonthpickerService.monthList[i].isValid = this.isValid;
    this.monthYearChange.emit(this.vicMonthpickerService.monthList[i]);
  }
  public isMonthDisabled(i: number): boolean {
    if (this.currentYear < this.maxYear) {
       return false;
    } else if ( this.currentYear === this.maxYear && this.vicMonthpickerService.monthList[i].monthIndex <= this.maxMonth ) {
      return false;
    } else {
      return true;
    }
  }
  public isYearDisabled(i: number) {
    return this.vicMonthpickerService.yearList[i].yearLabel > this.maxYear;
  }
  public isSelectedMonth(i: number): boolean {
    return (this.maxMonth) === this.vicMonthpickerService.monthList[i].monthIndex
     && this.maxYear === this.currentYear;
  }
  public selectYear(i: number): void {
    if (this.isYearDisabled(i)) {
      return;
    }
    this.currentYear = this.vicMonthpickerService.yearList[i].yearLabel;
    this.currentViewType = this.viewTypes.MONTH;
    this.vicMonthpickerService.setMonths(this.currentYear);
  }
  public closeMonthPicker() {
    this.showPicker = false;
  }
}
