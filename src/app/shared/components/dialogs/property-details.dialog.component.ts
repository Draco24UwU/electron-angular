import { Component, inject } from '@angular/core';
import { Property } from '../../types/data.type';
import { PropertiesService } from '../../services/properties.service';
import { GalleriaResponsiveOptions } from 'primeng/galleria';
import { DropdownItem } from '../../types/common.type';

@Component({
    selector: 'app-property-details-dialog',
    standalone: false,
    template: `
        @if (property) {
            <section class="w-5xl flex flex-col">
                <div class="w-full flex gap-3">
                    @let pictures = this.property.imagenes;
    
                    @if (pictures && pictures.length) {
                        <p-galleria
                            class="w-1/2"
                            [value]="pictures"
                            [showIndicatorsOnItem]="true"
                            [responsiveOptions]="responsiveOptions"
                            [numVisible]="pictures.length > 4 ? 5 : pictures.length"
                            >
                            <ng-template #item let-item>
                                <p-image
                                    alt="Image"
                                    class="w-full"
                                    appendTo="body"
                                    styleClass="[&>img]:w-full [&>img]:aspect-[4/3] [&>img]:object-cover"
                                    [src]="item.url"
                                    [preview]="true"
                                    />
                            </ng-template>
                            <ng-template #thumbnail let-item>
                                <img [src]="item.url" alt="thumbnail" class="w-20 aspect-[4/3] object-cover" />
                            </ng-template>
                        </p-galleria>
                    }

                    <div class="flex-auto flex flex-col gap-2">
                        <h3 class="text-sm font-bold text-slate-500 border-b border-b-slate-400 pb-1 my-0">
                            Datos generales
                        </h3>

                        <div class="w-full flex flex-wrap gap-1">
                            <app-status model="properties" [status]="property.status_escritura" />
                            <app-status model="properties" [status]="property.status_propiedad" />
                            <app-status model="properties" [status]="property.tipo_propiedad" />
                            <p-tag
                                class="text-xxs font-arimo"
                                [value]="property.rentado ? 'Rentado' : 'Sin rentar'"
                                styleClass="bg-purple-100 text-purple-500"
                                />
                        </div>

                        <div class="w-full flex flex-wrap gap-y-2">
                            <div class="flex flex-col items-start justify-start w-1/2">
                                <span class="font-arimo text-xs text-slate-800">
                                    <b>Nombre de la escritura</b>
                                </span>
                                <span class="font-arimo text-sm text-slate-700">
                                    {{ property.nombre_escritura }}
                                </span>
                            </div>

                            <div class="flex flex-col items-start justify-start w-1/2">
                                <span class="font-arimo text-xs text-slate-800">
                                    <b>Año de adquisición</b>
                                </span>
                                <span class="font-arimo text-sm text-slate-700">
                                    {{ property.anio_adquisicion }}
                                </span>
                            </div>

                            <div class="flex flex-col items-start justify-start w-1/2">
                                <span class="font-arimo text-xs text-slate-800">
                                    <b>Valor comercial actual</b>
                                </span>
                                <span class="font-arimo text-sm text-slate-700">
                                    {{ property.valor_comercial_actual | currency: 'MXN' : 'symbol-narrow' : '0.2-2' }}
                                </span>
                            </div>

                            <div class="flex flex-col items-start justify-start w-1/2">
                                <span class="font-arimo text-xs text-slate-800">
                                    <b>Valor de adquisición</b>
                                </span>
                                <span class="font-arimo text-sm text-slate-700">
                                    {{ property.valor_adquisicion | currency: 'MXN' : 'symbol-narrow' : '0.2-2' }}
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

                            @if (property.observaciones) {
                                <div class="flex flex-col items-start justify-start w-full">
                                    <span class="font-arimo text-xs text-slate-800">
                                        <b>Observaciones</b>
                                    </span>
                                    <span class="font-arimo text-sm text-slate-700">
                                        {{ property.observaciones }}
                                    </span>
                                </div>
                            }

                            @if (property.servicios && property.servicios.length) {
                                <div class="flex flex-col items-start justify-start w-full">
                                    <span class="font-arimo text-xs text-slate-800">
                                        <b>Servicios</b>
                                    </span>
                                    <ul class="m-0">
                                        @for (service of property.servicios; track $index) {
                                            <li class="text-sm text-slate-700">
                                                {{ service }}
                                            </li>
                                        }
                                    </ul>
                                </div>
                            }
                        </div>

                        <p-tabs [value]="0" class="mt-4">
                            <p-tablist>
                                <p-tab
                                    [value]="0"
                                    class="text-sm px-2.5 py-0 h-8 text-slate-500 [&.p-tab-active]:bg-brand-yellow [&.p-tab-active]:text-slate-900"
                                    >
                                    Dirección
                                </p-tab>
                                <p-tab
                                    [value]="1"
                                    class="text-sm px-2.5 py-0 h-8 text-slate-500 [&.p-tab-active]:bg-brand-yellow [&.p-tab-active]:text-slate-900"
                                    >
                                    Construcción
                                </p-tab>
                                <p-tab
                                    [value]="2"
                                    class="text-sm px-2.5 py-0 h-8 text-slate-500 [&.p-tab-active]:bg-brand-yellow [&.p-tab-active]:text-slate-900"
                                    >
                                    {{ property.status_propiedad === 'venta' ? 'Venta' : 'Renta' }}
                                </p-tab>
                                <p-tab
                                    [value]="3"
                                    class="text-sm px-2.5 py-0 h-8 text-slate-500 [&.p-tab-active]:bg-brand-yellow [&.p-tab-active]:text-slate-900"
                                    >
                                    Archivos
                                </p-tab>
                            </p-tablist>
                            <p-tabpanels>
                                <p-tabpanel [value]="0">
                                    <div class="w-full flex flex-wrap gap-y-2">
                                        <div class="flex flex-col items-start justify-start w-1/2">
                                            <span class="font-arimo text-xs text-slate-800">
                                                <b>Estado</b>
                                            </span>
                                            <span class="font-arimo text-sm text-slate-700">
                                                {{ property.direccion.estado }}
                                            </span>
                                        </div>

                                        <div class="flex flex-col items-start justify-start w-1/2">
                                            <span class="font-arimo text-xs text-slate-800">
                                                <b>Municipio</b>
                                            </span>
                                            <span class="font-arimo text-sm text-slate-700">
                                                {{ property.direccion.municio }}
                                            </span>
                                        </div>

                                        <div class="flex flex-col items-start justify-start w-1/2">
                                            <span class="font-arimo text-xs text-slate-800">
                                                <b>Calle</b>
                                            </span>
                                            <span class="font-arimo text-sm text-slate-700">
                                                {{ property.direccion.calle }}
                                            </span>
                                        </div>

                                        <div class="flex flex-col items-start justify-start w-1/2">
                                            <span class="font-arimo text-xs text-slate-800">
                                                <b>Colonia</b>
                                            </span>
                                            <span class="font-arimo text-sm text-slate-700">
                                                {{ property.direccion.colonia }}
                                            </span>
                                        </div>

                                        <div class="flex flex-col items-start justify-start w-1/2">
                                            <span class="font-arimo text-xs text-slate-800">
                                                <b>N. Exterior</b>
                                            </span>
                                            <span class="font-arimo text-sm text-slate-700">
                                                #{{ property.direccion.numero_exterior }}
                                            </span>
                                        </div>

                                        <div class="flex flex-col items-start justify-start w-1/2">
                                            <span class="font-arimo text-xs text-slate-800">
                                                <b>Código postal</b>
                                            </span>
                                            <span class="font-arimo text-sm text-slate-700">
                                                {{ property.direccion.codigo_postal }}
                                            </span>
                                        </div>
                                    </div>
                                </p-tabpanel>
                                <p-tabpanel [value]="1">
                                    <div class="w-full flex flex-wrap gap-y-2">
                                        @if (property.detalles_constructivos.medidas) {
                                            <div class="flex flex-col items-start justify-start w-1/2">
                                                <span class="font-arimo text-xs text-slate-800">
                                                    <b>Medidas</b>
                                                </span>
                                                <span class="font-arimo text-sm text-slate-700">
                                                    {{ property.detalles_constructivos.medidas }}
                                                </span>
                                            </div>
                                        }
                                        @if (property.detalles_constructivos.m2_terreno) {
                                            <div class="flex flex-col items-start justify-start w-1/2">
                                                <span class="font-arimo text-xs text-slate-800">
                                                    <b>M<sup>2</sup> de terreno</b>
                                                </span>
                                                <span class="font-arimo text-sm text-slate-700">
                                                    {{ property.detalles_constructivos.m2_terreno }} m<sup>2</sup>
                                                </span>
                                            </div>
                                        }
                                        @if (property.detalles_constructivos.m2_construidos) {
                                            <div class="flex flex-col items-start justify-start w-1/2">
                                                <span class="font-arimo text-xs text-slate-800">
                                                    <b>M<sup>2</sup> construidos</b>
                                                </span>
                                                <span class="font-arimo text-sm text-slate-700">
                                                    {{ property.detalles_constructivos.m2_construidos }} m<sup>2</sup>
                                                </span>
                                            </div>
                                        }
                                        @if (property.detalles_constructivos.m2_comunes) {
                                            <div class="flex flex-col items-start justify-start w-1/2">
                                                <span class="font-arimo text-xs text-slate-800">
                                                    <b>M<sup>2</sup> comunes</b>
                                                </span>
                                                <span class="font-arimo text-sm text-slate-700">
                                                    {{ property.detalles_constructivos.m2_comunes }} m<sup>2</sup>
                                                </span>
                                            </div>
                                        }
                                        @if (property.detalles_constructivos.num_sanitarios) {
                                            <div class="flex flex-col items-start justify-start w-1/2">
                                                <span class="font-arimo text-xs text-slate-800">
                                                    <b>N. de sanitarios</b>
                                                </span>
                                                <span class="font-arimo text-sm text-slate-700">
                                                    {{ property.detalles_constructivos.num_sanitarios }}
                                                </span>
                                            </div>
                                        }
                                    </div>
                                </p-tabpanel>
                                <p-tabpanel [value]="2">
                                    <div class="w-full flex flex-wrap gap-y-2">
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
                                </p-tabpanel>
                                <p-tabpanel [value]="3">
                                    <div class="w-full flex flex-wrap gap-y-2">
                                        @if (property.mapa_lugar && property.mapa_lugar.length) {
                                            <div class="flex flex-col items-start justify-start w-1/2">
                                                <span class="font-arimo text-xs text-slate-800">
                                                    <b>Mapa de la propiedad</b>
                                                </span>
                                                <span class="font-arimo text-sm text-slate-700">
                                                    <a
                                                        [href]="property.mapa_lugar.at(-1)?.url || ''"
                                                        target="_blank"
                                                        class="flex gap-1 items-center justofy-start no-underline hover:underline focus:underline text-sky-500 hover:text-sky-700 focus:text-sky-700 transition-all"
                                                        >
                                                        <span>Descargar archivo</span>
                                                        <i class="bx bx-download"></i>
                                                    </a>
                                                </span>
                                            </div>
                                        }

                                        @if (property.plano_lugar && property.plano_lugar.length) {
                                            <div class="flex flex-col items-start justify-start w-1/2">
                                                <span class="font-arimo text-xs text-slate-800">
                                                    <b>Plano de la propiedad</b>
                                                </span>
                                                <span class="font-arimo text-sm text-slate-700">
                                                    <a
                                                        [href]="property.plano_lugar.at(-1)?.url || ''"
                                                        target="_blank"
                                                        class="flex gap-1 items-center justofy-start no-underline hover:underline focus:underline text-sky-500 hover:text-sky-700 focus:text-sky-700 transition-all"
                                                        >
                                                        <span>Descargar archivo</span>
                                                        <i class="bx bx-download"></i>
                                                    </a>
                                                </span>
                                            </div>
                                        }
                                    </div>
                                </p-tabpanel>
                            </p-tabpanels>
                        </p-tabs>
                    </div>
                </div>
            </section>
        }
    `,
})
export class PropertyDetailsDialogComponent {
    private readonly _properties: PropertiesService = inject(PropertiesService);
    private responsive: GalleriaResponsiveOptions[] = [
        { breakpoint: '1279px', numVisible: 4 },
        { breakpoint: '1023px', numVisible: 3 },
        { breakpoint: '767px',  numVisible: 2 },
        { breakpoint: '639px',  numVisible: 1 },
    ];

    public property: Property | null = this._properties.selected;

    constructor() { }

    public get responsiveOptions(): GalleriaResponsiveOptions[] {
        const length: number = this.property?.imagenes.length || 0;
        return this.responsive.filter((option: GalleriaResponsiveOptions) => option.numVisible <= length)
    }

    public convertDebt(debt: Record<string, number>): DropdownItem<number>[] {
        let data: DropdownItem<number>[] = [];

        if (!debt) return [];

        for (const key in debt) {
            data = [...data, { label: key.replace('_', ' '), value: debt[key] }];
        }

        return data;
    }
}
