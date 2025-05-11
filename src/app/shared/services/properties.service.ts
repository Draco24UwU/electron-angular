import { Injectable, signal, WritableSignal } from '@angular/core';
import { Common } from './abstract/common.abstract';
import { APIProperties, Picture, PropertiesForms, PropertiesList, PropertiesStore, Property, PropertyModelStatus, ReqAddArchive, ReqRegisterProperty } from '../types/data.type';
import { FormGroup, Validators } from '@angular/forms';
import { ONLY_LETTERS, ONLY_LETTERS_UTF8, VALID_POSTAL_CODE } from '../constants/validation-patterns.constant';
import { RegisterPropertyDialogComponent } from '../components/dialogs/register-property.dialog.component';
import { PropertyDetailsDialogComponent } from '../components/dialogs/property-details.dialog.component';
import { UpdatePropertyDialogComponent } from '../components/dialogs/update-property.dialog.component';

@Injectable({
    providedIn: 'root',
})
export class PropertiesService extends Common<PropertiesForms, APIProperties, PropertiesStore, Property, PropertyModelStatus> {
    private $registerFormStepActive: WritableSignal<number> = signal(1);

    constructor() {
        super();

        this.$forms = signal({
            registerProperty: this._builder.group({
                nombre:         ['', Validators.required],
                tipo_propiedad: ['', Validators.required],
                direccion: this._builder.group({
                    estado:          ['', [Validators.required, Validators.pattern(ONLY_LETTERS_UTF8)]],
                    municio:         ['', [Validators.required, Validators.pattern(ONLY_LETTERS_UTF8)]],
                    colonia:         ['', [Validators.required]],
                    calle:           ['', [Validators.required]],
                    numero_exterior: ['', [Validators.required]],
                    codigo_postal:   ['', [Validators.required, Validators.pattern(VALID_POSTAL_CODE), Validators.minLength(5), Validators.maxLength(5)]],
                }),
                detalles_constructivos: this._builder.group({
                    medidas:        [''],
                    m2_terreno:     ['', Validators.min(1)],
                    m2_construidos: ['', Validators.min(0)],
                    m2_comunes:     ['', Validators.min(0)],
                    num_sanitarios: ['', Validators.min(0)],
                }),
                amenidades: ['', [Validators.required, Validators.maxLength(500)]],
                rentado:    [false],
                datos_renta: this._builder.group({
                    costo_renta:         ['', Validators.min(0)],
                    costo_mantenimiento: ['', Validators.min(0)],
                    incremento_anual:    [''],
                    pagos_pendientes:    [{}],
                }),
                datos_venta: this._builder.group({
                    tipo_uso:    [''],
                    ocupado:     [false],
                    frente:      ['', Validators.min(1)],
                    fondo:       ['', Validators.min(1)],
                    profundo:    ['', Validators.min(1)],
                    m2_totales:  ['', Validators.min(1)],
                    costo_venta: ['', Validators.min(0)],
                }),
                imagenes:               [[]],
                status_propiedad:       [null, Validators.required],
                status_escritura:       [null, Validators.required],
                anio_adquisicion:       ['', Validators.required],
                valor_adquisicion:      ['', [Validators.required, Validators.min(0)]],
                valor_comercial_actual: ['', [Validators.required, Validators.min(0)]],
                nombre_escritura:       ['', Validators.required],
                mapa_lugar:             [[]],
                plano_lugar:            [[]],
                servicios:              [[]],
                observaciones:          ['', Validators.maxLength(500)],
            }),
            rentDebt: this._builder.group({
                name:   ['', [Validators.required, Validators.pattern(ONLY_LETTERS)]],
                amount: ['', [Validators.required, Validators.min(1)]],
            }),
            addArchive: this._builder.group({
                pictures: [[], Validators.required],
            }),
            addPlane: this._builder.group({
                image: ['', Validators.required],
            }),
            addMap: this._builder.group({
                image: ['', Validators.required],
            }),
            updateProperty: this._builder.group({
                nombre:         ['', Validators.required],
                tipo_propiedad: ['', Validators.required],
                direccion: this._builder.group({
                    estado:          ['', [Validators.required, Validators.pattern(ONLY_LETTERS_UTF8)]],
                    municio:         ['', [Validators.required, Validators.pattern(ONLY_LETTERS_UTF8)]],
                    colonia:         ['', [Validators.required]],
                    calle:           ['', [Validators.required]],
                    numero_exterior: ['', [Validators.required]],
                    codigo_postal:   ['', [Validators.required, Validators.pattern(VALID_POSTAL_CODE), Validators.minLength(5), Validators.maxLength(5)]],
                }),
                detalles_constructivos: this._builder.group({
                    medidas:        [''],
                    m2_terreno:     ['', Validators.min(1)],
                    m2_construidos: ['', Validators.min(0)],
                    m2_comunes:     ['', Validators.min(0)],
                    num_sanitarios: ['', Validators.min(0)],
                }),
                amenidades: ['', [Validators.required, Validators.maxLength(500)]],
                rentado:    [false],
                datos_renta: this._builder.group({
                    costo_renta:         ['', Validators.min(0)],
                    costo_mantenimiento: ['', Validators.min(0)],
                    incremento_anual:    [''],
                    pagos_pendientes:    [{}],
                }),
                datos_venta: this._builder.group({
                    tipo_uso:    [''],
                    ocupado:     [false],
                    frente:      ['', Validators.min(1)],
                    fondo:       ['', Validators.min(1)],
                    profundo:    ['', Validators.min(1)],
                    m2_totales:  ['', Validators.min(1)],
                    costo_venta: ['', Validators.min(0)],
                }),
                imagenes:               [[]],
                status_propiedad:       [null, Validators.required],
                status_escritura:       [null, Validators.required],
                anio_adquisicion:       ['', Validators.required],
                valor_adquisicion:      ['', [Validators.required, Validators.min(0)]],
                valor_comercial_actual: ['', [Validators.required, Validators.min(0)]],
                nombre_escritura:       ['', Validators.required],
                mapa_lugar:             [[]],
                plano_lugar:            [[]],
                servicios:              [[]],
                observaciones:          ['', Validators.maxLength(500)],
            }),
        });

        this.formErrs = {
            registerProperty: {
                estado:  { pattern: 'El estado solo puede contener letras' },
                municio: { pattern: 'El municipio solo puede contenter letras' },
                codigo_postal: {
                    pattern:   'El código postal solo pueden ser números',
                    minlength: 'El código postal debe tener 5 dígitos',
                    maxlength: 'El código postal debe tener 5 dígitos',
                },
                medidas:                { pattern: 'Las medidas dadas no son válidas sigue el formato NúmeroxNúmero', },
                m2_terreno:             { min: 'La medida del terreno debe tener un valor positivo', },
                m2_construidos:         { min: 'Los metros construidos no pueden ser negativos', },
                m2_comunes:             { min: 'Los metros comunes no pueden ser negativos' },
                num_sanitarios:         { min: 'El número de sanitarios no puede ser negativo', },
                costo_renta:            { min: 'El costo de la renta no puede ser negativo' },
                costo_mantenimiento:    { min: 'El costo del mantenimiento no puede ser negativo', },
                frente:                 { min: 'Las medidas deben tener un valor positivo' },
                fondo:                  { min: 'Las medidas deben tener un valor positivo' },
                profundo:               { min: 'Las medidas deben tener un valor positivo' },
                m2_totales:             { min: 'Las medidas deben tener un valor positivo' },
                costo_venta:            { min: 'El costo de la venta no puede ser negativo' },
                valor_adquisicion:      { min: 'El valor de adquisición no puede ser negativo', },
                valor_comercial_actual: { min: 'El valor comercial no puede ser negativo', },
                amenidades:             { max: 'Los caractéres máximos son 500', },
                observaciones:          { max: 'Los caractéres máximos son 500', },
            },
            rentDebt: {
                name:   { pattern: 'El nombre del adeudo no puede llevar tildes, números o caractéres especiales' },
                amount: { min: 'El adeudo no puede ser cero ni negativo' },
            },
            addArchive: {},
            addPlane: {},
            addMap: {},
            updateProperty: {
                estado:  { pattern: 'El estado solo puede contener letras' },
                municio: { pattern: 'El municipio solo puede contenter letras' },
                codigo_postal: {
                    pattern:   'El código postal solo pueden ser números',
                    minlength: 'El código postal debe tener 5 dígitos',
                    maxlength: 'El código postal debe tener 5 dígitos',
                },
                medidas:                { pattern: 'Las medidas dadas no son válidas sigue el formato NúmeroxNúmero', },
                m2_terreno:             { min: 'La medida del terreno debe tener un valor positivo', },
                m2_construidos:         { min: 'Los metros construidos no pueden ser negativos', },
                m2_comunes:             { min: 'Los metros comunes no pueden ser negativos' },
                num_sanitarios:         { min: 'El número de sanitarios no puede ser negativo', },
                costo_renta:            { min: 'El costo de la renta no puede ser negativo' },
                costo_mantenimiento:    { min: 'El costo del mantenimiento no puede ser negativo', },
                frente:                 { min: 'Las medidas deben tener un valor positivo' },
                fondo:                  { min: 'Las medidas deben tener un valor positivo' },
                profundo:               { min: 'Las medidas deben tener un valor positivo' },
                m2_totales:             { min: 'Las medidas deben tener un valor positivo' },
                costo_venta:            { min: 'El costo de la venta no puede ser negativo' },
                valor_adquisicion:      { min: 'El valor de adquisición no puede ser negativo', },
                valor_comercial_actual: { min: 'El valor comercial no puede ser negativo', },
                amenidades:             { max: 'Los caractéres máximos son 500', },
                observaciones:          { max: 'Los caractéres máximos son 500', },
            },
        };

        this.$routes = signal({
            registerProperty: { route: '/propiedades',                       method: 'POST' },
            getProperties:    { route: '/propiedades',                       method: 'GET' },
            getPropertyId:    { route: '/propiedades/:property_id',          method: 'GET' },
            saveArchive:      { route: '/propiedades/upload-file-propiedad', method: 'POST' },
            saveMap:          { route: '/propiedades/upload-file-plano',     method: 'POST' },
            savePlane:        { route: '/propiedades/upload-file-mapa',      method: 'POST' },
            updateProperty:   { route: '/propiedades/:property_id',          method: 'PUT' },
        });

        this.store = {
            loading: signal(false),
            details: signal({ data: [], buffer: {} }),
            filters: signal(this._builder.group({
                search: [""],
                type:   [null],
                status: [null],
                deed:   [null],
            })),
        };

        this.$statusModel = signal('properties');
        this.$status = signal([
        { label: 'Predio comercial',          severity: 'info',      slug: 'predio_comercial',    field: 'type' },
        { label: 'Predio habitacional',       severity: 'secondary', slug: 'predio_habitacional', field: 'type' },
        { label: 'Terreno',                   severity: 'warn',      slug: 'terreno',             field: 'type' },
        { label: 'Para renta',                severity: 'secondary', slug: 'renta',               field: 'build' },
        { label: 'Para venta',                severity: 'success',   slug: 'venta',               field: 'build' },
        { label: 'En proceso de inscripción', severity: 'warn',      slug: 'proceso_inscripcion', field: 'deed' },
        { label: 'En proceso de compra',      severity: 'secondary', slug: 'proceso_compra',      field: 'deed' },
        { label: 'En litigio',                severity: 'contrast',  slug: 'litigio',             field: 'deed' },
        { label: 'En proceso de venta',       severity: 'success',   slug: 'proceso_venta',       field: 'deed' },
        ]);

        this.upsetModelStatus();
    }

