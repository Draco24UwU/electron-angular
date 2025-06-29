import { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } from "node-thermal-printer";
import { ipcMain, PrinterInfo, webContents } from "electron";
import mdns from 'multicast-dns';
import { Channels } from "../../../src/app/shared/electron/types/data.types";
import { exec } from 'child_process';
import os from 'os';


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
 
  //* Verificar conexión con la impresora.
  ipcMain.handle(Channels.CheckPrinterConnection, async () => {
    if(!thermalPrinter) return "Tamales";

    try {
      const isConnected = await thermalPrinter.isPrinterConnected();
      return { connected: isConnected, error: null };
    } catch (error) {
      return { connected: false, error: error };
    }
  });

  //* Imprimir contenido.
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

  //* Imprimir contenido RAW.
  ipcMain.handle(Channels.PrintRaw, async (event, data: string) => {
    if(!thermalPrinter) return;
    try {
      const result = await thermalPrinter.raw(Buffer.from(data));
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error };
    }
  });

  // * Obtener las impresoras del sistema.
  ipcMain.handle(Channels.GetPrinters, async (): Promise<PrinterInfo[]> => {
    const webContentsList = webContents.getAllWebContents();
    const printersInfoArray = await Promise.all(webContentsList.map(async (wc) => {
      return await wc.getPrintersAsync();
    }));
    return printersInfoArray.flat();
  });

  // * Obtener la IP de las impresoras.
  ipcMain.handle(Channels.GetPrintersIPs, async () => {
  const platform = os.platform(); // 'win32', 'darwin' (mac), 'linux'
  let command = '';

  // Comando según el sistema operativo
  switch (platform) {
    case 'win32': // Windows
      command = 'netstat -ano | find "ESTABLISHED" | find "9100"';
      break;
    case 'darwin': // macOS
      command = 'lsof -i :9100 | grep ESTABLISHED';
      break;
    case 'linux': // Linux
      command = 'netstat -tuln | grep 9100';
      break;
    default:
      return [];
  }

  return new Promise((resolve) => {
    exec(command, (error, stdout) => {
      if (error) {
        console.error("Error al buscar impresoras:", error);
        return resolve([]);
      }

      // Extrae IPs de la salida
      const ipRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g;
      const ips = [...new Set(stdout.match(ipRegex) || [])]; // Elimina duplicados

      resolve(ips);
    });
  });
});

  // * Funcion para descrubir impresoras en el sistema (IP).

  ipcMain.handle(Channels.DiscoverPrinters, async (): Promise<string[]> => {
    return new Promise((resolve) => {
        exec('avahi-browse -r _ipp._tcp.local | grep "IPv4" | awk \'{print $4}\'', 
            (error, stdout) => {
                if (error) {
                    console.error('Error:', error);
                    resolve([]);
                } else {
                    resolve(stdout.split('\n').filter(Boolean));
                }
            });
    });
});


}
