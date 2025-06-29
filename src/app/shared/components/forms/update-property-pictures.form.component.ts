import { Component, inject } from '@angular/core';
import { PropertiesService } from '../../services/properties.service';
import { InputFileField } from '../../types/common.type';

@Component({
    selector: 'app-update-property-pictures-form',
    standalone: false,
    template: `
        <div class="w-full flex flex-col items-start justify-start">
            <app-input-file-field [data]="fieldPictures" class="w-full" />
            <app-input-file-field [data]="fieldPlane" class="mt-5" />
            <app-input-file-field [data]="fieldMap" class="mt-3" />
        </div>
    `,
})
export class UpdatePropertyPicturesFormComponent {
    private readonly _properties: PropertiesService = inject(PropertiesService);

    public fieldPictures: InputFileField = {
        form: this._properties.formsBuffer['addArchive'].form,
        name: 'pictures',
        label: 'Imagenes de la propiedad',
        accept: 'image/*',
        multiple: true,
        clear: true,
    };
    public fieldPlane: InputFileField = {
        form: this._properties.formsBuffer['addPlane'].form,
        name: 'image',
        label: 'Plano de la propiedad',
        accept: 'application/pdf image/*',
        clear: true,
        size: 'small',
        maxSize: 1024 ** 2 * 25,
    };
    public fieldMap: InputFileField = {
        form: this._properties.formsBuffer['addMap'].form,
        name: 'image',
        label: 'Mapa de la propiedad',
        accept: 'application/pdf image/*',
        clear: true,
        size: 'small',
        maxSize: 1024 ** 2 * 25,
    };

    constructor() {}
}
