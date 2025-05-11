import { Component, inject } from "@angular/core";
import { UsersService } from "../../services/users.service";
import { FormGroup } from "@angular/forms";
import {
  DropdownItem,
  InputTextField,
  SelectDataField,
} from "../../types/common.type";

@Component({
  selector: "app-users-filters-form",
  standalone: false,
  template: `
    <form class="flex items-stretch gap-2" [formGroup]="form">
      <div class="w-52">
        <app-input-text-field [data]="fieldSearch" />
      </div>
      <button
        pButton
        icon="bx bx-search text-sm"
        class="bg-brand-dark-gray font-arimo border-none hover:bg-brand-black focus:bg-brand-black transition-all px-2.5 h-auto w-fit"
      ></button>
      <button
        pButton
        icon="bx bx-x text-sm"
        class="border-none disabled:bg-brand-light-gray transition-all px-2.5 h-auto w-fit"
        severity="danger"
        [disabled]="!search"
        (click)="clearSearch()"
      ></button>

      <div class="w-48">
        <app-select-data-field [data]="fieldProfile" />
      </div>

      <div class="w-48">
        <app-select-data-field [data]="fieldStatus" />
      </div>
    </form>
  `,
})
export class UsersFiltersFormComponent {
  private readonly _users: UsersService = inject(UsersService);

  public form: FormGroup = this._users.state.filters();

  public fieldSearch: InputTextField = {
    form: this.form,
    name: "search",
    placeholder: "Buscar...",
  };
  public fieldProfile: SelectDataField = {
    form: this.form,
    name: "profile",
    clear: true,
    placeholder: "Perfil...",
    options: this._users.statusField["profile"],
  };
  public fieldStatus: SelectDataField = {
    form: this.form,
    name: "status",
    clear: true,
    placeholder: "Estado...",
    options: this._users.statusField["status"],
  };

  constructor() {}

  public get search(): string {
    return this.form.controls["search"].value;
  }

  public clearSearch(): void {
    this.form.patchValue({ search: "" });
  }
}