    public get registerFormStepActive(): number {
        return this.$registerFormStepActive();
    }

    public set registerFormStepActive(step: number) {
        this.$registerFormStepActive.set(step);
    }

    public formNextStep(): void {
        this.$registerFormStepActive.update((step: number) => step + 1);
    }

    public formPreviousStep(): void {
        this.$registerFormStepActive.update((step: number) => step - 1);
    }

    public upsetPropertiesData(): Promise<void> {
        return new Promise((resolve, reject) => {
            const headers: Record<string, string> = { 'IGNORE-MESSAGE': 'true' };

            this.store.loading.update(() => true);
            this.APIRequest<PropertiesList>('getProperties', { headers })
                .then(({ propiedades }: PropertiesList) => {
                    this.store.details.update(() => ({
                        data: propiedades,
                        buffer: this.toBuffer(propiedades),
                    }));

                    resolve();
                })
                .catch(() => reject())
                .finally(() => this.state.loading.update(() => false));
        });
    }

    public dialogRegisterProperty(): void {
        const form: FormGroup = this.$forms()['registerProperty'];
        const rentForm: FormGroup = this.$forms()['rentDebt'];
        const archiveForm: FormGroup = this.$forms()['addArchive'];
        const planeForm: FormGroup = this.$forms()['addPlane'];
        const mapForm: FormGroup = this.$forms()['addMap'];

        this.openDialog(RegisterPropertyDialogComponent, {
            header: 'Registrar nueva propiedad',
            styleClass: 'font-arimo',
        }).then(() => {
            form.reset();
            rentForm.reset();
            archiveForm.reset();
            planeForm.reset();
            mapForm.reset();

            form.markAsPristine();
            rentForm.markAsPristine();
            archiveForm.markAsPristine();
            planeForm.markAsPristine();
            mapForm.markAsPristine();
        });
    }

