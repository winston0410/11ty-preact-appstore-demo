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

export {
  fetchRequest,
  hasPassedADay,
  accessResults
}
