import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  viewChild,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { DatePickerField } from "../../types/common.type";
import { DatePicker } from "primeng/datepicker";

@Component({
  selector: "app-date-picker-field",
  standalone: false,
  template: `
    @let input = $data();

    <div class="w-full flex flex-col gap-1" [formGroup]="input.form">
      @if (!input.label) {
        <ng-container *ngTemplateOutlet="control" />
      } @else {
        <p-iftalabel class="w-full">
          <ng-container *ngTemplateOutlet="control" />
          <label
            [for]="input.name"
            class="font-arimo text-brand-light-gray text-xxs"
          >
            {{ input.label }}
            @if (input.required) {
              <span class="text-red-500">*</span>
            }
          </label>
        </p-iftalabel>
      }

      <ng-template #control>
        <p-datepicker
          #datePicker
          appendTo="body"
          [id]="input.name"
          [name]="input.name"
          [showClear]="input.clear || false"
          [dateFormat]="input.format || 'd-M-yy'"
          [readonlyInput]="input.onlyInput || true"
          [minDate]="input.min || null"
          [maxDate]="input.max || null"
          [inline]="input.inline || false"
          [selectionMode]="input.mode || 'single'"
          [disabledDays]="input.disableDays || []"
          [disabledDates]="input.disableDates || []"
          [showWeek]="input.showWeek || false"
          [view]="input.view || 'date'"
          [fluid]="true"
          [placeholder]="input.placeholder || ''"
          [formControlName]="input.name"
          size="small"
        />
      </ng-template>
    </div>
  `,
})
export class DatePickerFieldComponent {
  private readonly _builder: FormBuilder = inject(FormBuilder);

  public $datePicker: Signal<DatePicker | undefined> = viewChild("datePicker");
  public control: OutputEmitterRef<DatePicker> = output();

  public $data: InputSignal<DatePickerField> = input(
    {
      form: this._builder.group({ date: [null] }),
      name: "date",
    },
    { alias: "data" },
  );

  constructor() {
    effect(() => {
      const datePicker: DatePicker | undefined = this.$datePicker();

      datePicker && this.control.emit(datePicker);
    });
  }
}