    private uploadPictures(formName: PropertiesForms): Promise<void> {
        return new Promise((resolve, reject) => {
            const formGeneral: FormGroup = this.$forms()[formName];
            const form: FormGroup = this.$forms()['addArchive'];
            const headers: Record<string, string> = { 'IGNORE-SUCESS': 'true' };
            let { valid, value } = form;

            value.pictures = value.pictures.filter((image: string) => !image.startsWith('http://'));

            if (!valid || !value.length) return resolve();

            Promise.all((value.pictures as string[]).map((image: string) =>
                this.APIRequest<Picture>("saveArchive", { headers, payload: { image } })
            ))
                .then((pictures: Picture[]) => {
                    formGeneral.patchValue({
                        imagenes: [
                            ...(formGeneral.controls['imagenes'].value || []),
                            ...pictures
                        ]
                    });
                    resolve();
                })
                .catch(() => reject());
        });
    }

    private uploadFiles(formName: PropertiesForms, file: 'plane' | 'map'): Promise<void> {
        return new Promise((resolve, reject) => {
            const formGeneral: FormGroup = this.$forms()[formName];
            const form: FormGroup = this.$forms()[file === 'plane' ? 'addPlane' : 'addMap'];
            const { valid, value } = form;

            if (!valid || value.image.startsWith('http://')) return resolve();

            const headers: Record<string, string> = { 'IGNORE-SUCESS': 'true' };
            const payload: ReqAddArchive = { ...value };

            this.APIRequest<Picture>(file === 'plane' ? 'savePlane' : 'saveMap', { headers, payload })
                .then((map: Picture) => {
                    formGeneral.patchValue({ [file === 'plane' ? 'plano_lugar' : 'mapa_lugar']: [map] });
                    resolve();
                })
                .catch(() => reject());
        });
    }

