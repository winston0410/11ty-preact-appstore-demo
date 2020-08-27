import * as R from 'ramda'

const fetchRequest = (apiUrl) => fetch(apiUrl)
  .then(response => response.json())

// 24rs in ms = 86400000
const hasPassedADay = R.pipe(
  R.subtract(Date.now),
  R.lt(86400000)
)

const accessResults = R.pipe(
  R.prop('feed'),
  R.prop('results')
)

const checkIfDataReady = (fn) => (app) => R.pipe(
  R.unless(
    R.isNil,
    R.map(fn)
  )
)(app)

export {
  fetchRequest,
  hasPassedADay,
  accessResults,
  checkIfDataReady
}
