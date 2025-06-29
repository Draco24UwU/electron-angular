import { Component, input, output } from '@angular/core';

interface Accion<T = any> {
    type: string;
    data: T;
}

@Component({
    selector: 'app-table',
    template: `
    <ng-container>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        @for(column of $columns(); track $index){
                        <th scope="col" class="px-6 py-3">
                            {{ column }}
                        </th>
                        }
                        <th scope="col" class="px-6 py-3">
                        Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    @for(data of $data(); track $index){
                    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        @for(nombre of $columns(); track $index ){
                            <td class="px-6 py-4">
                                {{ data[nombre] }}
                            </td>
                        }
                        <td class="py-4 text-left ">
                            <a class="font-medium text-blue-600 dark:text-blue-500 hover:underline pr-7" (click)="onAction('Editar',data)">Edit</a>
                            <a  class="font-medium text-blue-600 dark:text-blue-500 hover:underline" (click)="onAction('Eliminar',data)">Delete</a>
                        </td>
                    </tr>
                    }
                </tbody>
            </table>
            </div>
    </ng-container>
    `
})
export class AppTableComponent {
    public readonly $title = input<string>('', {alias: 'title'});
    public readonly $columns = input<string[]>([], {alias: 'columns'});
    public readonly $data = input<any[]>([], {alias: 'data'});
    public readonly $onAction = output<Accion>();

    // * Metodos del componente.
    public onAction(type: string, data: any) {
        this.$onAction.emit({type, data});
    }
}