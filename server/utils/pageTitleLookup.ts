import PrisonerViewModel from '../viewModels/prisonerViewModel'
import findValue from './findValue'

const toSentenceCase = (str: string) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const pageTitleLookup = (prisoner: PrisonerViewModel, url: string) => {
  const prisonerName = `${toSentenceCase(prisoner.firstName)} ${toSentenceCase(prisoner.lastName)}`
  const lookup = {
    view: `${prisonerName}`,
    'check-answers': `Check your answers before saving them to ${prisonerName}'s plan`,
    'hoping-to-get-work': `Is ${prisonerName} hoping to get work when they're released?`,
    'education-level': `What's the highest level of education ${prisonerName} has completed?`,
    'qualification-level': `What level of qualification does ${prisonerName} want to add`,
    'qualification-details': 'Add a degree qualification',
    'other-qualifications': `Does ${prisonerName} have any other training or vocational qualifications?`,
    'qualifications-list': `${prisonerName}'s qualifications`,
    'has-worked-before': `Has ${prisonerName} worked before?`,
    'type-of-work-experience': `What type of work has ${prisonerName} done before?`,
    'work-interests': `What type of work is ${prisonerName} interested in?`,
    'particular-interests': `Is ${prisonerName} interested in any particular jobs?`,
  }

  return findValue(url, lookup)
}

export default pageTitleLookup
