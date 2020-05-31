export interface MonthDetails {
  monthName: string;
  monthIndex: number;
  monthStartDate: Date;
  monthEndDate: Date;
  noOfDays: number;
  isValid?: boolean;
}
export interface YearDetails {
  yearLabel: number;
  isLeapYear: boolean;
}

export enum ViewType {
  MONTH,
  YEAR
}

export interface Position {
  top: number;
  left: number;
}
