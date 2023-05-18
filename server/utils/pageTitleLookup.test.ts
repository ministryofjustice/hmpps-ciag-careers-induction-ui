/* eslint-disable @typescript-eslint/no-explicit-any */
import pageTitleLookup from './pageTitleLookup'

describe('#pageTitleLookup', () => {
  it('returns the correct page title for view url', () => {
    const prisoner = {
      firstName: 'john',
      lastName: 'doe',
    }
    const url = 'view'
    const expectedTitle = "John Doe's work profile"
    const pageTitle = pageTitleLookup(prisoner as any, url)
    expect(pageTitle).toEqual(expectedTitle)
  })

  it('returns the correct page title for check-answers url', () => {
    const prisoner = {
      firstName: 'jane',
      lastName: 'smith',
    }
    const url = 'check-answers'
    const expectedTitle = "Check your answers before saving them to Jane Smith's profile"
    const pageTitle = pageTitleLookup(prisoner as any, url)
    expect(pageTitle).toEqual(expectedTitle)
  })

  it('returns an empty string for an invalid url', () => {
    const prisoner = {
      firstName: 'jim',
      lastName: 'brown',
    }
    const url = 'invalid-url'
    const pageTitle = pageTitleLookup(prisoner as any, url)
    expect(pageTitle).toEqual(undefined)
  })
})
