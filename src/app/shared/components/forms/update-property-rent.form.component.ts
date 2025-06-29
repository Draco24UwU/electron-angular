import { Component, computed, effect, inject, Signal } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { DropdownItem, FieldErrors, FormBuffer, InputNumberField, InputTextField } from '../../types/common.type';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonService } from '../../services/common.service';

@Component({
    selector: 'app-update-property-rent-form',
    standalone: false,
    template: `
        @let pending = $pending();
        @let fieldErrors = $fieldErrors();

        <form [formGroup]="form" class="w-full flex flex-col gap-3">
            <div class="flex gap-3 w-full flex-row">
                <app-input-number-field
                    [data]="fieldRentCost"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
                <app-input-number-field
                    [data]="fieldMaintenance"
                    [errors]="fieldErrors"
                    class="w-full"
                    />
            </div>
            <div class="flex gap-3 w-full flex-row">
                <div class="w-full flex flex-col gap-3 items-start">
                    <app-input-number-field
                        [data]="fieldYearlyIncrement"
                        class="w-full"
                        />
                    <p-message
                        severity="info"
                        styleClass="bg-blue-100 outline-none border-none"
                        icon="bx bx-info-circle text-blue-500"
                        >
                        <span class="text-xs font-arimo text-blue-500">
                            Para registrar un adeúdo escribe su nombre, el monto de la deuda y presiona ENTER
                        </span>
                    </p-message>
                    <div class="w-full flex gap-3">
                        <app-input-text-field
                            [data]="fieldDebt"
                            [errors]="fieldErrors"
                            class="w-full"
                            (control)="setDebtListeners($event)"
                            />
                        <app-input-number-field
                            [data]="fieldAmount"
                            [errors]="fieldErrors"
                            class="w-full"
                            (control)="setDebtListeners($event.rootEl)"
                            />
                    </div>
                </div>
                <div class="w-full flex items-start">
                    <p-table stripedRows [value]="pending" size="small" class="w-full">
                        <ng-template #header>
                            <tr><th [colSpan]="3" class="text-xs">Adeudos</th></tr>
                        </ng-template>
                        <ng-template #body let-payment>
                            <tr>
                                <td class="text-xs">{{ payment.label | titlecase }}</td>
                                <td class="text-xs">{{ payment.value | currency: "MXN" : "symbol-narrow" : "0.2-2" }}</td>
                                <td
                                    class="w-12 text-center hover:bg-slate-100 transition-all cursor-pointer"
                                    (click)="handleRemoveDebt(payment.label)"
                                    >
                                    <i class="bx bx-x text-base"></i>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </form>
    `,
})
export class UpdatePropertyRentFormComponent {
    private readonly _common: CommonService = inject(CommonService);
    private readonly _properties: PropertiesService = inject(PropertiesService);

    public form: FormGroup = (this._properties.formsBuffer['updateProperty']['datos_renta'] as FormBuffer).form;
    public debtForm: FormGroup = this._properties.formsBuffer['rentDebt'].form;
    public $pendingChanges: Signal<Record<string, number>> = toSignal(this.form.controls['pagos_pendientes'].valueChanges,);
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
    public $pending: Signal<DropdownItem<number>[]> = computed(() => {
        const pendingChanges: Record<string, number> = this.$pendingChanges();
        const pending: Record<string, number> = this.form.controls['pagos_pendientes'].value;
        const buffer: Record<string, number> = pendingChanges || pending || {};
        let data: DropdownItem<number>[] = [];

        for (const key in buffer) {
            data = [...data, { label: key.replace('_', ' '), value: buffer[key] }];
        }

        return data;
    });

    public fieldRentCost: InputNumberField = {
        form: this.form,
        name: 'costo_renta',
        label: 'Costo de la renta',
        step: 100,
        min: 0,
        mode: 'currency',
        minFractionDigits: 2,
    };

    public fieldMaintenance: InputNumberField = {
        form: this.form,
        name: 'costo_mantenimiento',
        label: 'Costo del mantenimiento',
        step: 100,
        min: 0,
        mode: 'currency',
        minFractionDigits: 2,
    };

    public fieldYearlyIncrement: InputNumberField = {
        form: this.form,
        name: 'incremento_anual',
        label: 'Porcentaje de incremento anual',
        suffix: ' %',
    };

    public fieldDebt: InputTextField = {
        form: this.debtForm,
        name: 'name',
        label: 'Nombre del adeudo',
        type: 'slug',
    };

    public fieldAmount: InputNumberField = {
        form: this.debtForm,
        name: 'amount',
        label: 'Monto del adeudo',
        currency: 'MXN',
        step: 100,
        mode: 'currency',
        maxFractionDigits: 2,
    };

    constructor() {
        effect((onCleanup) => onCleanup(() => this.debtForm.reset()));
    }

    public setDebtListeners(control: HTMLInputElement): void {
        control.addEventListener('keypress', (event: KeyboardEvent) => {
            const { value, valid } = this.debtForm;
            const empty: boolean = Object.values(value).every((val: unknown) => !val);
            const previous: Record<string, number> = this.form.controls['pagos_pendientes'].value;

            let { name, amount } = value;

            if (event.key !== 'Enter' || empty) return;

            event.stopPropagation();
            event.preventDefault();

            if (!valid) return;

            name = name.trim().replaceAll(' ', '_');

            this.form.patchValue({
                pagos_pendientes: { ...(previous || {}), [name]: amount },
            });

            this.debtForm.reset();
        });
    }

    public handleRemoveDebt(key: string): void {
        const pending: Record<string, number> = this.form.controls['pagos_pendientes'].value;
        const { [key]: _, ...filtered } = this._common.clone(pending);

        this.form.patchValue({ pagos_pendientes: filtered });
    }
}