    private validatePictures(formName: PropertiesForms): Promise<void> {
        return new Promise((resolve, reject) => {
            this.uploadPictures(formName)
                .then(() => this.uploadFiles(formName, 'plane'))
                .then(() => this.uploadFiles(formName, 'map'))
                .then(() => resolve())
                .catch(() => reject());
        });
    }

    public registerProperty(): Promise<void> {
        return new Promise((resolve, reject) => {
            const form: FormGroup = this.$forms()['registerProperty'];
            const { valid } = form;
            const headers: Record<string, string> = {
                'IGNORE-SUCESS': 'true',
                'DATE-FORMAT': 'yyyy',
            };

            if (!valid) return this.newToast({
                message: 'Completa todos los campos obligatorios para poder registrar la propiedad',
                header:  'Error',
                type:    'danger',
            });

            this.state.loading.update(() => true);
            this.validatePictures('registerProperty')
                .then(() => {
                    const payload: ReqRegisterProperty = { ...form.value };
                    return this.APIRequest('registerProperty', { headers, payload });
                })
                .then(() => this.upsetPropertiesData())
                .then(() => resolve())
                .catch(() => reject())
                .finally(() => this.state.loading.update(() => false));
        });
    }

    public dialogPropertyDetails(): void {
        const selected: Property | null = this.$selected();

        if (!selected) return;

        this.openDialog(PropertyDetailsDialogComponent, {
            header: `Detalles de ${selected.nombre}`,
            styleClass: "font-arimo",
        }).then(() => this.$selected.update(() => null));
    }

