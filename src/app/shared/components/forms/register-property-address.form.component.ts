import { Component, computed, inject, Signal } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { PropertiesService } from '../../services/properties.service';
import { FieldErrors, FormBuffer, InputTextField } from '../../types/common.type';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-register-property-address-form',
    standalone: false,
    template: `
        @let fieldErrors = $fieldErrors();

        <h2 class="mt-0 text-base text-slate-500">Dirección de la propiedad</h2>

        <form [formGroup]="form" class="w-full flex flex-col gap-3">
            <div class="flex gap-3 w-full flex-row">
                <app-input-text-field
                    [data]="fieldState"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
                <app-input-text-field
                    [data]="fieldCity"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
            </div>
            <div class="flex gap-3 w-full flex-row">
                <app-input-text-field [data]="fieldColony" class="w-full" />
                <app-input-text-field [data]="fieldStreet" class="w-full" />
            </div>
            <div class="flex gap-3 w-full flex-row">
                <app-input-text-field [data]="fieldExtNumber" class="w-full" />
                <app-input-text-field
                    [data]="fieldPostalCode"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
            </div>

            <div class="flex flex-row-reverse items-center justify-start w-full gap-2">
                <button
                    pButton
                    label="Siguiente"
                    class="bg-brand-dark-gray hover:bg-brand-black focus:bg-brand-black border-none w-fit px-5 text-xs"
                    (click)="handleNext()"
                    >
                </button>
                <button
                    pButton
                    label="Anterior"
                    severity="secondary"
                    class="border-none w-fit px-5 text-xs"
                    (click)="handlePrevious()"
                    >
                </button>
            </div>
        </form>
    `,
})
export class RegisterPropertyAddressFormComponent {
    private readonly _properties: PropertiesService = inject(PropertiesService);
    public form: FormGroup = (this._properties.formsBuffer['registerProperty']['direccion'] as FormBuffer).form;
    public $formChanges: Signal<any> = toSignal(this.form.valueChanges);
    public $fieldErrors: Signal<FieldErrors> = computed(() => {
        this.$formChanges();
        const control: Record<string, string[]> = {};
        const messages: Record<string, Record<string, string>> = this._properties.formsErrors['registerProperty'];

        for (const key in this.form.controls) {
            const errors: ValidationErrors | null = this.form.controls[key].errors;
            control[key] = !errors ? [] : Object.keys(errors);
        }

        return { messages, control };
    });

    public fieldState: InputTextField = {
        form: this.form,
        name: 'estado',
        label: 'Estado',
        required: true,
        type: 'letters',
    };
    public fieldCity: InputTextField = {
        form: this.form,
        name: 'municio',
        label: 'Municipio',
        required: true,
        type: 'letters',
    };
    public fieldColony: InputTextField = {
        form: this.form,
        name: 'colonia',
        label: 'Colonia',
        required: true,
    };
    public fieldStreet: InputTextField = {
        form: this.form,
        name: 'calle',
        label: 'Calle',
        required: true,
    };
    public fieldExtNumber: InputTextField = {
        form: this.form,
        name: 'numero_exterior',
        label: 'Número exterior',
        required: true,
    };
    public fieldPostalCode: InputTextField = {
        form: this.form,
        name: 'codigo_postal',
        label: 'Código postal',
        required: true,
        minLength: 5,
        maxLength: 5,
        type: 'numbers',
    };

    constructor() {}

    public handlePrevious(): void {
        this._properties.formPreviousStep();
    }

    public handleNext(): void {
        this._properties.formNextStep();
    }
}
