import { usb } from 'usb';
import { ipcMain } from 'electron';
import { Channels } from '../../../src/app/shared/electron/types/data.types';

export function registerUsbHandlers() {
  ipcMain.handle(Channels.GetUsbDevices, async () => {
    return usb.getDeviceList().map(device => ({
      deviceName: null,
      vendorId: device.deviceDescriptor.idVendor,
      productId: device.deviceDescriptor.idProduct,
    }));
  });
}