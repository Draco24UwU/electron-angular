import { Component, computed, inject, Signal } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { CheckboxField, FieldErrors, FormBuffer, InputNumberField, InputTextField } from '../../types/common.type';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-register-property-sale-form',
    standalone: false,
    template: `
        @let fieldErrors = $fieldErrors();

        <h2 class="mt-0 text-base text-slate-500">Datos de la venta</h2>

        <form [formGroup]="form" class="w-full flex flex-col gap-3">
            <app-checkbox-field [data]="fieldInUse" class="w-full" />

            <div class="flex gap-3 w-full flex-row">
                <app-input-text-field [data]="fieldType" class="w-full" />

                <app-input-number-field
                    [data]="fieldSaleCost"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
            </div>
            <div class="flex gap-3 w-full flex-row">
                <app-input-number-field
                    [data]="fieldFront"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
                <app-input-number-field
                    [data]="fieldWidth"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
            </div>
            <div class="flex gap-3 w-full flex-row">
                <app-input-number-field
                    [data]="fieldHeight"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
                <app-input-number-field
                    [data]="fieldTotalM2"
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
export class RegisterPropertySaleFormComponent {
    private readonly _properties: PropertiesService = inject(PropertiesService);
    public form: FormGroup = (this._properties.formsBuffer['registerProperty']['datos_venta'] as FormBuffer).form;
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

    public fieldType: InputTextField = {
        form: this.form,
        name: 'tipo_uso',
        label: 'Tipo de uso',
    };
    public fieldInUse: CheckboxField = {
        form: this.form,
        name: 'ocupado',
        label: 'Ocupado',
    };
    public fieldFront: InputNumberField = {
        form: this.form,
        name: 'frente',
        label: 'Medida de frente',
        min: 1,
    };
    public fieldWidth: InputNumberField = {
        form: this.form,
        name: 'fondo',
        label: 'Medida de fondo',
        min: 1,
    };
    public fieldHeight: InputNumberField = {
        form: this.form,
        name: 'profundo',
        label: 'Medida de profundidad',
        min: 1,
    };
    public fieldTotalM2: InputNumberField = {
        form: this.form,
        name: 'm2_totales',
        label: 'Metros cuadrados totales',
        min: 1,
    };
    public fieldSaleCost: InputNumberField = {
        form: this.form,
        name: 'costo_venta',
        label: 'Costo de venta',
        min: 0,
        currency: 'MXN',
        mode: 'currency',
        minFractionDigits: 2,
    };

    constructor() {}

    public handlePrevious(): void {
        this._properties.formPreviousStep();
    }

    public handleNext(): void {
        this._properties.formNextStep();
    }
}
