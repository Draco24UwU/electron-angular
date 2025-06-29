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
import { CheckboxField } from "../../types/common.type";
import { Checkbox } from "primeng/checkbox";

@Component({
  selector: "app-checkbox-field",
  standalone: false,
  template: `
    @let input = $data();

    <div
      class="w-full flex flex-row items-cetner gap-1"
      [formGroup]="input.form"
    >
      @if (!input.label) {
        <ng-container *ngTemplateOutlet="control" />
      } @else {
        <ng-container *ngTemplateOutlet="control" />
        <label
          [for]="input.name"
          class="font-arimo cursor-pointer text-sm ml-1"
        >
          {{ input.label }}
          @if (input.required) {
            <span class="text-red-500">*</span>
          }
        </label>
      }

      <ng-template #control>
        <p-checkbox
          #checkBox
          [inputId]="input.name"
          [name]="input.name"
          [binary]="input.binary || true"
          [value]="input.value ?? null"
          [formControlName]="input.name"
          size="small"
        />
      </ng-template>
    </div>
  `,
})
export class CheckboxFieldComponent {
  private readonly _builder: FormBuilder = inject(FormBuilder);

  public $checkBox: Signal<Checkbox | undefined> = viewChild("checkBox");
  public control: OutputEmitterRef<Checkbox> = output();

  public $data: InputSignal<CheckboxField> = input(
    {
      form: this._builder.group({ check: [false] }),
      name: "check",
    },
    { alias: "data" },
  );

  constructor() {
    effect(() => {
      const checkBox: Checkbox | undefined = this.$checkBox();

      checkBox && this.control.emit(checkBox);
    });
  }
}
