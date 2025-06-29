import { Component, computed, ElementRef, inject, Signal, viewChild } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { Property, PropertyActions } from '../../types/data.type';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonService } from '../../services/common.service';
import { DropdownItem } from '../../types/common.type';

@Component({
    selector: 'app-properties-carousel',
    standalone: false,
    template: `
        @let properties = $properties();

        <section class="py-4 border-b-2 border-b-solid border-b-brand-yellow flex flex-col">
            <h2 class="mt-0 mb-1.5 font-arimo text-base font-normal">
                Filtros y acciones
            </h2>
            <div class="w-full flex items-stretch justify-between">
                <app-properties-filters-form />

                <div class="flex items-center justify-end">
                    <button
                        pButton
                        label="Registrar propiedad"
                        icon="bx bx-plus text-lg"
                        class="bg-brand-dark-gray font-arimo border-none h-full hover:bg-brand-black focus:bg-brand-black transition-all text-xs py-0"
                        (click)="handleAction('register')"
                        >
                    </button>
                </div>
            </div>
        </section>

        <section class="pb-2 mb-2 pt-5 w-10/12 flex gap-5 items-center mx-auto">
            <button
                class="bg-brand-dark-gray p-2.5 border-none cursor-pointer hover:bg-brand-black focus:bg-brand-black disabled:bg-brand-light-gray"
                [disabled]="properties.length < 2"
                (click)="scrollLeft()"
                >
                <i class="bx bx-chevron-left text-lg text-white"></i>
            </button>
            <section
                #wrapperCarousel
                class="overflow-hidden flex gap-2 snap-mandatory snap-x flex-auto px-4"
                >
                @for (property of properties; track $index) {
                    <div
                        class="min-w-[80%] border border-slate-300 border-solid p-4 flex flex-col snap-center"
                        style="animation: carousel-scale both; animation-duration: 1ms; animation-timeline: view(x); animation-range: entry;"
                        >
                        <div class="w-full flex justify-between pb-2 border-b border-b-solid border-b-slate-300">
                            <h3 class="my-0 font-arimo">{{ property.nombre }}</h3>
                            <div class="flex gap-2">
                                <app-status model="properties" [status]="property.tipo_propiedad" />
                                <app-status model="properties" [status]="property.status_propiedad" />
                            </div>
                        </div>

                        <div class="w-full flex flex-row items-start gap-3 mt-5">
                            <img
                                [src]="property.imagenes && property.imagenes.length ? property.imagenes[0].url : ''"
                                [alt]="property.nombre"
                                class="w-6/12 aspect-[4/3] object-cover shadow-md"
                                (error)="handleImageError($event)"
                                />

                            <div class="w-full flex flex-col gap-2 h-full">
                                <div class="w-full flex items-start justify-start gap-2">
                                    <p-tag
                                        severity="info"
                                        styleClass="font-arimo bg-blue-100 text-blue-500 text-xs"
                                        [value]="property.anio_adquisicion"
                                        />
                                    <p-tag
                                        severity="success"
                                        styleClass="font-arimo bg-green-100 text-green-500 text-xs"
                                        [value]="(property.valor_comercial_actual | currency: 'MXN' : 'symbol-narrow' : '0.2-2') || ''"
                                        />
                                    @if (property.status_propiedad === "venta") {
                                        <p-tag
                                            severity="secondary"
                                            styleClass="font-arimo bg-slate-100 text-slate-500 text-xs"
                                            [value]="property.datos_venta.ocupado ? 'Ocupado' : 'Sin ocupar'"
                                            />
                                    }
                                </div>

                                <div class="w-full flex flex-col items-start justify-center">
                                    <div class="w-full flex flex-row flex-wrap gap-y-2">
                                        <div class="flex flex-col items-start justify-start w-1/2">
                                            <span class="font-arimo text-xs text-slate-800">
                                                <b>Dirección</b>
                                            </span>
                                            <span class="font-arimo text-sm text-slate-700">
                                                {{ property.direccion.calle }} #{{ property.direccion.numero_exterior }}, Col. {{ property.direccion.colonia }}, {{ property.direccion.municio }}, {{ property.direccion.estado }}
                                            </span>
                                        </div>
                                        <div class="flex flex-col items-start justify-start w-1/2">
                                            <span class="font-arimo text-xs text-slate-800">
                                                <b>Nombre de la escritura</b>
                                            </span>
                                            <span class="font-arimo text-sm text-slate-700">
                                                {{ property.nombre_escritura }}
                                            </span>
                                        </div>
                                        <div class="flex flex-col items-start justify-start w-full">
                                            <span class="font-arimo text-xs text-slate-800">
                                                <b>Amenidades</b>
                                            </span>
                                            <span class="font-arimo text-sm text-slate-700">
                                                {{ property.amenidades }}
                                            </span>
                                        </div>
                                    </div>

                                    <h5 class="text-sm font-arimo font-bold mt-3 mb-1.5 pb-0.5 border-b-2 border-b-slate-200 w-full text-slate-500">
                                        Datos de {{ property.status_propiedad === "renta" ? "renta" : "venta" }}
                                    </h5>

                                    <div class="w-full flex flex-row flex-wrap gap-y-2">
                                        @if (property.status_propiedad === 'renta') {
                                            @if (property.datos_renta.costo_mantenimiento) {
                                                <div class="flex flex-col items-start justify-start w-1/2">
                                                    <span class="font-arimo text-xs text-slate-800">
                                                        <b>Costo del mantenimiento</b>
                                                    </span>
                                                    <span class="font-arimo text-sm text-slate-700">
                                                        {{ property.datos_renta.costo_mantenimiento | currency: "MXN" : "symbol-narrow" : "0.2-2" }}
                                                    </span>
                                                </div>
                                            }
                                            @if (property.datos_renta.costo_renta) {
                                                <div class="flex flex-col items-start justify-start w-1/2">
                                                    <span class="font-arimo text-xs text-slate-800">
                                                        <b>Costo de la renta</b>
                                                    </span>
                                                    <span class="font-arimo text-sm text-slate-700">
                                                        {{ property.datos_renta.costo_renta | currency: "MXN" : "symbol-narrow" : "0.2-2" }}
                                                    </span>
                                                </div>
                                            }
                                            @if (property.datos_renta.incremento_anual) {
                                                <div class="flex flex-col items-start justify-start w-1/2">
                                                    <span class="font-arimo text-xs text-slate-800">
                                                        <b>Incremento de valor anual</b>
                                                    </span>
                                                    <span class="font-arimo text-sm text-slate-700">
                                                        {{ property.datos_renta.incremento_anual }}%
                                                    </span>
                                                </div>
                                            }

                                            @let debt = convertDebt(property.datos_renta.pagos_pendientes);
                                            @if (debt.length) {
                                                <div class="flex flex-col items-start justify-start w-1/2">
                                                    <span class="font-arimo text-xs text-slate-800">
                                                        <b>Pagos pendientes</b>
                                                    </span>

                                                    @for (item of debt; track $index) {
                                                        <span class="font-arimo text-sm text-slate-700">
                                                            {{ item.label | titlecase }}:
                                                            {{ item.value | currency: "MXN" : "symbol-narrow" : "0.2-2" }}
                                                        </span>
                                                    }
                                                </div>
                                            }
                                        }

                                        @if (property.status_propiedad === 'venta') {
                                            @if (property.datos_venta.tipo_uso) {
                                                <div class="flex flex-col items-start justify-start w-1/2">
                                                    <span class="font-arimo text-xs text-slate-800">
                                                        <b>Tipo de uso</b>
                                                    </span>
                                                    <span class="font-arimo text-sm text-slate-700">
                                                        {{ property.datos_venta.tipo_uso }}
                                                    </span>
                                                </div>
                                            }
                                            @if (property.datos_venta.costo_venta) {
                                                <div class="flex flex-col items-start justify-start w-1/2">
                                                    <span class="font-arimo text-xs text-slate-800">
                                                        <b>Costo de venta</b>
                                                    </span>
                                                    <span class="font-arimo text-sm text-slate-700">
                                                        {{ property.datos_venta.costo_venta | currency: "MXN" : "symbol-narrow" : "0.2-2" }}
                                                    </span>
                                                </div>
                                            }
                                            @if (property.datos_venta.frente) {
                                                <div class="flex flex-col items-start justify-start w-1/2">
                                                    <span class="font-arimo text-xs text-slate-800">
                                                        <b>Medida de frente</b>
                                                    </span>
                                                    <span class="font-arimo text-sm text-slate-700">
                                                        {{ property.datos_venta.frente }} m
                                                    </span>
                                                </div>
                                            }
                                            @if (property.datos_venta.fondo) {
                                                <div class="flex flex-col items-start justify-start w-1/2">
                                                    <span class="font-arimo text-xs text-slate-800">
                                                        <b>Medida de fondo</b>
                                                    </span>
                                                    <span class="font-arimo text-sm text-slate-700">
                                                        {{ property.datos_venta.fondo }} m
                                                    </span>
                                                </div>
                                            }
                                            @if (property.datos_venta.profundo) {
                                                <div class="flex flex-col items-start justify-start w-1/2">
                                                    <span class="font-arimo text-xs text-slate-800">
                                                        <b>Medida de produndidad</b>
                                                    </span>
                                                    <span class="font-arimo text-sm text-slate-700">
                                                        {{ property.datos_venta.profundo }} m
                                                    </span>
                                                </div>
                                            }
                                            @if (property.datos_venta.m2_totales) {
                                                <div class="flex flex-col items-start justify-start w-1/2">
                                                    <span class="font-arimo text-xs text-slate-800">
                                                        <b>Metros cuadrados totales</b>
                                                    </span>
                                                    <span class="font-arimo text-sm text-slate-700">
                                                        {{ property.datos_venta.m2_totales }} m<sup>2</sup>
                                                    </span>
                                                </div>
                                            }
                                        }
                                    </div>
                                </div>

                                <div class="w-full flex items-center justify-end mt-auto gap-1.5">
                                    <button
                                        pButton
                                        pTooltip="Locales"
                                        tooltipStyleClass="font-arimo text-xs"
                                        [showDelay]="1000"
                                        [disabled]="property.status_propiedad === 'venta'"
                                        icon="bx bx-buildings text-base size-4"
                                        severity="secondary"
                                        class="disabled:opacity-40"
                                        >
                                    </button>
                                    <button
                                        pButton
                                        pTooltip="Detalles"
                                        tooltipStyleClass="font-arimo text-xs"
                                        [showDelay]="1000"
                                        icon="bx bx-detail text-base size-4"
                                        severity="secondary"
                                        (click)="handleAction('details', property)"
                                        >
                                    </button>
                                    <button
                                        pButton
                                        pTooltip="Editar"
                                        tooltipStyleClass="font-arimo text-xs"
                                        [showDelay]="1000"
                                        icon="bx bx-edit-alt text-base size-4"
                                        severity="secondary"
                                        (click)="handleAction('update', property)"
                                        >
                                    </button>
                                    <button
                                        pButton
                                        pTooltip="Eliminar"
                                        tooltipStyleClass="font-arimo text-xs"
                                        [showDelay]="1000"
                                        icon="bx bx-x text-base size-4"
                                        severity="danger"
                                        >
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </section>
            <button
                class="bg-brand-dark-gray p-2.5 border-none cursor-pointer hover:bg-brand-black focus:bg-brand-black disabled:bg-brand-light-gray"
                [disabled]="properties.length < 2"
                (click)="scrollRight()"
                >
                <i class="bx bx-chevron-right text-lg text-white"></i>
            </button>
        </section>

        <div class="w-full mt-10 flex items-center justify-center gap-1">
            @for (item of properties; track $index) {
                <button
                    class="p-0 m-0 border-none rounded-full transition-all cursor-pointer"
                    [ngClass]="{
                        'bg-brand-black size-3': $index === step,
                        'bg-brand-light-gray size-2.5': $index !== step,
                    }"
                    (click)="toIndex($index)"
                    >
                </button>
            }
        </div>
    `,
})
export class PropertiesCarouselComponent {
    private readonly _common: CommonService = inject(CommonService);
    private readonly _properties: PropertiesService = inject(PropertiesService);

