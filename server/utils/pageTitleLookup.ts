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
    qualifications: `${toSentenceCase(prisoner.firstName)} ${toSentenceCase(prisoner.lastName)}'s qualifications`,
    'education-level': `What's the highest level of education ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} has completed?`,
    'qualification-level': `What level of qualification does ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} want to add`,
    'qualification-details': 'Add a degree qualification',
  }

  return findValue(url, lookup)
}

export default pageTitleLookup
