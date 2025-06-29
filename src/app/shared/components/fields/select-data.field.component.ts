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
import { DropdownItem, SelectDataField } from "../../types/common.type";
import { Select } from "primeng/select";

@Component({
  selector: "app-select-data-field",
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
        <p-select
          #select
          optionLabel="label"
          optionValue="value"
          appendTo="body"
          class="[&>.p-placeholder]:text-brand-light-gray"
          styleClass="font-arimo"
          [fluid]="true"
          [id]="input.name"
          [name]="input.name"
          [placeholder]="input.placeholder || ''"
          [formControlName]="input.name"
          [options]="input.options"
          [showClear]="input.clear || false"
          size="small"
        />
      </ng-template>
    </div>
  `,
})
export class SelectDataFieldComponent {
  private readonly _builder: FormBuilder = inject(FormBuilder);

  public $select: Signal<Select | undefined> = viewChild("select");
  public control: OutputEmitterRef<Select> = output();

  public $data: InputSignal<SelectDataField> = input(
    {
      form: this._builder.group({ selector: [null] }),
      name: "selector",
      options: [] as DropdownItem<string | number>[],
    },
    { alias: "data" },
  );

  constructor() {
    effect(() => {
      const select: Select | undefined = this.$select();

      select && this.control.emit(select);
    });
  }
}
