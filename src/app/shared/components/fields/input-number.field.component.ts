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
import { FieldErrors, InputNumberField } from "../../types/common.type";
import { InputNumber } from "primeng/inputnumber";

@Component({
  selector: "app-input-number-field",
  standalone: false,
  template: `
    @let input = $data();
    @let err = errors();

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

      @if (err) {
        <app-form-control-errors
          [errorMessages]="err.messages[input.name]"
          [controlErrors]="err.control[input.name]"
        />
      }

      <ng-template #control>
        <p-inputnumber
          #inputNumber
          [fluid]="true"
          [inputId]="input.name"
          [name]="input.name"
          [placeholder]="input.placeholder || ''"
          [formControlName]="input.name"
          [useGrouping]="input.grouping || true"
          [buttonLayout]="input.buttonLayout || 'stacked'"
          [showButtons]="input.showButtons || false"
          [min]="input.min ?? null"
          [max]="input.max ?? null"
          [prefix]="input.prefix || ''"
          [suffix]="input.suffix || ''"
          [minFractionDigits]="input.minFractionDigits ?? null"
          [maxFractionDigits]="input.maxFractionDigits ?? null"
          [mode]="input.mode || 'decimal'"
          [currency]="
            input?.mode === 'currency' ? input.currency || 'MXN' : undefined
          "
          [step]="input.step ?? 1"
          [maxlength]="input.maxlength ?? null"
          [readonly]="input.readonly || false"
          [class]="
            input.direction === 'right' || !input.direction
              ? '[&>input]:text-right'
              : '[&>input]:text-left'
          "
          size="small"
          locale="es-MX"
        />
      </ng-template>
    </div>
  `,
})
export class InputNumberFieldComponent {
  private readonly _builder: FormBuilder = inject(FormBuilder);

  public $inputNumber: Signal<InputNumber | undefined> =
    viewChild("inputNumber");
  public control: OutputEmitterRef<InputNumber> = output();

  public $data: InputSignal<InputNumberField> = input(
    {
      form: this._builder.group({ number: [""] }),
      name: "number",
    },
    { alias: "data" },
  );
  public errors: InputSignal<FieldErrors | null> = input<FieldErrors | null>(
    null,
  );

  constructor() {
    effect(() => {
      const inputNumber: InputNumber | undefined = this.$inputNumber();

      inputNumber && this.control.emit(inputNumber);
    });
  }
}
