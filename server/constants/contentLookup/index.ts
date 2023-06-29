import yesNo from './fields/yesNo'
import hopingToGetWork from './fields/hopingToGetWork'
import educationLevel from './fields/educationLevel'
import qualificationLevel from './fields/qualificationLevel'
import otherQualifications from './fields/otherQualifications'
import typeOfWorkExperience from './fields/typeOfWorkExperience'

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
  },
  pages: {
    qualifications,
    qualificationDetails,
  },
}
