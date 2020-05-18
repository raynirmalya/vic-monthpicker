import { Injectable } from '@angular/core';
import { MonthDetails, YearDetails } from './vic-monthpicker.model';

@Injectable()
export class VicMonthpickerService {
  monthNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthList: MonthDetails[] = [];
  yearList: YearDetails[] = [];
  rangeYear: number[] = [];
  constructor() { }

  setMonths(year: number) {
    this.monthList = [];
    this.monthNames.forEach((item, month) => {
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);
      const monthLength = (+monthEnd - +monthStart) / (1000 * 60 * 60 * 24);
      this.monthList.push({monthStartDate: monthStart, monthEndDate: monthEnd,
         noOfDays: monthLength, monthIndex: month, monthName: item.toUpperCase() });
    });
  }
  setYears(year: number) {
    if (year) {
      this.rangeYear = this.getRangeOfYears(year);
    }
    if (this.rangeYear.length > 0) {
      this.yearList = [];
      for ( let yr = this.rangeYear[0] + 1; yr <= this.rangeYear[1]; yr++) {
        this.yearList.push({isLeapYear: this.isLeapYear(year), yearLabel: yr})
      }
    }
  }
  getRangeOfYears(year: number): number[] {
    const remainder = year % 20;
    const startYear = year - (20 - remainder);
    const endYear = year + remainder;
    return [startYear, endYear];
  }
  isLeapYear(year: number): boolean {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }
}
