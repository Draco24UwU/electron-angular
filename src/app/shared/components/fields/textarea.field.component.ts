import {
  Component,
  computed,
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
import { FormBuilder } from "@angular/forms";
import { FieldErrors, TextareaField } from "../../types/common.type";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-textarea-field",
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
        <div class="relative">
          <textarea
            #textArea
            pTextarea
            [id]="input.name"
            [name]="input.name"
            [maxLength]="input.maxLength ?? null"
            [minLength]="input.minLength ?? null"
            [fluid]="true"
            [placeholder]="input.placeholder || ''"
            [formControlName]="input.name"
            [autoResize]="true"
            pSize="small"
            class="font-arimo focus:outline-brand-yellow placeholder:text-brand-light-gray min-h-24"
          ></textarea>

          @if (input.maxLength) {
            <small class="absolute bottom-2 right-2 text-xxs text-slate-400">
              {{ input.form.controls[input.name].value?.length || "0" }} /
              {{ input.maxLength }}
            </small>
          }
        </div>
      </ng-template>
    </div>
  `,
})
export class TextareaFieldComponent {
  private readonly _builder: FormBuilder = inject(FormBuilder);

  public $textArea: Signal<ElementRef<HTMLTextAreaElement> | undefined> =
    viewChild("textArea");
  public control: OutputEmitterRef<HTMLTextAreaElement> = output();

  public $data: InputSignal<TextareaField> = input(
    {
      form: this._builder.group({ textarea: [""] }),
      name: "textarea",
    },
    { alias: "data" },
  );
  public errors: InputSignal<FieldErrors | null> = input<FieldErrors | null>(
    null,
  );

  constructor() {
    effect(() => {
      const textArea: ElementRef<HTMLTextAreaElement> | undefined =
        this.$textArea();

      textArea && this.control.emit(textArea.nativeElement);
    });
  }
}
