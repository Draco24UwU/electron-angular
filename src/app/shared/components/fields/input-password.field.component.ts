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
import { FieldErrors, InputPasswordField } from "../../types/common.type";
import { VALID_PASSWORD } from "../../constants/validation-patterns.constant";
import { Password } from "primeng/password";

@Component({
  selector: "app-input-password-field",
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
        <p-password
          #password
          [feedback]="input.feedback || false"
          [toggleMask]="input.toggle || true"
          [fluid]="true"
          [pattern]="input.pattern || VALID_PASSWORD"
          [id]="input.name"
          [placeholder]="input.placeholder || ''"
          [formControlName]="input.name"
          size="small"
          appendTo="body"
          styleClass="[&>input]:font-arimo [&>input]:focus:outline-brand-yellow [&>input]:placeholder:text-brand-light-gray"
        />
      </ng-template>
    </div>
  `,
})
export class InputPasswordFieldComponent {
  private readonly _builder: FormBuilder = inject(FormBuilder);

  public VALID_PASSWORD: RegExp = VALID_PASSWORD;
  public $password: Signal<Password | undefined> = viewChild("password");
  public control: OutputEmitterRef<Password> = output();

  public $data: InputSignal<InputPasswordField> = input(
    {
      form: this._builder.group({ password: [""] }),
      name: "password",
    },
    { alias: "data" },
  );
  public errors: InputSignal<FieldErrors | null> = input<FieldErrors | null>(
    null,
  );

  constructor() {
    effect(() => {
      const password: Password | undefined = this.$password();

      password && this.control.emit(password);
    });
  }
}
