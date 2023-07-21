import yesNo from './fields/yesNo'
import hopingToGetWork from './fields/hopingToGetWork'
import educationLevel from './fields/educationLevel'
import qualificationLevel from './fields/qualificationLevel'
import otherQualifications from './fields/otherQualifications'
import typeOfWorkExperience from './fields/typeOfWorkExperience'
import workInterests from './fields/workInterests'
import skills from './fields/skills'
import interests from './fields/interests'
import abilityToWork from './fields/abilityToWork'

import qualifications from './pages/qualifications'
import qualificationDetails from './pages/qualificationDetails'

export default {
  fields: {
    yesNo,
    hopingToGetWork,
    educationLevel,
    qualificationLevel,
    otherQualifications,
    typeOfWorkExperience,
    workInterests,
    skills,
    interests,
    abilityToWork,
  },
  pages: {
    qualifications,
    qualificationDetails,
  },
}
