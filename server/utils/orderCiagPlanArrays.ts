import _ from 'lodash'
import CiagPlan from '../data/ciagApi/interfaces/ciagPlan'

export const orderCiagPlanArrays = (ciagPlan: CiagPlan) => {
  _.set(ciagPlan, 'abilityToWork', orderCheckboxValue(_.get(ciagPlan, 'abilityToWork')))
  _.set(ciagPlan, 'reasonToNotGetWork', orderCheckboxValue(_.get(ciagPlan, 'reasonToNotGetWork')))

  if (ciagPlan.workExperience !== null) {
    _.set(
      ciagPlan,
      'workExperience.typeOfWorkExperience',
      orderCheckboxValue(_.get(ciagPlan, 'workExperience.typeOfWorkExperience')),
    )
  }

  if (ciagPlan.workExperience !== null) {
    _.set(
      ciagPlan,
      'workExperience.workExperience',
      orderObjectValue(_.get(ciagPlan, 'workExperience.workExperience'), 'typeOfWorkExperience'),
    )
    if (_.get(ciagPlan, 'workExperience.workInterests') !== null) {
      _.set(
        ciagPlan,
        'workExperience.workInterests.particularJobInterests',
        orderObjectValue(_.get(ciagPlan, 'workExperience.workInterests.particularJobInterests'), 'workInterest'),
      )
      _.set(
        ciagPlan,
        'workExperience.workInterests.workInterests',
        orderCheckboxValue(_.get(ciagPlan, 'workExperience.workInterests.workInterests')),
      )
    }
  }

  if (ciagPlan.skillsAndInterests !== null) {
    _.set(ciagPlan, 'skillsAndInterests.skills', orderCheckboxValue(_.get(ciagPlan, 'skillsAndInterests.skills')))
    _.set(
      ciagPlan,
      'skillsAndInterests.personalInterests',
      orderCheckboxValue(_.get(ciagPlan, 'skillsAndInterests.personalInterests')),
    )
  }

  if (ciagPlan.qualificationsAndTraining !== null) {
    _.set(
      ciagPlan,
      'qualificationsAndTraining.additionalTraining',
      orderCheckboxValue(_.get(ciagPlan, 'qualificationsAndTraining.additionalTraining')),
    )
    _.set(
      ciagPlan,
      'qualificationsAndTraining.qualifications',
      orderObjectValue(_.get(ciagPlan, 'qualificationsAndTraining.qualifications'), 'subject', 'desc'),
    )
  }

  if (ciagPlan.inPrisonInterests !== null) {
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
  }

  return ciagPlan
}

export const orderCheckboxValue = <T>(values: T[]): T[] =>
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
