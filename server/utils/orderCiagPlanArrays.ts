import _ from 'lodash'
import CiagPlan from '../data/ciagApi/interfaces/ciagPlan'

export const orderCiagPlanArrays = (ciagPlan: CiagPlan) => {
  _.set(ciagPlan, 'abilityToWork', orderCheckboxValue(_.get(ciagPlan, 'abilityToWork')))
  _.set(ciagPlan, 'reasonToNotGetWork', orderCheckboxValue(_.get(ciagPlan, 'reasonToNotGetWork')))
  _.set(
    ciagPlan,
    'workExperience.typeOfWorkExperience',
    orderCheckboxValue(_.get(ciagPlan, 'workExperience.typeOfWorkExperience')),
  )
  _.set(ciagPlan, 'workInterests.workInterests', orderCheckboxValue(_.get(ciagPlan, 'workInterests.workInterests')))
  _.set(ciagPlan, 'skillsAndInterests.skills', orderCheckboxValue(_.get(ciagPlan, 'skillsAndInterests.skills')))
  _.set(
    ciagPlan,
    'skillsAndInterests.personalInterests',
    orderCheckboxValue(_.get(ciagPlan, 'skillsAndInterests.personalInterests')),
  )
  _.set(
    ciagPlan,
    'qualificationsAndTraining.additionalTraining',
    orderCheckboxValue(_.get(ciagPlan, 'qualificationsAndTraining.additionalTraining')),
  )
  _.set(
    ciagPlan,
    'inPrisonInterests.inPrisonWork',
    orderCheckboxValue(_.get(ciagPlan, 'inPrisonInterests.inPrisonWork')),
  )
  _.set(
    ciagPlan,
    'inPrisonInterests.inPrisonEducation',
    orderCheckboxValue(_.get(ciagPlan, 'inPrisonInterests.inPrisonEducation')),
  )

  _.set(
    ciagPlan,
    'workInterests.particularJobInterests',
    orderObjectValue(_.get(ciagPlan, 'workInterests.particularJobInterests'), 'workInterest'),
  )
  _.set(
    ciagPlan,
    'workExperience.workExperience',
    orderObjectValue(_.get(ciagPlan, 'workExperience.workExperience'), 'typeOfWorkExperience'),
  )
  _.set(
    ciagPlan,
    'qualificationsAndTraining.qualifications',
    orderObjectValue(_.get(ciagPlan, 'qualificationsAndTraining.qualifications'), 'subject', 'desc'),
  )

  return ciagPlan
}

export const orderCheckboxValue = (values: string[]) =>
  _.isEmpty(values) ? values : [...values.filter(v => v !== 'OTHER').sort(), ...values.filter(v => v === 'OTHER')]

export const orderObjectValue = (values: Record<string, unknown>[], sortKey: string, direction = 'asc') =>
  _.isEmpty(values)
    ? values
    : [
        ..._.sortBy(
          values.filter(v => v[sortKey] !== 'OTHER'),
          sortKey,
          direction,
        ),
        ...values.filter(v => v[sortKey] === 'OTHER'),
      ]
