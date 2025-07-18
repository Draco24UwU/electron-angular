import { Component, computed, inject, Signal } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { FormGroup, ValidationErrors } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FieldErrors,
  InputTextField,
  SelectDataField,
} from "../../types/common.type";

@Component({
  selector: "app-update-user-form",
  standalone: false,
  template: `
    @let loading = $loading();
    @let fieldErrors = $fieldErrors();

    <form class="flex flex-col gap-3" [formGroup]="form">
      <app-input-text-field
        [data]="fieldName"
        [errors]="fieldErrors"
        class="w-full"
      />
      <div class="w-full flex flex-row gap-3">
        <app-input-text-field
          [data]="fieldParentLasName"
          [errors]="fieldErrors"
          class="w-full"
        />
        <app-input-text-field
          [data]="fieldMotherLasName"
          [errors]="fieldErrors"
          class="w-full"
        />
      </div>
      <div class="w-full flex flex-row gap-3">
        <app-input-text-field
          [data]="fieldPhone"
          [errors]="fieldErrors"
          class="w-full"
        />
        <app-select-data-field [data]="fieldProfile" class="w-full" />
      </div>
      <div class="w-full flex flex-row gap-3">
        <app-input-text-field
          [data]="fieldEmail"
          [errors]="fieldErrors"
          class="w-full"
        />
        <app-select-data-field [data]="fieldStatus" class="w-full" />
      </div>

      <button
        pButton
        label="Actualizar usuario"
        class="bg-brand-dark-gray font-arimo border-none h-full hover:bg-brand-black focus:bg-brand-black transition-all text-xs ml-auto"
        [loading]="loading"
        (click)="handleUpdate()"
      ></button>
    </form>
  `,
})
export class UpdateUserFormComponent {
  private readonly _user: UsersService = inject(UsersService);
  private readonly _dialogRef: DynamicDialogRef = inject(DynamicDialogRef);

  public form: FormGroup = this._user.formsBuffer["editUser"].form;
  public $loading: Signal<boolean> = computed(() => this._user.state.loading());

  public $formChanges: Signal<any> = toSignal(this.form.valueChanges);
  public $fieldErrors: Signal<FieldErrors> = computed(() => {
    this.$formChanges();
    const control: Record<string, string[]> = {};
    const messages: Record<string, Record<string, string>> = this._user
      .formsErrors["editUser"];

    for (const key in this.form.controls) {
      const errors: ValidationErrors | null = this.form.controls[key].errors;
      control[key] = !errors ? [] : Object.keys(errors);
    }

    return { messages, control };
  });

  public fieldName: InputTextField = {
    form: this.form,
    name: "nombre",
    label: "Nombre (s)",
    type: "letters",
    required: true,
  };
  public fieldParentLasName: InputTextField = {
    form: this.form,
    name: "apellido_paterno",
    label: "Apellido paterno",
    type: "letters",
    required: true,
  };
  public fieldMotherLasName: InputTextField = {
    form: this.form,
    name: "apellido_materno",
    label: "Apellido materno",
    type: "letters",
    required: true,
  };
  public fieldPhone: InputTextField = {
    form: this.form,
    name: "telefono",
    label: "Teléfono",
    type: "numbers",
    required: true,
    minLength: 10,
    maxLength: 10,
  };
  public fieldProfile: SelectDataField = {
    form: this.form,
    name: "perfil",
    label: "Perfil",
    options: this._user.statusField["profile"],
    required: true,
  };
  public fieldEmail: InputTextField = {
    form: this.form,
    name: "email",
    label: "Correo",
    input: "email",
    required: true,
  };
  public fieldStatus: SelectDataField = {
    form: this.form,
    name: "status",
    label: "Estado",
    options: this._user.statusField["status"],
    required: true,
  };

  constructor() {}

  public handleUpdate(): void {
    !this.$loading() &&
      this._user.updateUser().then(() => this._dialogRef.close());
  }
}
