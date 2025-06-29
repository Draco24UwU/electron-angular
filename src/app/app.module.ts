import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ButtonModule} from 'primeng/button'
import { RippleModule } from 'primeng/ripple';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { noop } from 'rxjs';
import { SharedComponentsModule } from './shared/components/shared-components.module'; 


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule,
    RippleModule,
    SharedComponentsModule
],
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || "none",
          cssLayer: {
            name: "primeng",
            order: "primeng, tailwind-utilities",
          },
        }
      },
      translation: {
        startsWith:  'Comienza con',
        contains:    'Contiene',
        notContains: 'No contiene',
        endsWith:    'Termina con',
        equals:      'Igual',
        notEquals:   'No es igual',
        noFilter:    'Sin filtro',
        lt:          'Menos que',
        lte:         'Menos que o igual a',
        gt:          'Mas grande que',
        gte:         'Mayor qué o igual a',
        is:          'Es',
        isNot:       'No es',
        before:      'Before',
        after:       'After',
        apply:       'Aplicar',
        matchAll:    'Coincidir con todos',
        matchAny:    'Coincidir con cualquiera',
        addRule:     'Agregar regla',
        removeRule:  'Eliminar regla',
        accept:      'Si',
        reject:      'No',
        choose:      'Escoger',
        upload:      'Subir',
        cancel:      'Cancelar',
        dayNames: [
            'Domingo',
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado',
        ],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin:   ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
        monthNames: [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ],
        monthNamesShort: [
            'Ene',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic',
        ],
        today:          'Hoy',
        clear:          'Limpiar',
        weekHeader:     'Sm',
        passwordPrompt: 'Ingresa una contraseña',
        weak:           'Débil',
        medium:         'Segura',
        strong:         'Muy segura',
    },
    })

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
