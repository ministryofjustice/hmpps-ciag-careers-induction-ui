import type { Request } from 'express'

export const setSessionData = (
  req: Request,
  keys: string[],
  newValue: string | boolean | number | object | Record<string, unknown>,
): void => {
  req.session.data[keys.join('_')] = newValue
}

export const getSessionData = (
  req: Request,
  keys: string[],
  defaultValue?: string | boolean | number | object | Record<string, unknown>,
) => {
  return req.session.data[keys.join('_')] || defaultValue
}

export const deleteSessionData = (req: Request, keys: string[]): void => {
  if (req.session.data[keys.join('_')]) {
    delete req.session.data[keys.join('_')]
  }
}