    private $filterChanges: Signal<Record<string, string | null> | undefined> = toSignal(this._properties.state.filters().valueChanges);

    public step: number = 0;
    public $wrapperCarousel: Signal<ElementRef | undefined> = viewChild('wrapperCarousel');
    public $properties: Signal<Property[]> = computed(() => {
        const wrapper: ElementRef | undefined = this.$wrapperCarousel();
        const filterChanges: Record<string, string | null> | undefined = this.$filterChanges();
        let { data } = this._properties.state.details();

        data = this._common.clone(data).reverse();

        if (filterChanges) {
            const { search, type, status, deed } = filterChanges;

            data = data.filter((property: Property) =>
                (!search || JSON.stringify(property).toLowerCase().includes(search.toLowerCase())) &&
                (!type || property.tipo_propiedad === type) &&
                (!status || property.status_propiedad === status) &&
                (!deed || property.status_escritura === deed));
        }

        wrapper && wrapper.nativeElement.scrollTo({ left: 0 });
        this.step = 0;

        return data;
    });

    constructor() {
        this._properties.upsetPropertiesData();
    }

    public handleImageError(event: Event) {
        (event.target as HTMLImageElement).src = '/assets/images/empty.jpg';
    }

    public scrollLeft(): void {
        const wrapper: HTMLDivElement | undefined = this.$wrapperCarousel()?.nativeElement;

        if (!wrapper) return;

        this.step - 1 >= 0 && this.step--;
        wrapper.children[this.step].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        });
    }

    public scrollRight(): void {
        const wrapper: HTMLDivElement | undefined = this.$wrapperCarousel()?.nativeElement;

        if (!wrapper) return;

        const children: number = wrapper.children.length;

        this.step + 1 < children && this.step++;
        wrapper.children[this.step].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        });
    }

    public toIndex(index: number): void {
        const wrapper: HTMLDivElement | undefined = this.$wrapperCarousel()?.nativeElement;

        if (!wrapper) return;

        this.step = index;
        wrapper.children[this.step].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        });
    }

    public convertDebt(debt: Record<string, number>): DropdownItem<number>[] {
        let data: DropdownItem<number>[] = [];

        if (!debt) return [];

        for (const key in debt) {
            data = [...data, { label: key.replace('_', ' '), value: debt[key] }];
        }

        return data;
    }

    public handleAction(action: PropertyActions, property?: Property) {
        const upserProperty = () => new Promise((resolve, reject) => property
            ? resolve((this._properties.selected = property))
            : reject());

        const switcher: Record<PropertyActions, Function> = {
            register: () => this._properties.dialogRegisterProperty(),
            update: () => upserProperty().then(() => this._properties.dialogUpdateProperty()),
            details: () => upserProperty().then(() => this._properties.dialogPropertyDetails()),
        };

        switcher[action]();
    }
}
