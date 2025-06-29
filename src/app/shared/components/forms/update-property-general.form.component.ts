import { Component, computed, inject, Signal } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { CheckboxField, DatePickerField, FieldErrors, InputNumberField, InputTextField, SelectDataField, TextareaField } from '../../types/common.type';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-update-property-general-form',
    standalone: false,
    template: `
        @let services = $services();
        @let fieldErrors = $fieldErrors();

        <form [formGroup]="form" class="w-full flex flex-col gap-3">
            <div class="flex gap-3 w-full flex-row">
                <app-select-data-field [data]="fieldType" class="w-full" />
            </div>
            <div class="flex gap-3 w-full flex-row">
                <app-select-data-field [data]="fieldStatus" class="w-full" />
                <app-select-data-field [data]="fieldDeed" class="w-full" />
            </div>
            <div class="flex gap-3 w-full flex-row">
                <app-date-picker-field [data]="fieldYear" class="w-full" />
                <app-input-text-field [data]="fieldDeedName" class="w-full" />
            </div>
            <div class="flex gap-3 w-full flex-row">
                <app-input-number-field
                    [data]="fieldValueAcquisition"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
                <app-input-number-field
                    [data]="fieldCurrentValue"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
            </div>
            <app-checkbox-field [data]="fieldRent" class="w-full" />
            <div class="flex gap-3 w-full flex-row">
                <app-textarea-field
                    [data]="fieldAmenities"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
                <app-textarea-field
                    [data]="fieldObservations"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
            </div>

            <div class="w-full flex flex-col">
                <p-message
                    severity="info"
                    styleClass="bg-blue-100 outline-none border-none"
                    icon="bx bx-info-circle text-blue-500"
                    >
                    <span class="text-xs font-arimo text-blue-500">
                        Para registrar un servició escribe su nombre y presiona ENTER
                    </span>
                </p-message>

                <div class="flex gap-3 mt-3 items-start">
                    <app-input-text-field
                        class="w-full"
                        [data]="fieldServices"
                        (control)="setServicesListener($event)"
                        />

                    <div class="flex w-full flex-wrap gap-2">
                        @for (service of services; track $index) {
                            <button
                                class="w-fit text-xs h-fit bg-slate-10 rounded-[1rem] text-slate-500 border-none py-1.5 px-2.5 flex gap-1.5 items-center transition-all hover:bg-slate-200 focus:bg-slate-200 cursor-pointer"
                                (click)="handleRemoveService($index)"
                                >
                                <span class="text-sm">{{ service }}</span>
                                <i class="bx bx-x-circle text-lg"></i>
                            </button>
                        }
                    </div>
                </div>
            </div>
        </form>
    `,
})
export class UpdatePropertyGeneralFormComponent {
    private readonly _builder: FormBuilder = inject(FormBuilder);
    private readonly _properties: PropertiesService = inject(PropertiesService);

    public form: FormGroup = this._properties.formsBuffer['updateProperty'].form;
    public $formChanges: Signal<any> = toSignal(this.form.valueChanges);
    public $fieldErrors: Signal<FieldErrors> = computed(() => {
        this.$formChanges();
        const control: Record<string, string[]> = {};
        const messages: Record<string, Record<string, string>> = this._properties.formsErrors['updateProperty'];

        for (const key in this.form.controls) {
            const errors: ValidationErrors | null = this.form.controls[key].errors;
            control[key] = !errors ? [] : Object.keys(errors);
        }

        return { messages, control };
    });
    public $servicesChanges: Signal<string[]> = toSignal(this.form.controls['servicios'].valueChanges);
    public $services: Signal<string[]> = computed(() => {
        const servicesChanges: string[] = this.$servicesChanges();
        const services: string[] = this.form.controls['servicios'].value;

        return servicesChanges ?? services ?? [];
    });
    public fieldType: SelectDataField = {
        form: this.form,
        name: 'tipo_propiedad',
        options: this._properties.statusField['type'],
        label: 'Tipo de propiedad',
        required: true,
    };
    public fieldAmenities: TextareaField = {
        form: this.form,
        name: 'amenidades',
        label: 'Amenidades',
        maxLength: 500,
        required: true,
    };
    public fieldRent: CheckboxField = {
        form: this.form,
        name: 'rentado',
        label: 'Rentado',
    };
    public fieldStatus: SelectDataField = {
        form: this.form,
        name: 'status_propiedad',
        options: this._properties.statusField['build'],
        label: 'Estado de la propiedad',
        required: true,
    };
    public fieldDeed: SelectDataField = {
        form: this.form,
        name: 'status_escritura',
        options: this._properties.statusField['deed'],
        label: 'Estado de las escrituras',
        required: true,
    };
    public fieldYear: DatePickerField = {
        form: this.form,
        name: 'anio_adquisicion',
        label: 'Año de adquisición',
        format: 'yy',
        view: 'year',
        required: true,
    };
    public fieldValueAcquisition: InputNumberField = {
        form: this.form,
        name: 'valor_adquisicion',
        label: 'Valor de adquisición',
        required: true,
        step: 100,
        mode: 'currency',
        min: 0,
        minFractionDigits: 2,
    };
    public fieldCurrentValue: InputNumberField = {
        form: this.form,
        name: 'valor_comercial_actual',
        label: 'Valor comercial actual',
        required: true,
        step: 100,
        mode: 'currency',
        min: 0,
        minFractionDigits: 2,
    };
    public fieldDeedName: InputTextField = {
        form: this.form,
        name: 'nombre_escritura',
        label: 'Nombre de la escritura',
        required: true,
    };
    public fieldObservations: TextareaField = {
        form: this.form,
        name: 'observaciones',
        label: 'Observaciones',
        maxLength: 500,
    };

    public fieldServices: InputTextField = {
        form: this._builder.group({ service: [''] }),
        name: 'service',
        label: 'Nombre del servicio',
    };

    constructor() {}

    public setServicesListener(control: HTMLInputElement): void {
        control.addEventListener('keypress', (event: KeyboardEvent) => {
            const { service } = this.fieldServices.form.controls;
            const value: string = service.value.trim();
            const previous: string[] = this.form.controls['servicios'].value;

            if (event.key !== 'Enter' || value === '') return;

            event.stopPropagation();
            event.preventDefault();

            if (previous?.includes(value)) return;

            this.form.patchValue({ servicios: [...(previous || []), value] });
            this.fieldServices.form.patchValue({ service: '' });
        });
    }

    public handleRemoveService(index: number): void {
        const previous: string[] = [...this.form.controls['servicios'].value];
        previous.splice(index, 1);

        this.form.patchValue({ servicios: previous });
    }
}
