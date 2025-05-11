import { messagesHandler } from './messages.handler';
import { registerUsbHandlers } from './usb.handler';

export function registerIpcHandlers() {
  registerUsbHandlers();
  messagesHandler();
}