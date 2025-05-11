import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  Signal,
  viewChild,
} from "@angular/core";
import { FieldErrors, InputTextField } from "../../types/common.type";
import { FormBuilder } from "@angular/forms";

@Component({
  selector: "app-input-text-field",
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
        <input
          #inputText
          pInputText
          appInputTransform
          [id]="input.name"
          [name]="input.name"
          [type]="input.input || 'text'"
          [maxlength]="input.maxLength ?? null"
          [minlength]="input.minLength ?? null"
          [placeholder]="input.placeholder || ''"
          [fluid]="true"
          [formControlName]="input.name"
          [form]="input.form"
          [control]="input.name"
          [transform]="input.type || ''"
          [readOnly]="input.readonly || false"
          pSize="small"
          class="font-arimo focus:outline-brand-yellow placeholder:text-brand-light-gray"
        />
      </ng-template>
    </div>
  `,
})
export class InputTextFieldComponent {
  private readonly _builder: FormBuilder = inject(FormBuilder);

  public $inputText: Signal<ElementRef<HTMLInputElement> | undefined> =
    viewChild("inputText");
  public control: OutputEmitterRef<HTMLInputElement> = output();

  public $data: InputSignal<InputTextField> = input(
    {
      form: this._builder.group({ text: [""] }),
      name: "text",
    },
    { alias: "data" },
  );
  public errors: InputSignal<FieldErrors | null> = input<FieldErrors | null>(
    null,
  );

  constructor() {
    effect(() => {
      const inputText: ElementRef<HTMLInputElement> | undefined =
        this.$inputText();

      inputText && this.control.emit(inputText.nativeElement);
    });
  }
}
