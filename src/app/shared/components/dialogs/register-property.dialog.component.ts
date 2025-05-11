import { Component, computed, effect, inject, Signal } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuffer } from '../../types/common.type';

@Component({
    selector: 'app-register-property-dialog',
    standalone: false,
    template: `
        @let loading = $loading();
        @let step = $step();
        @let propertyStatus = $propertyStatus();

        <section class="w-5xl flex flex-col">
            <app-form-loading-message [loading]="loading" />

            <p-stepper
                [value]="step"
                class="mt-5"
                (valueChange)="handleStepChange($event)"
                >
                <p-step-list>
                    <p-step [value]="1" class="[&>button>span]:text-sm" />
                    <p-step [value]="2" class="[&>button>span]:text-sm" />
                    <p-step [value]="3" class="[&>button>span]:text-sm" />
                    <p-step [value]="4" class="[&>button>span]:text-sm" />
                    <p-step [value]="5" class="[&>button>span]:text-sm" />
                </p-step-list>
                <p-step-panels>
                    <p-step-panel [value]="1">
                        <ng-template #content let-activateCallback="activateCallback">
                            <app-register-property-general-form />
                        </ng-template>
                    </p-step-panel>

                    <p-step-panel [value]="2">
                        <ng-template #content let-activateCallback="activateCallback">
                            <app-register-property-address-form />
                        </ng-template>
                    </p-step-panel>

                    <p-step-panel [value]="3">
                        <ng-template #content let-activateCallback="activateCallback">
                            <app-register-property-building-details-form />
                        </ng-template>
                    </p-step-panel>

                    <p-step-panel [value]="4">
                        <ng-template #content let-activateCallback="activateCallback">
                            @if (propertyStatus === "renta") {
                                <app-register-property-rent-form />
                            } @else if (propertyStatus === "venta") {
                                <app-register-property-sale-form />
                            } @else {
                                <p-message
                                    severity="info"
                                    styleClass="bg-blue-100 outline-none border-none"
                                    icon="bx bx-info-circle text-blue-500"
                                    >
                                    <span class="text-xs font-arimo text-blue-500">
                                        Selecciona el estado de la propiedad para poder llenar esta
                                        sección del formulario
                                    </span>
                                </p-message>

                                <ng-container *ngTemplateOutlet="navButtons" />
                            }
                        </ng-template>
                    </p-step-panel>

                    <p-step-panel [value]="5">
                        <ng-template #content let-activateCallback="activateCallback">
                            <app-register-property-pictures-form />
                        </ng-template>
                    </p-step-panel>
                </p-step-panels>
            </p-stepper>
        </section>

        <ng-template #navButtons>
            <div class="flex flex-row-reverse items-center justify-start w-full gap-2 mt-2">
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
        </ng-template>
    `,
})
export class RegisterPropertyDialogComponent {
    private readonly _properties: PropertiesService = inject(PropertiesService);

    public $loading: Signal<boolean> = computed(() => this._properties.state.loading());
    public $step: Signal<number> = computed(() => this._properties.registerFormStepActive);
    public form: FormGroup = this._properties.formsBuffer['registerProperty'].form;
    public $propertyStatusChanges: Signal<string> = toSignal(this.form.controls['status_propiedad'].valueChanges);
    public $propertyStatus: Signal<string> = computed(() => {
        const changes: string = this.$propertyStatusChanges();
        const value: string = this.form.controls['status_propiedad'].value;

        return changes ?? value ?? '';
    });

    constructor() {
        effect((onCleanup) => onCleanup(() => (this._properties.registerFormStepActive = 1)));
        effect(() => {
            const propertyStatusChanges: string = this.$propertyStatusChanges();
            const form: FormBuffer = this._properties.formsBuffer['registerProperty'];
            const rentForm: FormGroup = (form['datos_renta'] as FormBuffer).form;
            const saleForm: FormGroup = (form['datos_venta'] as FormBuffer).form;

            propertyStatusChanges === 'venta'
                ? rentForm.reset()
                : saleForm.reset();
        });
    }

    public handleStepChange(event?: number): void {
        event && (this._properties.registerFormStepActive = event);
    }

    public handlePrevious(): void {
        this._properties.formPreviousStep();
    }

    public handleNext(): void {
        this._properties.formNextStep();
    }
}