    public dialogUpdateProperty(): void {
        const selected: Property | null = this.$selected();
        const form: FormGroup = this.$forms()['updateProperty'];
        const rentForm: FormGroup = this.$forms()['rentDebt'];
        const archiveForm: FormGroup = this.$forms()['addArchive'];
        const planeForm: FormGroup = this.$forms()['addPlane'];
        const mapForm: FormGroup = this.$forms()['addMap'];

        if (!selected) return;
        if (selected.imagenes && selected.imagenes.length) archiveForm.patchValue({ pictures: selected.imagenes.map((picture: Picture) => picture.url) })
        if (selected.plano_lugar && selected.plano_lugar.length) planeForm.patchValue({ image: selected.plano_lugar.at(-1)?.url || ''  })
        if (selected.mapa_lugar && selected.mapa_lugar.length) mapForm.patchValue({ image: selected.mapa_lugar.at(-1)?.url || ''  })

        const yearAquisition: Date = new Date();

        yearAquisition.setFullYear(Number(selected.anio_adquisicion))
        form.patchValue({ ...selected, anio_adquisicion: yearAquisition });


        this.openDialog(UpdatePropertyDialogComponent, {
            header: `Actualizar ${selected.nombre}`,
            styleClass: "font-arimo",
        }).then(() => {
            this.$selected.update(() => null);

            form.reset();
            rentForm.reset();
            archiveForm.reset();
            planeForm.reset();
            mapForm.reset();

            form.markAsPristine();
            rentForm.markAsPristine();
            archiveForm.markAsPristine();
            planeForm.markAsPristine();
            mapForm.markAsPristine();
        });
    }

    public updateProperty(): Promise<void> {
        return new Promise((resolve, reject) => {
            const form: FormGroup = this.$forms()['updateProperty'];
            const { valid } = form;
            const headers: Record<string, string> = {
                'IGNORE-SUCESS': 'true',
                'DATE-FORMAT': 'yyyy',
            };

            if (!valid) return this.newToast({
                message: 'Completa todos los campos obligatorios para poder registrar la propiedad',
                header:  'Error',
                type:    'danger',
            });
            

            this.state.loading.update(() => true);
            this.validatePictures('updateProperty')
                .then(() => {
                    const payload: ReqRegisterProperty = { ...form.value };
                    return this.APIRequest('updateProperty', { headers, payload });
                })
                .then(() => this.upsetPropertiesData())
                .then(() => resolve())
                .catch(() => reject())
                .finally(() => this.state.loading.update(() => false));
        });
    }
}
