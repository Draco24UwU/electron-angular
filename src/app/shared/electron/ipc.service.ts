import { Injectable } from "@angular/core";
import { Channels } from "./types/data.types";


@Injectable({
  providedIn: "root"
})
export class IpcService {
    private ipcRenderer: any;

    constructor() {
      if ((<any>window).ipc) {
        this.ipcRenderer = (<any>window).ipc;
      } else {
        console.warn('No estás en Electron. IPC no disponible.');
      }
    }
  
    send(channel: Channels, data?: any) {
      this.ipcRenderer?.send(channel, data);
    }
  
    on(channel: Channels, listener: (...args: any[]) => void) {
      this.ipcRenderer?.on(channel, listener);
    }
  
    invoke<T = any>(channel: Channels, data?: any): Promise<T> {
      return this.ipcRenderer?.invoke(channel, data);
    }
}