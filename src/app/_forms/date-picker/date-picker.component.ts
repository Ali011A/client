import { NgIf } from '@angular/common';
import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
@Component({
  selector: 'app-date-picker',
  imports: [ BsDatepickerModule,NgIf,ReactiveFormsModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent implements ControlValueAccessor {
 label = input<string>('');
  maxDate = input<Date>();
  bsConfig?: Partial<BsDatepickerConfig>;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;

    this.bsConfig = {
      containerClass: 'theme-red',
      dateInputFormat: 'DD MMMM YYYY'
    };
  }

  // Methods for ControlValueAccessor
  onChange: any = (value: Date | null) => {};
  onTouched: any = () => {};

  writeValue(obj: any): void {
    if (obj) {
      const date = new Date(obj);
      // إن كان التاريخ غير صالح، اضبطه كـ undefined
      this.dateValue = isNaN(date.getTime()) ? undefined : date;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // دعم تعطيل الحقل
  }

  dateValue: Date | undefined;

  onDateChange(date: Date): void {
  this.dateValue = date;
  this.onChange(date);
  this.onTouched();
}

}
