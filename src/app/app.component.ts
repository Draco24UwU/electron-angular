import { Component, computed, effect, inject, signal } from '@angular/core';
import { IpcService } from './shared/electron/ipc.service';
import { Channels } from './shared/electron/types/data.types';
import { ScannerService } from './shared/services/scanner.service';

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <ng-container>
      <h1 class="bg-red-500">Hola mundo</h1>
      <section *ngIf="$scanner()" style="size: 40px;">
        <p>Data del scanner:</p>
        {{$scanner()}}
      </section>

      <button (click)="printTest()">Enviar</button>
      
      
    </ng-container>
  `
})
export class AppComponent {
  private readonly _ipcService = inject(IpcService);
  private readonly _scannerService = inject(ScannerService);

  public $scanner = computed(()=> this._scannerService.scanner());
  public respuesta: string = "";
  public devices: any[] = [];

  constructor(){
    this._ipcService.send(Channels.MensajeDelMain, 'Hola main');
    this._ipcService.on(Channels.RespuestaDelMain, (respuesta) => {
      console.log('Respuesta:', respuesta);
    });
    
  }

   async printTest() {
    console.log('Verificando impresora...');
    
    const connection = await this._ipcService.invoke(Channels.CheckPrinterConnection);
    const printraw = await this._ipcService.invoke(Channels.PrintRaw, "Hola MUNDO xdd");
    


    console.log(connection);
    
  }
  

}
