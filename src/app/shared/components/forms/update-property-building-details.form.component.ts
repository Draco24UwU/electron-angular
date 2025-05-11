import { Component, computed, inject, Signal } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { FieldErrors, FormBuffer, InputNumberField, InputTextField } from '../../types/common.type';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-update-property-building-details-form',
    standalone: false,
    template: `
        @let fieldErrors = $fieldErrors();

        <form [formGroup]="form" class="w-full flex flex-col gap-3">
            <div class="flex gap-3 w-full flex-row">
                <app-input-text-field
                    [data]="fieldSizes"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
                <app-input-number-field
                    [data]="fieldM2"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
            </div>
            <div class="flex gap-3 w-full flex-row">
                <app-input-number-field
                    [data]="fieldM2Builded"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
                <app-input-number-field
                    [data]="fieldCommon"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
            </div>
            <div class="flex gap-3 w-full flex-row">
                <app-input-number-field
                    [data]="fieldWCQuantity"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
                <div class="w-full"></div>
            </div>
        </form>
    `,
})
export class UpdatePropertyBuildingDetailsFormComponent {
    private readonly _properties: PropertiesService = inject(PropertiesService);

    public form: FormGroup = (this._properties.formsBuffer['updateProperty']['detalles_constructivos'] as FormBuffer).form;
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

    public $sizesChanges: Signal<string> = toSignal(this.form.controls['medidas'].valueChanges);
    public $m2Changes: Signal<number> = toSignal(this.form.controls['m2_terreno'].valueChanges);

    public fieldSizes: InputTextField = {
        form: this.form,
        name: 'medidas',
        label: 'Medidas del terreno',
    };

    public fieldM2: InputNumberField = {
        form: this.form,
        name: 'm2_terreno',
        label: 'Metros cuadrados del terreno',
        min: 1,
        minFractionDigits: 0,
    };

    public fieldM2Builded: InputNumberField = {
        form: this.form,
        name: 'm2_construidos',
        label: 'Metros cuadrados construidos',
        min: 0,
        minFractionDigits: 0,
    };
    public fieldCommon: InputNumberField = {
        form: this.form,
        name: 'm2_comunes',
        label: 'Metros cuadrados comunes',
        min: 0,
        minFractionDigits: 0,
    };
    public fieldWCQuantity: InputNumberField = {
        form: this.form,
        name: 'num_sanitarios',
        label: 'Número de sanitarios',
        min: 0,
        minFractionDigits: 0,
    };

    constructor() {}
}
