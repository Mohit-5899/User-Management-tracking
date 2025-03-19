// src/services/encryption.js
import { Buffer } from 'buffer';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

export const encryption = {
  async generateKey() {
    return await window.crypto.subtle.generateKey(
      { name: ALGORITHM, length: KEY_LENGTH },
      true,
      ['encrypt', 'decrypt']
    );
  },

  async encryptImage(imageData, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    const encodedImage = new TextEncoder().encode(imageData);

    const encryptedData = await window.crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      encodedImage
    );

    return {
      encrypted: Buffer.from(encryptedData).toString('base64'),
      iv: Buffer.from(iv).toString('base64'),
      authTag: Buffer.from(encryptedData.slice(-16)).toString('base64'),
    };
  },

  async decryptImage(encryptedData, key, iv, authTag) {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: Buffer.from(iv, 'base64'),
      },
      key,
      Buffer.from(encryptedData, 'base64')
    );

    return new TextDecoder().decode(decryptedData);
  },

  async exportKey(key) {
    const exported = await window.crypto.subtle.exportKey('raw', key);
    return Buffer.from(exported).toString('base64');
  },

  async importKey(keyData) {
    const keyBuffer = Buffer.from(keyData, 'base64');
    return await window.crypto.subtle.importKey(
      'raw',
      keyBuffer,
      ALGORITHM,
      true,
      ['encrypt', 'decrypt']
    );
  }
};