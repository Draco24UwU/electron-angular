import { Component, computed, effect, inject, Signal } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { Property } from '../../types/data.type';
import { FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuffer } from '../../types/common.type';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
    selector: 'app-update-property-dialog',
    standalone: false,
    template: `
        @let loading = $loading();

        <section class="w-5xl flex flex-col">
            @if (property) {
                <app-form-loading-message [loading]="loading" />
                
                <p-tabs [value]="0" class="mt-5">
                    <p-tablist>
                        <p-tab 
                            [value]="0"
                            class="text-sm px-2.5 py-0 h-8 text-slate-500 [&.p-tab-active]:bg-brand-yellow [&.p-tab-active]:text-slate-900"
                            >
                            General
                        </p-tab>
                        <p-tab 
                            [value]="1"
                            class="text-sm px-2.5 py-0 h-8 text-slate-500 [&.p-tab-active]:bg-brand-yellow [&.p-tab-active]:text-slate-900"
                            >
                            Dirección
                        </p-tab>
                        <p-tab 
                            [value]="2"
                            class="text-sm px-2.5 py-0 h-8 text-slate-500 [&.p-tab-active]:bg-brand-yellow [&.p-tab-active]:text-slate-900"
                            >
                            Contrucción
                        </p-tab>
                        <p-tab 
                            [value]="3"
                            class="text-sm px-2.5 py-0 h-8 text-slate-500 [&.p-tab-active]:bg-brand-yellow [&.p-tab-active]:text-slate-900"
                            >
                            {{ propertyStatus === 'venta' ? 'Venta' : 'Renta' }}
                        </p-tab>
                        <p-tab
                            [value]="4"
                            class="text-sm px-2.5 py-0 h-8 text-slate-500 [&.p-tab-active]:bg-brand-yellow [&.p-tab-active]:text-slate-900"
                            >
                            Archivos
                        </p-tab>
                    </p-tablist>
                    <p-tabpanels>
                        <p-tabpanel [value]="0">
                            <app-update-property-general-form />
                        </p-tabpanel>
                        <p-tabpanel [value]="1">
                            <app-update-property-address-form />
                        </p-tabpanel>
                        <p-tabpanel [value]="2">
                            <app-update-property-building-details-form />
                        </p-tabpanel>
                        <p-tabpanel [value]="3">
                            @if (propertyStatus === 'renta') {
                                <app-update-property-rent-form />
                            }

                            @if (propertyStatus === 'venta') {
                                <app-update-property-sale-form />
                            }
                        </p-tabpanel>
                        <p-tabpanel [value]="4">
                            <app-update-property-pictures-form />
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>

                <button
                    pButton
                    label="Actualizar"
                    class="bg-brand-dark-gray hover:bg-brand-black focus:bg-brand-black border-none w-fit ml-auto px-5 text-xs"
                    (click)="handleUpdate()"
                    >
                </button>
            }
        </section>
    `
})
export class UpdatePropertyDialogComponent {
    private readonly _dialogRef: DynamicDialogRef = inject(DynamicDialogRef);
    private readonly _properties: PropertiesService = inject(PropertiesService);
    private form: FormGroup = this._properties.formsBuffer['updateProperty'].form;
    private $propertyStatusChanges: Signal<string> = toSignal(this.form.controls['status_propiedad'].valueChanges);

    public $loading: Signal<boolean> = computed(() => this._properties.state.loading());
    public property: Property | null = this._properties.selected;
    public propertyStatus: string = this.property?.status_propiedad || '';

    constructor() {
        effect(() => {
            const propertyStatusChanges: string = this.$propertyStatusChanges();
            const form: FormBuffer = this._properties.formsBuffer['updateProperty'];
            const rentForm: FormGroup = (form['datos_renta'] as FormBuffer).form;
            const saleForm: FormGroup = (form['datos_venta'] as FormBuffer).form;

            this.propertyStatus = propertyStatusChanges || this.property?.status_propiedad || '';
            propertyStatusChanges === 'venta'
                ? rentForm.reset()
                : saleForm.reset();
        });
    }

    public handleUpdate(): void {
        this._properties.updateProperty().then(() => this._dialogRef.close());
    }
}