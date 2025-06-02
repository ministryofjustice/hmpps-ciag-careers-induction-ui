import crypto from 'crypto'

export default function uuidv4() {
  return crypto.randomUUID()
}
