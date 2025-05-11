import { Component, inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { PropertiesService } from "../../services/properties.service";
import { InputTextField, SelectDataField } from "../../types/common.type";

@Component({
  selector: "app-properties-filters-form",
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
        <app-select-data-field [data]="fieldType" />
      </div>

      <div class="w-48">
        <app-select-data-field [data]="fieldStatus" />
      </div>

      <div class="w-48">
        <app-select-data-field [data]="fieldDeed" />
      </div>
    </form>
  `,
})
export class PropertiesFiltersFormComponent {
  private readonly _properties: PropertiesService = inject(PropertiesService);
  public form: FormGroup = this._properties.state.filters();

  public fieldSearch: InputTextField = {
    form: this.form,
    name: "search",
    placeholder: "Buscar...",
  };
  public fieldType: SelectDataField = {
    form: this.form,
    name: "type",
    clear: true,
    placeholder: "Tipo de propiedad...",
    options: this._properties.statusField["type"],
  };
  public fieldStatus: SelectDataField = {
    form: this.form,
    name: "status",
    clear: true,
    placeholder: "Estado...",
    options: this._properties.statusField["build"],
  };
  public fieldDeed: SelectDataField = {
    form: this.form,
    name: "deed",
    clear: true,
    placeholder: "Estado de la escritura...",
    options: this._properties.statusField["deed"],
  };

  constructor() {}

  public get search(): string {
    return this.form.controls["search"].value;
  }

  public clearSearch(): void {
    this.form.patchValue({ search: "" });
  }
}
