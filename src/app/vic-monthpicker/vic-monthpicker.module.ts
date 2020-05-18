import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VicMonthPickerComponent } from './vic-monthpicker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VicMonthpickerService } from './vic-monthpicker.service';
import { ClickOutsideDirective } from './clickOutside';


@NgModule({
  declarations: [
    VicMonthPickerComponent,
    ClickOutsideDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ VicMonthPickerComponent, ClickOutsideDirective ],
  providers: [ VicMonthpickerService ]
})
export class VicMonthPickerModule { }
