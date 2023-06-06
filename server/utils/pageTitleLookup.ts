import PrisonerViewModel from '../viewModels/prisonerViewModel'
import findValue from './findValue'

const toSentenceCase = (str: string) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const pageTitleLookup = (prisoner: PrisonerViewModel, url: string) => {
  const lookup = {
    view: `${toSentenceCase(prisoner.firstName)} ${toSentenceCase(prisoner.lastName)}`,
    'check-answers': `Check your answers before saving them to ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )}'s plan`,
    'hoping-to-get-work': `Is ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} hoping to get work when they're released?`,
    qualifications: `${prisoner.firstName} ${prisoner.lastName}'s qualifications`,
  }

  return findValue(url, lookup)
}

export default pageTitleLookup
