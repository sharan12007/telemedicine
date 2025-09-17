import QRCode from 'qrcode';
import { BrowserQRCodeReader } from '@zxing/library'; // Fixed: Added proper import

export function generateQRCode(text) {
  return QRCode.toDataURL(text);
}

export function scanQRCode(image) {
  return new Promise((resolve, reject) => {
    try {
      const codeReader = new BrowserQRCodeReader();
      codeReader.decodeFromImageElement(image)
        .then(result => resolve(result.text))
        .catch(err => reject(err));
    } catch (error) {
      reject(new Error('Failed to initialize QR code scanner: ' + error.message));
    }
  });
}