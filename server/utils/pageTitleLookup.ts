import findValue from './findValue'

const toSentenceCase = (str: string) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const pageTitleLookup = (prisoner: { firstName: string; lastName: string }, url: string) => {
  const prisonerName = `${toSentenceCase(prisoner.firstName)} ${toSentenceCase(prisoner.lastName)}`
  const lookup = {
    view: `${prisonerName}'s learning and work progress`,
    skills: `What skills does ${prisonerName} feel they have?`,
    'check-your-answers': `Check your answers before saving them to ${prisonerName}'s plan`,
    'hoping-to-get-work': `Is ${prisonerName} hoping to get work when they're released?`,
    'education-level': `What's the highest level of education ${prisonerName} completed before entering prison?`,
    'qualification-level': `What level of qualification does ${prisonerName} want to add`,
    'qualification-details': 'Add a degree qualification',
    'additional-training': `Does ${prisonerName} have any other training or vocational qualifications?`,
    'qualifications-list': `${prisonerName}'s qualifications`,
    'has-worked-before': `Has ${prisonerName} worked before?`,
    'type-of-work-experience': `What type of work has ${prisonerName} done before?`,
    'work-interests': `What type of work is ${prisonerName} interested in?`,
    'particular-job-interests': `Is ${prisonerName} interested in any particular jobs?`,
    'in-prison-work': `What type of work would ${prisonerName} like to do in prison?`,
    'in-prison-education': `What type of training and education activities would ${prisonerName} like to do in prison?`,
    'personal-interests': `What are ${prisonerName}'s interests?`,
    'does-not-want-work': `Why does ${prisonerName} not want work after release?`,
    'reason-to-not-get-work': `What could stop ${prisonerName} working when they are released?`,
    'wants-to-add-qualifications': `Does ${prisonerName} have any other educational qualifications they want to be recorded?`,
  }

  return findValue(url, lookup)
}

export default pageTitleLookup
