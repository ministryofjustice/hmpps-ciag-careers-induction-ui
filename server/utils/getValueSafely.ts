import _ from 'lodash'

const getValueSafely = (obj: NonNullable<unknown>, path: string, def: unknown = undefined) => {
  const val = _.get(obj, path)

  if (typeof val === 'boolean' || typeof val === 'number') {
    return val
  }

  return _.isEmpty(val) ? def : val
}

export default getValueSafely
