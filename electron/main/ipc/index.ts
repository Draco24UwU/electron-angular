import { messagesHandler } from './messages.handler';
import { setupPrinterHandlers } from './printer.handler';
import { registerUsbHandlers } from './usb.handler';

export function registerIpcHandlers() {
  registerUsbHandlers();
  messagesHandler();
  setupPrinterHandlers();
}