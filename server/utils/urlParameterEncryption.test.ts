/* eslint-disable @typescript-eslint/no-explicit-any */
import { encryptUrlParameter, decryptUrlParameter } from './urlParameterEncryption'

describe('urlParameterEncryption', () => {
  describe('encryptUrlParameter', () => {
    it('should encrypt the url parameter', () => {
      const parameter = 'example parameter'
      const encryptedParameter = encryptUrlParameter(parameter)

      expect(encryptedParameter).not.toBe(parameter)
      expect(typeof encryptedParameter).toBe('string')
    })
  })

  describe('decryptUrlParameter', () => {
    it('should decrypt the encrypted url parameter', () => {
      const parameter = 'example parameter'
      const encryptedParameter = encryptUrlParameter(parameter)
      const decryptedParameter = decryptUrlParameter(encryptedParameter)

      expect(decryptedParameter).toBe(parameter)
    })

    it('should return an empty string if the parameter is not a string', () => {
      const parameter = 123
      const decryptedParameter = decryptUrlParameter(parameter as any)

      expect(decryptedParameter).toBe('')
    })
  })
})
