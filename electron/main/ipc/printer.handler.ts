import { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } from "node-thermal-printer";
import { ipcMain } from "electron";
import { Channels } from "../../../src/app/shared/electron/types/data.types";


//* Inicializa la impresora (debes configurar el driver correctamente)
let thermalPrinter: ThermalPrinter | null = null;

export function initializePrinter() {
  try {
    thermalPrinter = new ThermalPrinter({
      type: PrinterTypes.STAR,
      interface: 'tcp://192.168.100.181:9100', 
      characterSet: CharacterSet.PC852_LATIN2,  
      options: { timeout: 5000 },

    });
    console.log('✅ Impresora inicializada correctamente');
  } catch (error) {
    throw new Error(`❌ Error al inicializar la impresora: ${error}`);
  }
}

export function setupPrinterHandlers() {
 
  //* Verificar conexión con la impresora
  ipcMain.handle(Channels.CheckPrinterConnection, async () => {
    if(!thermalPrinter) return "Tamales";

    try {
      const isConnected = await thermalPrinter.isPrinterConnected();
      return { connected: isConnected, error: null };
    } catch (error) {
      return { connected: false, error: error };
    }
  });

  //* Imprimir contenido
  ipcMain.handle(Channels.PrintContent, async (event, content: string) => {
    if(!thermalPrinter) return;

    try {
      thermalPrinter.clear();
      thermalPrinter.println(content);
      thermalPrinter.cut();
      
      const result = await thermalPrinter.execute();
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error };
    }
  });

  //* Imprimir RAW
  ipcMain.handle(Channels.PrintRaw, async (event, data: Buffer) => {
    if(!thermalPrinter) return;

    try {
      const result = await thermalPrinter.raw(Buffer.from(data));
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error };
    }
  });
}
