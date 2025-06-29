import { Component, computed, effect, inject, signal } from '@angular/core';
import { IpcService } from './shared/electron/ipc.service';
import { Channels } from './shared/electron/types/data.types';
import { ScannerService } from './shared/services/scanner.service';



interface owo {
  id: number;
}
@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <ng-container>
      <!-- <h1 class="bg-red-500">Hola mundo</h1>
      <section *ngIf="$scanner()" style="size: 40px;">
        <p>Data del scanner:</p>
        {{$scanner()}}
      </section>

      <button (click)="printTest()">Enviar</button> -->

      <app-table/>
      
      
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

    // console.log(this.owo3.value());
    // console.log(this.owo4.value());

    // this.owo3.data = [{id: 200}];
    // this.owo4.data = {id: 101}

    // console.log(this.owo3.value());
    // console.log(this.owo4.value());

 



    // this._ipcService.send(Channels.MensajeDelMain, 'Hola main');
    // this._ipcService.on(Channels.RespuestaDelMain, (respuesta) => {
    //   console.log('Respuesta:', respuesta);
    // });
    
  }

   async printTest() {
    // console.log('Verificando impresora...');
  
    // const impresorasDescubiertas = await this._ipcService.invoke(Channels.GetPrintersIPs);
    // console.log("IMPRESORAS AQUI CULERO", impresorasDescubiertas);
  
    
  }
  

}
