import { enc, AES } from 'crypto-js'
import config from '../config'

// Simple util to encrypt url parameters such as from to prevent simple injection of external urls etc
const PASSPHRASE = config.urlParameterPassphrase

export function encryptUrlParameter(plaintext: string): string {
  const encrypted = AES.encrypt(plaintext, PASSPHRASE).toString()
  return encodeURIComponent(encrypted)
}

export function decryptUrlParameter(ciphertext: string): string {
  try {
    if (typeof ciphertext !== 'string') {
      return ''
    }
    const decoded = decodeURIComponent(ciphertext)
    const decrypted = AES.decrypt(decoded, PASSPHRASE).toString(enc.Utf8)
    return decrypted
  } catch {
    return ''
  }
}
