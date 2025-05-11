import { ipcMain } from "electron";
import { Channels } from "../../../src/app/shared/electron/types/data.types";

export function messagesHandler(){
    ipcMain.on(Channels.MensajeDelMain, (event, data) => {
        console.log('Me llego:', data);
        event.reply(Channels.RespuestaDelMain, 'Aquí está la respuesta');
    });
}