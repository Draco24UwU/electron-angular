import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('ipc', {
  send: (channel: string, data?: any): void => {
    ipcRenderer.send(channel, data);
  },

  on: (channel: string, func: (...args: any[]) => void): void => {
    ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any[]) => func(...args));
  },

  invoke: <T = any>(channel: string, data?: any): Promise<T> => {
    return ipcRenderer.invoke(channel, data);
  }
});