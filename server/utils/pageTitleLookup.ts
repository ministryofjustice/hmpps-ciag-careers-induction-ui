import PrisonerViewModel from '../viewModels/prisonerViewModel'
import findValue from './findValue'

const toSentenceCase = (str: string) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const pageTitleLookup = (prisoner: PrisonerViewModel, url: string) => {
  const lookup = {
    view: `${toSentenceCase(prisoner.firstName)} ${toSentenceCase(prisoner.lastName)}'s work profile`,
    'new-status': 'Change work status',
    'check-answers': `Check your answers before saving them to ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )}'s profile`,
    'ineligabineligable-to-work': `${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} is not allowed to work in the UK`,
    'right-to-work': 'Right to work in the UK',
    'support-opt-in': `Does ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} want support to get work?`,
    'already-in-place': `What does ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} have in place already?`,
    identification: `What type of ID does ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} have?`,
    'ability-to-work': `What might affect ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )}'s ability to work?`,
    'manage-drugs-and-alcohol': `Is ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} currently able to manage their drug or alcohol dependency?`,
    'type-of-work': `What type of work is ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} interested in?`,
    'support-declined-reason': `Why does ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} not want support?`,
    'what-needs-to-change': `What change in circumstances would make ${toSentenceCase(
      prisoner.firstName,
    )} ${toSentenceCase(prisoner.lastName)} want to get work?`,
    'job-of-particular-interest': `Is ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} interested in a particular job?`,
    'work-experience': `Does ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} have any previous work or volunteering experience?`,
    'training-and-qualifications': `Does ${toSentenceCase(prisoner.firstName)} ${toSentenceCase(
      prisoner.lastName,
    )} have any qualifications or training?`,
  }

  return findValue(url, lookup)
}

export default pageTitleLookup
