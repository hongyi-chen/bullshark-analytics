import crypto from 'crypto';

function keyFromBase64(keyB64: string): Buffer {
  const key = Buffer.from(keyB64, 'base64');
  if (key.length !== 32) {
    throw new Error('APP_ENCRYPTION_KEY must decode to 32 bytes (base64-encoded)');
  }
  return key;
}

export function encryptString(plaintext: string, keyB64: string): string {
  const key = keyFromBase64(keyB64);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  // payload: iv (12) + tag (16) + ciphertext (n)
  return Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

export function decryptString(payloadB64: string, keyB64: string): string {
  const key = keyFromBase64(keyB64);
  const payload = Buffer.from(payloadB64, 'base64');
  if (payload.length < 12 + 16 + 1) throw new Error('Invalid encrypted payload');

  const iv = payload.subarray(0, 12);
  const tag = payload.subarray(12, 28);
  const ciphertext = payload.subarray(28);

  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString('utf8');
}
